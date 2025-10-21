/**
 * Enroll Course Handler
 *
 * Application layer: Implements EnrollmentContracts.enroll with protected access.
 * Enrolls authenticated users in courses with duplicate checking.
 *
 * Architecture:
 * - Uses implement() with EnrollmentContracts.enroll for type-safe handler
 * - Uses protectedProcedure for authenticated access (authentication required)
 * - Coordinates with EnrollmentRepository for enrollment operations
 * - Coordinates with CourseRepository for course validation
 * - Applies comprehensive service layer validation
 * - Includes duplicate checking and user validation
 * - Throws typed errors with automatic inference
 *
 * Layer: Application
 * Dependencies: Domain contracts, enrollment service, repositories
 */

import { implement } from "@orpc/server";
import type { Context } from "@/lib/orpc/context";
import { EnrollmentContracts } from "../-domain/contracts";
import { EnrollmentRepository } from "../-lib/enrollment-repository";
import { CourseRepository } from "../-lib/course-repository";
import { EnrollmentService } from "../-domain/services";

export const enrollCourse = implement(EnrollmentContracts.enroll)
  .$context<Context>()
  .handler(async ({ input, context, errors }) => {
    const { courseId } = input;
    const userId = context.session?.user?.id;

    // Authentication check (protectedProcedure should handle this, but we double-check)
    if (!userId) {
      throw errors.UNAUTHORIZED({
        data: { operation: "enroll-course" },
      });
    }

    try {
      // Validate user can enroll using service layer
      const validationResult = await EnrollmentService.validateUserCanEnroll(userId, courseId, context.db);

      if (!validationResult.canEnroll) {
        throw errors.ALREADY_ENROLLED({
          data: {
            userId,
            courseId,
          },
        });
      }

      // Check if course exists
      const course = await CourseRepository.findById(context.db, courseId);

      if (!course) {
        throw errors.COURSE_NOT_FOUND({
          data: { courseId },
        });
      }

      // Check for duplicate enrollment
      const existingEnrollment = await EnrollmentRepository.findByUserAndCourse(context.db, userId, courseId);

      if (existingEnrollment) {
        throw errors.ALREADY_ENROLLED({
          data: {
            userId,
            courseId,
            enrollmentId: existingEnrollment.id,
          },
        });
      }

      // Repository operation to create enrollment
      const newEnrollment = await EnrollmentRepository.create(context.db, {
        userId,
        courseId,
      });

      // Fetch enrollment with course details for response
      const enrollmentWithCourse = await EnrollmentRepository.findById(context.db, newEnrollment.id);

      if (!enrollmentWithCourse) {
        throw errors.ENROLLMENT_FAILED({
          data: {
            userId,
            courseId,
            reason: "Failed to retrieve created enrollment",
          },
        });
      }


      return {
        ...enrollmentWithCourse,
        course: enrollmentWithCourse.course ? {
          ...enrollmentWithCourse.course,
          price: parseFloat(enrollmentWithCourse.course.price), // Convert decimal string to number
        } : undefined,
      };
    } catch (dbError) {
      // Handle database errors
      console.error("Database error in enrollCourse:", dbError);

      // If it's already a known error, re-throw it
      if (dbError && typeof dbError === "object" && "code" in dbError) {
        throw dbError;
      }

      // Otherwise, throw a generic validation error
      throw errors.VALIDATION_FAILED({
        data: {
          field: "database",
          reason: "Failed to enroll in course",
        },
      });
    }
  });
