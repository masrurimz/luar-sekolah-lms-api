/**
 * Toggle Todo Handler
 *
 * Application layer: Implements TodoContracts.toggle with public access.
 * Coordinates between repository for todo completion status toggle.
 *
 * Architecture:
 * - Uses implement() with TodoContracts.toggle for type-safe handler
 * - Uses publicProcedure for public access (no authentication required)
 * - Validates todo existence before toggle
 * - Coordinates with TodoRepository for status toggle
 * - Throws typed errors with automatic inference
 *
 * Layer: Application
 * Dependencies: Domain contracts, todo repository
 */

import { implement } from "@orpc/server";
import type { Context } from "@/lib/orpc/context";
import { TodoContracts } from "../-domain/contracts";
import { TodoRepository } from "../-lib/todo-repository";

export  const toggleTodo = implement(TodoContracts.toggle)
  .$context<Context>()
  .handler(async ({ input, context, errors }) => {
    const { id } = input;

    // Repository operation to toggle todo completion status
    const toggledTodo = await TodoRepository.toggle(context.db, id);

    if (!toggledTodo) {
      throw errors.NOT_FOUND({
        data: {
          id,
        },
      });
    }

    return toggledTodo;
  });;
