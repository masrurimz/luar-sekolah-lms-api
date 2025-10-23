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

export  const updateCourse = implement(CourseContracts.update)
  .$context<Context>()
  .handler(async ({ input, context, errors }) => {
    const { id, data } = input;

    // First, check if course exists
    const existingCourse = await CourseRepository.findById(context.db, id);

    if (!existingCourse) {
      throw errors.NOT_FOUND({
        data: { id },
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
  });;
