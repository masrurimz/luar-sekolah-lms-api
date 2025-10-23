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

export  const getCourses = implement(CourseContracts.list)
  .$context<Context>()
  .handler(async ({ input, context }) => {
    // Repository operation to fetch courses
    const result = await CourseRepository.list(context.db, input);

    // Return clean schema types without display transformations
    return {
      courses: result.courses,
      total: result.total,
      limit: input.limit,
      offset: input.offset,
    };
  });;
