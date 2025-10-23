/**
 * Get My Courses Handler
 *
 * Application layer: Implements EnrollmentContracts.getMyCourses with protected access.
 * Retrieves courses enrolled by authenticated user with privacy protection.
 *
 * Architecture:
 * - Uses implement() with EnrollmentContracts.getMyCourses for type-safe handler
 * - Uses protectedProcedure for authenticated access (authentication required)
 * - Coordinates with EnrollmentRepository for user-specific queries
 * - Applies comprehensive service layer validation
 * - Includes user-specific filtering and statistics
 * - Throws typed errors with automatic inference
 *
 * Layer: Application
 * Dependencies: Domain contracts, enrollment repository, course service
 */

import { implement } from "@orpc/server";
import type { Context } from "@/lib/orpc/context";
import { EnrollmentContracts } from "../-domain/contracts";
import { EnrollmentRepository } from "../-lib/enrollment-repository";
import { EnrollmentService } from "../-domain/services";

export  const getMyCourses = implement(EnrollmentContracts.getMyCourses)
  .$context<Context>()
  .handler(async ({ input, context, errors }) => {
    const { limit = 50, offset = 0 } = input;
    const userId = context.session?.user?.id;

    // Authentication check (protectedProcedure should handle this, but we double-check)
    if (!userId) {
      throw errors.UNAUTHORIZED({
        data: { operation: "get-my-courses" },
      });
    }

    // Repository operation to fetch user's enrollments
    const result = await EnrollmentRepository.findByUser(context.db, userId, {
      limit,
      offset,
    });

    // Apply business logic transformations
    const enrollmentsWithDisplayInfo = result.enrollments.map((enrollment) => {
      const displayInfo = EnrollmentService.getEnrollmentDisplayInformation(
        enrollment,
        enrollment.course
      );

      return {
        ...enrollment,
        course: enrollment.course ? {
          ...enrollment.course,
          price: parseFloat(enrollment.course.price), // Convert decimal string to number
        } : undefined,
        _display: displayInfo,
      };
    });

    // Calculate user statistics
    const statistics = EnrollmentService.calculateEnrollmentStatistics(
      result.enrollments,
      result.enrollments.map(e => e.course).filter(Boolean) as any[]
    );

    return {
      enrollments: enrollmentsWithDisplayInfo,
      total: result.total,
      limit,
      offset,
      _statistics: statistics,
    };
  });;
