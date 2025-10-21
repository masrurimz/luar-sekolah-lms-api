/**
 * Get Todo Handler
 *
 * Application layer: Implements TodoContracts.get with public access.
 * Retrieves a specific todo by ID with proper error handling.
 *
 * Architecture:
 * - Uses implement() with TodoContracts.get for type-safe handler
 * - Uses publicProcedure for public access (no authentication required)
 * - Coordinates with TodoRepository for data retrieval
 * - Throws typed errors with automatic inference
 *
 * Layer: Application
 * Dependencies: Domain contracts, todo repository
 */

import { implement } from "@orpc/server";
import type { Context } from "@/lib/orpc/context";
import { TodoContracts } from "../-domain/contracts";
import { TodoRepository } from "../-lib/todo-repository";

export const getTodo = implement(TodoContracts.get)
  .$context<Context>()
  .handler(async ({ input, context, errors }) => {
    const { id } = input;

    try {
      // Repository operation to fetch specific todo
      const todo = await TodoRepository.getById(context.db, id);

      if (!todo) {
        throw errors.NOT_FOUND({
          data: {
            id,
          },
        });
      }

      return todo;
    } catch (dbError) {
      // Handle database errors
      console.error("Database error in getTodo:", dbError);

      throw errors.VALIDATION_FAILED({
        data: {
          field: "database",
          reason: "Failed to retrieve todo",
        },
      });
    }
  });