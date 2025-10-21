/**
 * Todo Domain Contracts
 *
 * Contract-first API definitions using oc builder with error composition.
 * Contracts define complete API surface (input/output/errors) before implementation.
 *
 * Layer: Domain (innermost)
 * Dependencies: Domain schemas and errors
 *
 * Pattern: Abstract class with static readonly contract properties.
 * All contracts inherit standard errors and can add operation-specific errors.
 */

import { z } from "zod";
import { todoErrors } from "./errors";
import {
  TodoInputSchemas,
  TodoOutputSchemas,
} from "./schemas";

/**
 * Todo Contracts
 *
 * Abstract class containing all oRPC API contracts for todo management.
 * All contracts are static readonly - no instantiation required.
 */
export abstract class TodoContracts {
  private constructor() {}

  /**
   * Get Todo Contract
   * Retrieve a single todo by ID
   */
  static readonly get = todoErrors
    .input(TodoInputSchemas.getTodo)
    .output(TodoOutputSchemas.todo)
    .route({
      operationId: 'getTodo',
      summary: 'Get Todo by ID',
      description: 'Retrieve detailed information about a specific todo using its unique identifier',
      tags: ['Todos'],
      method: 'GET',
      path: '/todos/{id}',
    });

  /**
   * Get Todos Contract
   * List todos with pagination and filtering
   */
  static readonly list = todoErrors
    .input(TodoInputSchemas.getTodos)
    .output(TodoOutputSchemas.todos)
    .route({
      operationId: 'getTodos',
      summary: 'List Todos',
      description: 'Retrieve a paginated list of todos with optional filtering by completion status',
      tags: ['Todos'],
      method: 'GET',
      path: '/todos',
    });

  /**
   * Create Todo Contract
   * Create a new todo
   */
  static readonly create = todoErrors
    .input(TodoInputSchemas.createTodo)
    .output(TodoOutputSchemas.todo)
    .route({
      operationId: 'createTodo',
      summary: 'Create Todo',
      description: 'Create a new todo item with specified text and optional completion status',
      tags: ['Todos'],
      method: 'POST',
      path: '/todos',
    });

  /**
   * Update Todo Contract
   * Update todo fields (partial update)
   */
  static readonly update = todoErrors
    .input(TodoInputSchemas.updateTodo)
    .output(TodoOutputSchemas.todo)
    .route({
      operationId: 'updateTodo',
      summary: 'Update Todo',
      description: 'Update specific fields of an existing todo. Only provided fields will be updated',
      tags: ['Todos'],
      method: 'PUT',
      path: '/todos/{id}',
    });

  /**
   * Delete Todo Contract
   * Delete a todo
   */
  static readonly delete = todoErrors
    .input(TodoInputSchemas.deleteTodo)
    .output(
      z.object({
        success: z.boolean(),
        id: z.string(),
      })
    )
    .route({
      operationId: 'deleteTodo',
      summary: 'Delete Todo',
      description: 'Delete a todo permanently. Cannot be undone',
      tags: ['Todos'],
      method: 'DELETE',
      path: '/todos/{id}',
    });

  /**
   * Toggle Todo Contract
   * Toggle todo completion status
   */
  static readonly toggle = todoErrors
    .input(TodoInputSchemas.toggleTodo)
    .output(TodoOutputSchemas.todo)
    .route({
      operationId: 'toggleTodo',
      summary: 'Toggle Todo Completion',
      description: 'Toggle the completion status of a todo item (completed ↔ not completed)',
      tags: ['Todos'],
      method: 'PATCH',
      path: '/todos/{id}/toggle',
    });
}
