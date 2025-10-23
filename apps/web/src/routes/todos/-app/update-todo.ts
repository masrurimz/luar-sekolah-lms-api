/**
 * Update Todo Handler
 *
 * Application layer: Implements TodoContracts.update with public access.
 * Coordinates between repository and service layers for todo updates.
 *
 * Architecture:
 * - Uses implement() with TodoContracts.update for type-safe handler
 * - Uses publicProcedure for public access (no authentication required)
 * - Validates todo existence before update
 * - Applies service layer validation for business rules
 * - Coordinates with TodoRepository for data persistence
 * - Throws typed errors with automatic inference
 *
 * Layer: Application
 * Dependencies: Domain contracts, todo repository, todo service
 */

import { implement } from "@orpc/server";
import type { Context } from "@/lib/orpc/context";
import { TodoContracts } from "../-domain/contracts";
import { TodoRepository } from "../-lib/todo-repository";

export  const updateTodo = implement(TodoContracts.update)
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

    // Repository operation to update todo
    const updatedTodo = await TodoRepository.update(context.db, id, input);

    if (!updatedTodo) {
      throw errors.CANNOT_UPDATE({
        data: {
          id,
          reason: "Todo could not be updated",
        },
      });
    }

    return updatedTodo;
  });;
