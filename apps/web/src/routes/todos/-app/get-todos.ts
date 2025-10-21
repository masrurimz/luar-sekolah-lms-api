/**
 * Get Todos Handler
 *
 * Application layer: Implements TodoContracts.list with public access.
 * Coordinates between repository and service layers for todo listing.
 *
 * Architecture:
 * - Uses implement() with TodoContracts.list for type-safe handler
 * - Uses publicProcedure for public access (no authentication required)
 * - Coordinates with TodoRepository for data retrieval
 * - Applies service layer validation for business rules
 * - Throws typed errors with automatic inference
 *
 * Layer: Application
 * Dependencies: Domain contracts, todo repository, todo service
 */

import { implement } from "@orpc/server";
import type { Context } from "@/lib/orpc/context";
import { TodoContracts } from "../-domain/contracts";
import { TodoRepository } from "../-lib/todo-repository";
// TodoService not needed for this handler

export const getTodos = implement(TodoContracts.list)
  .$context<Context>()
  .handler(async ({ input, context, errors }) => {
    const { limit, offset, completed: _completed } = input;

    // Validate input parameters using service layer

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
      // Repository operation to fetch todos
      const result = await TodoRepository.list(context.db, input);

      // Return clean schema types without display transformations
      return {
        todos: result.todos,
        total: result.total,
        limit,
        offset,
      };
    } catch (dbError) {
      // Handle database errors
      console.error("Database error in getTodos:", dbError);

      throw errors.VALIDATION_FAILED({
        data: {
          field: "database",
          reason: "Failed to retrieve todos",
        },
      });
    }
  });
