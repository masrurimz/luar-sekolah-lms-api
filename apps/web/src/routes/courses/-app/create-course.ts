/**
 * Create Course Handler
 *
 * Application layer: Implements CourseContracts.create with public access.
 * Creates new courses with optional creator attribution for authenticated users.
 *
 * Architecture:
 * - Uses implement() with CourseContracts.create for type-safe handler
 * - Uses publicProcedure for public access (no authentication required)
 * - Coordinates with CourseRepository for data persistence
 * - Applies comprehensive service layer validation
 * - Handles creator attribution for authenticated users
 * - Throws typed errors with automatic inference
 *
 * Layer: Application
 * Dependencies: Domain contracts, course service, course repository
 */

import { implement } from "@orpc/server";
import type { Context } from "@/lib/orpc/context";
import { CourseContracts } from "../-domain/contracts";
import { CourseRepository } from "../-lib/course-repository";

export  const createCourse = implement(CourseContracts.create)
  .$context<Context>()
  .handler(async ({ input, context }) => {
    // Extract creator ID if user is authenticated
    const creatorId = context.session?.user?.id;

    // Prepare course data with creator attribution
    const courseData = {
      ...input,
      createdBy: creatorId, // Will be undefined for anonymous users
    };

    // Repository operation to create course
    const newCourse = await CourseRepository.create(context.db, courseData);

    // Return clean schema type without display transformations
    return newCourse;
  });;
