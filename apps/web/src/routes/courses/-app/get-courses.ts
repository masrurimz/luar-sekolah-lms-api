/**
 * Get Courses Handler
 *
 * Application layer: Implements CourseContracts.list with public access.
 * Coordinates between repository and service layers for course listing.
 *
 * Architecture:
 * - Uses implement() with CourseContracts.list for type-safe handler
 * - Uses publicProcedure for public access (no authentication required)
 * - Coordinates with CourseRepository for data retrieval
 * - Applies service layer validation for business rules
 * - Throws typed errors with automatic inference
 *
 * Layer: Application
 * Dependencies: Domain contracts, course repository, course service
 */

import { implement } from "@orpc/server";
import type { Context } from "@/lib/orpc/context";
import { CourseContracts } from "../-domain/contracts";
import { CourseRepository } from "../-lib/course-repository";
import { CourseService } from "../-domain/services";

export const getCourses = implement(CourseContracts.list)
  .$context<Context>()
  .handler(async ({ input, context, errors }) => {
    const { limit, offset, categoryTag } = input;

    // Validate input parameters using service layer
    if (categoryTag?.length) {
      const categoryValidation = CourseService.validateCategoryTags(categoryTag);
      if (!categoryValidation.valid) {
        throw errors.INVALID_CATEGORY_TAGS({
          data: {
            tags: categoryTag,
            reason: categoryValidation.reason || "Invalid category tags",
          },
        });
      }
    }

    // Validate pagination parameters
    if (limit && limit < 1) {
      throw errors.VALIDATION_FAILED({
        data: {
          field: "limit",
          reason: "Limit must be at least 1",
        },
      });
    }

    if (limit && limit > 100) {
      throw errors.VALIDATION_FAILED({
        data: {
          field: "limit",
          reason: "Limit cannot exceed 100",
        },
      });
    }

    if (offset && offset < 0) {
      throw errors.VALIDATION_FAILED({
        data: {
          field: "offset",
          reason: "Offset cannot be negative",
        },
      });
    }

    try {
      // Repository operation to fetch courses
      const result = await CourseRepository.list(context.db, input);

      // Return clean schema types without display transformations
      return {
        courses: result.courses,
        total: result.total,
        limit,
        offset,
      };
    } catch (dbError) {
      // Handle database errors
      console.error("Database error in getCourses:", dbError);

      throw errors.VALIDATION_FAILED({
        data: {
          field: "database",
          reason: "Failed to retrieve courses",
        },
      });
    }
  });
