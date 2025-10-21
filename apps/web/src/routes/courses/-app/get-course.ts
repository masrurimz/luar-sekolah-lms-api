/**
 * Get Course Handler
 *
 * Application layer: Implements CourseContracts.get with public access.
 * Retrieves a single course by ID with proper error handling.
 *
 * Architecture:
 * - Uses implement() with CourseContracts.get for type-safe handler
 * - Uses publicProcedure for public access (no authentication required)
 * - Coordinates with CourseRepository for data retrieval
 * - Applies service layer validation and transformations
 * - Throws typed errors with automatic inference
 *
 * Layer: Application
 * Dependencies: Domain contracts, course repository, course service
 */

import { implement } from "@orpc/server";
import type { Context } from "@/lib/orpc/context";
import { CourseContracts } from "../-domain/contracts";
import { CourseRepository } from "../-lib/course-repository";


export const getCourse = implement(CourseContracts.get)
  .$context<Context>()
  .handler(async ({ input, context, errors }) => {
    const { id } = input;

    try {
      // Repository operation to fetch course by ID
      const course = await CourseRepository.findById(context.db, id);

      if (!course) {
        throw errors.NOT_FOUND({
          data: { id },
        });
      }

      // Return clean schema type without display transformations
      return course;
    } catch (dbError) {
      // Handle database errors
      console.error("Database error in getCourse:", dbError);

      // If it's already a known error, re-throw it
      if (dbError && typeof dbError === "object" && "code" in dbError) {
        throw dbError;
      }

      // Otherwise, throw a generic validation error
      throw errors.VALIDATION_FAILED({
        data: {
          field: "database",
          reason: "Failed to retrieve course",
        },
      });
    }
  });
