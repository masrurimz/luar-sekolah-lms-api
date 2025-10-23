/**
 * Delete Todo Handler
 *
 * Application layer: Implements TodoContracts.delete with public access.
 * Coordinates between repository and service layers for todo deletion.
 *
 * Architecture:
 * - Uses implement() with TodoContracts.delete for type-safe handler
 * - Uses publicProcedure for public access (no authentication required)
 * - Validates todo existence before deletion
 * - Applies service layer business rules for deletion
 * - Coordinates with TodoRepository for data removal
 * - Throws typed errors with automatic inference
 *
 * Layer: Application
 * Dependencies: Domain contracts, todo repository, todo service
 */

import { implement } from "@orpc/server";
import type { Context } from "@/lib/orpc/context";
import { TodoContracts } from "../-domain/contracts";
import { TodoRepository } from "../-lib/todo-repository";

export const deleteTodo = implement(TodoContracts.delete)
  .$context<Context>()
  .handler(async ({ input, context, errors }) => {
    const { id } = input;

    // First check if todo exists
    const existingTodo = await TodoRepository.getById(context.db, id);
    if (!existingTodo) {
      throw errors.NOT_FOUND({
        data: {
          id,
        },
      });
    }

    // Repository operation to delete todo
    const deleted = await TodoRepository.delete(context.db, id);

    if (!deleted) {
      throw errors.CANNOT_DELETE({
        data: {
          id,
          reason: "Todo could not be deleted",
        },
      });
    }

    // Return success object as per contract
    return {
      success: true,
      id,
    };
  });;
