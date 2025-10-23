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


export const getTodos = implement(TodoContracts.list)
  .$context<Context>()
  .handler(async ({ input, context }) => {
    // Repository operation to fetch todos
    const result = await TodoRepository.list(context.db, input);

    // Return clean schema types without display transformations
    return {
      todos: result.todos,
      total: result.total,
      limit: input.limit,
      offset: input.offset,
    };
  });;
