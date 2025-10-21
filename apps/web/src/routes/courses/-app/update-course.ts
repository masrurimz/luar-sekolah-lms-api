/**
 * Update Course Handler
 *
 * Application layer: Implements CourseContracts.update with public access.
 * Updates course fields with comprehensive validation.
 *
 * Architecture:
 * - Uses implement() with CourseContracts.update for type-safe handler
 * - Uses publicProcedure for public access (no authentication required)
 * - Coordinates with CourseRepository for data updates
 * - Applies comprehensive service layer validation
 * - Handles partial updates with business rule validation
 * - Throws typed errors with automatic inference
 *
 * Layer: Application
 * Dependencies: Domain contracts, course service, course repository
 */

import { implement } from "@orpc/server";
import type { Context } from "@/lib/orpc/context";
import { CourseContracts } from "../-domain/contracts";
import { CourseRepository } from "../-lib/course-repository";
import { CourseService } from "../-domain/services";

export const updateCourse = implement(CourseContracts.update)
  .$context<Context>()
  .handler(async ({ input, context, errors }) => {
    const { id, data } = input;

    try {
      // First, check if course exists
      const existingCourse = await CourseRepository.findById(context.db, id);

      if (!existingCourse) {
        throw errors.NOT_FOUND({
          data: { id },
        });
      }

      // Validate update data using service layer
      // Create a complete course object for validation by merging with existing data
      const courseForValidation = {
        ...existingCourse,
        ...data,
      };

      const validationResults = CourseService.validateCompleteCourse(courseForValidation);

      if (validationResults.length > 0) {
        const firstError = validationResults[0];
        throw errors.VALIDATION_FAILED({
          data: {
            field: firstError.field || "unknown",
            reason: firstError.reason || "Validation failed",
          },
        });
      }

      // Check if course can be updated
      const canUpdate = CourseService.canCourseBeUpdated(existingCourse);
      if (!canUpdate) {
        throw errors.CANNOT_UPDATE({
          data: {
            id,
            reason: "Course cannot be updated in current state",
          },
        });
      }

      // Repository operation to update course
      const updatedCourse = await CourseRepository.update(context.db, id, data);

      if (!updatedCourse) {
        throw errors.NOT_FOUND({
          data: { id },
        });
      }

      // Return clean schema type without display transformations
      return updatedCourse;
    } catch (dbError) {
      // Handle database errors
      console.error("Database error in updateCourse:", dbError);

      // If it's already a known error, re-throw it
      if (dbError && typeof dbError === "object" && "code" in dbError) {
        throw dbError;
      }

      // Otherwise, throw a generic validation error
      throw errors.VALIDATION_FAILED({
        data: {
          field: "database",
          reason: "Failed to update course",
        },
      });
    }
  });
