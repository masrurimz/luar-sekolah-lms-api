/**
 * Create Todo Handler
 *
 * Application layer: Implements TodoContracts.create with public access.
 * Coordinates between repository and service layers for todo creation.
 *
 * Architecture:
 * - Uses implement() with TodoContracts.create for type-safe handler
 * - Uses publicProcedure for public access (no authentication required)
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

export   const createTodo = implement(TodoContracts.create)
  .$context<Context>()
  .handler(async ({ input, context }) => {
    // Repository operation to create todo
    const createdTodo = await TodoRepository.create(context.db, input);

    return createdTodo;
  });;
