/**
 * Delete Course Handler
 *
 * Application layer: Implements CourseContracts.delete with public access.
 * Deletes courses with proper error handling and business validation.
 *
 * Architecture:
 * - Uses implement() with CourseContracts.delete for type-safe handler
 * - Uses publicProcedure for public access (no authentication required)
 * - Coordinates with CourseRepository for deletion
 * - Applies business rule validation before deletion
 * - Handles enrollment count checks (business logic)
 * - Throws typed errors with automatic inference
 *
 * Layer: Application
 * Dependencies: Domain contracts, course repository, enrollment repository
 */

import { implement } from "@orpc/server";
import type { Context } from "@/lib/orpc/context";
import { CourseContracts } from "../-domain/contracts";
import { CourseRepository } from "../-lib/course-repository";
import { EnrollmentRepository } from "../-lib/enrollment-repository";

export const deleteCourse = implement(CourseContracts.delete)
  .$context<Context>()
  .handler(async ({ input, context, errors }) => {
    const { id } = input;

    // First, check if course exists
    const existingCourse = await CourseRepository.findById(context.db, id);

    if (!existingCourse) {
      throw errors.NOT_FOUND({
        data: { id },
      });
    }

    // Check if course has active enrollments
    const enrollmentStats = await EnrollmentRepository.findByCourse(context.db, id, 1, 0);

    if (enrollmentStats.total > 0) {
      throw errors.CANNOT_DELETE({
        data: {
          id,
          reason: `Course has ${enrollmentStats.total} active enrollments`,
        },
      });
    }

    // Repository operation to delete course
    const deleteSuccess = await CourseRepository.delete(context.db, id);

    if (!deleteSuccess) {
      throw errors.NOT_FOUND({
        data: { id },
      });
    }

    return {
      success: true,
      id,
    };
  });;
