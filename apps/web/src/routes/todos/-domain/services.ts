/**
 * Todo Domain Services
 *
 * Business logic layer that contains domain rules and validation.
 * Pure functions without external dependencies - no database, no HTTP.
 *
 * Layer: Domain (business logic)
 * Dependencies: ONLY domain types and errors
 */


import type { CreateTodoInput, UpdateTodoInput } from "./schemas";

/**
 * Todo Service - Contains all business logic for todos
 */
export abstract class TodoService {
  /**
   * Validates todo text according to business rules
   */
  static validateTodoText(text: string): { valid: boolean; reason?: string } {
    // Check if text is empty or whitespace only
    if (!text || text.trim().length === 0) {
      return {
        valid: false,
        reason: "Todo text cannot be empty",
      };
    }

    // Check minimum length
    if (text.trim().length < 1) {
      return {
        valid: false,
        reason: "Todo text must be at least 1 character long",
      };
    }

    // Check maximum length
    if (text.length > 500) {
      return {
        valid: false,
        reason: "Todo text cannot exceed 500 characters",
      };
    }

    // Check for invalid content (business rule: no control characters)
    if (/[\x00-\x1F\x7F]/.test(text)) {
      return {
        valid: false,
        reason: "Todo text contains invalid characters",
      };
    }

    return { valid: true };
  }

  /**
   * Validates create todo input
   */
  static validateCreateTodo(input: CreateTodoInput): { valid: boolean; reason?: string; field?: string } {
    // Validate text
    const textValidation = this.validateTodoText(input.text);
    if (!textValidation.valid) {
      return {
        valid: false,
        reason: textValidation.reason,
        field: "text",
      };
    }

    // Validate completed status if provided
    if (typeof input.completed !== "undefined" && typeof input.completed !== "boolean") {
      return {
        valid: false,
        reason: "Completed status must be a boolean",
        field: "completed",
      };
    }

    return { valid: true };
  }

  /**
   * Validates update todo input
   */
  static validateUpdateTodo(input: UpdateTodoInput): { valid: boolean; reason?: string; field?: string } {
    // Validate ID format
    if (!input.id || typeof input.id !== "string") {
      return {
        valid: false,
        reason: "Todo ID is required",
        field: "id",
      };
    }

    // Validate UUID format (basic check)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(input.id)) {
      return {
        valid: false,
        reason: "Invalid todo ID format",
        field: "id",
      };
    }

    // Validate text if provided
    if (input.text !== undefined) {
      const textValidation = this.validateTodoText(input.text);
      if (!textValidation.valid) {
        return {
          valid: false,
          reason: textValidation.reason,
          field: "text",
        };
      }
    }

    // Validate completed status if provided
    if (input.completed !== undefined && typeof input.completed !== "boolean") {
      return {
        valid: false,
        reason: "Completed status must be a boolean",
        field: "completed",
      };
    }

    return { valid: true };
  }

  /**
   * Checks if a todo can be deleted (business rules)
   * Currently no restrictions, but placeholder for future rules
   */
  static canDeleteTodo(_todoId: string): { canDelete: boolean; reason?: string } {
    // Future business rules can be added here
    // For example: cannot delete completed todos, or todos older than X days

    return { canDelete: true };
  }

  /**
   * Sanitizes todo text (removes extra whitespace, normalizes)
   */
  static sanitizeTodoText(text: string): string {
    return text.trim().replace(/\s+/g, " ");
  }

  /**
   * Prepares todo data for creation (applies business logic)
   */
  static prepareTodoForCreation(input: CreateTodoInput): CreateTodoInput {
    return {
      text: this.sanitizeTodoText(input.text),
      completed: input.completed ?? false, // Default to false if not provided
    };
  }

  /**
   * Prepares todo data for update (applies business logic)
   */
  static prepareTodoForUpdate(input: UpdateTodoInput): Partial<UpdateTodoInput> {
    const prepared: Partial<UpdateTodoInput> = { id: input.id };

    if (input.text !== undefined) {
      prepared.text = this.sanitizeTodoText(input.text);
    }

    if (input.completed !== undefined) {
      prepared.completed = input.completed;
    }

    return prepared;
  }
}
