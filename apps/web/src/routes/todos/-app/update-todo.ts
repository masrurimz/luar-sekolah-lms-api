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
import { TodoService } from "../-domain/services";

export const updateTodo = implement(TodoContracts.update)
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

    // Validate input using service layer
    const validation = TodoService.validateUpdateTodo(input);
    if (!validation.valid) {
      if (validation.field === "text") {
        if (validation.reason?.includes("cannot exceed")) {
          throw errors.TEXT_TOO_LONG({
            data: {
              text: input.text || "",
              maxLength: 500,
            },
          });
        } else if (validation.reason?.includes("must be at least")) {
          throw errors.TEXT_TOO_SHORT({
            data: {
              text: input.text || "",
              minLength: 1,
            },
          });
        } else {
          throw errors.INVALID_TEXT({
            data: {
              text: input.text || "",
              reason: validation.reason || "Invalid todo text",
            },
          });
        }
      } else {
        throw errors.VALIDATION_FAILED({
          data: {
            field: validation.field || "unknown",
            reason: validation.reason || "Validation failed",
          },
        });
      }
    }

    try {
      // Prepare update data using service layer
      const preparedUpdateData = TodoService.prepareTodoForUpdate(input);

      // Repository operation to update todo
      const updatedTodo = await TodoRepository.update(context.db, id, preparedUpdateData);

      if (!updatedTodo) {
        throw errors.CANNOT_UPDATE({
          data: {
            id,
            reason: "Todo could not be updated",
          },
        });
      }

      return updatedTodo;
    } catch (dbError) {
      // Handle database errors
      console.error("Database error in updateTodo:", dbError);

      throw errors.VALIDATION_FAILED({
        data: {
          field: "database",
          reason: "Failed to update todo",
        },
      });
    }
  });
