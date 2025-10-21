/**
 * Todo Domain Errors
 *
 * Standard error definitions using oc.errors() for type-safe error handling.
 * These errors serve as the single source of truth across all layers.
 *
 * Layer: Domain (innermost)
 * Dependencies: NONE (pure error definitions)
 *
 * Pattern: oc.errors() creates reusable error bases that can be composed
 * with contracts for full type inference from server to client.
 */

import { oc } from "@orpc/contract";
import { z } from "zod";

/**
 * Standard Todo Errors
 *
 * All todo-related errors with:
 * - Default message for consistency
 * - Typed data schema for additional context
 */
export const todoErrors = oc.errors({
  NOT_FOUND: {
    message: "Todo not found",
    data: z.object({
      id: z.string(),
    }),
  },
  VALIDATION_FAILED: {
    message: "Todo validation failed",
    data: z.object({
      field: z.string(),
      reason: z.string(),
    }),
  },
  INVALID_TEXT: {
    message: "Invalid todo text",
    data: z.object({
      text: z.string(),
      reason: z.string(),
    }),
  },
  TEXT_TOO_LONG: {
    message: "Todo text exceeds maximum length",
    data: z.object({
      text: z.string(),
      maxLength: z.number(),
    }),
  },
  TEXT_TOO_SHORT: {
    message: "Todo text is too short",
    data: z.object({
      text: z.string(),
      minLength: z.number(),
    }),
  },
  CANNOT_DELETE: {
    message: "Todo cannot be deleted",
    data: z.object({
      id: z.string(),
      reason: z.string(),
    }),
  },
  CANNOT_UPDATE: {
    message: "Todo cannot be updated",
    data: z.object({
      id: z.string(),
      reason: z.string(),
    }),
  },
  UNAUTHORIZED_ACCESS: {
    message: "Unauthorized access to todo",
    data: z.object({
      todoId: z.string(),
      userId: z.string(),
    }),
  },
});