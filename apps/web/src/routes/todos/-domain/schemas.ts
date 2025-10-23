import { z } from 'zod';

/**
 * Abstract class containing primitive base schemas for Todo feature
 * Aligns with database schema types
 */
export abstract class TodoBaseSchemas {
  /**
   * UUID validation schema
   */
  static readonly uuid = z
    .uuidv7()
    .meta({
      description: 'Unique identifier for resources',
      examples: ['550e8400-e29b-41d4-a716-446655440000'],
    });

  /**
   * Todo text validation - required, non-empty string with length constraints
   */
  static readonly text = z
    .string()
    .min(1, 'Todo text is required')
    .max(500, 'Todo text cannot exceed 500 characters')
    .trim()
    .meta({
      description: 'Text content of the todo item',
      examples: ['Buy groceries', 'Complete project documentation', 'Call client'],
    });

  /**
   * Todo completion status validation
   */
  static readonly completed = z
    .boolean()
    .default(false)
    .meta({
      description: 'Whether the todo item is completed or not',
      examples: [true, false],
    });

  /**
   * Pagination limit validation
   */
  static readonly limit = z
    .number()
    .int('Limit must be an integer')
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .optional();

  /**
   * Pagination offset validation
   */
  static readonly offset = z
    .number()
    .int('Offset must be an integer')
    .min(0, 'Offset cannot be negative')
    .optional();
}

/**
 * Input schemas for API requests
 */
export abstract class TodoInputSchemas {
  static readonly createTodo = z.object({
    text: TodoBaseSchemas.text,
    completed: TodoBaseSchemas.completed.optional(),
  })
  .meta({
    description: 'Input data for creating a new todo',
    title: 'Create Todo Request',
  });

  static readonly updateTodo = z.object({
    id: TodoBaseSchemas.uuid,
    text: TodoBaseSchemas.text.optional(),
    completed: TodoBaseSchemas.completed.optional(),
  })
  .meta({
    description: 'Input data for updating an existing todo',
    title: 'Update Todo Request',
  });

  static readonly getTodo = z.object({
    id: TodoBaseSchemas.uuid,
  })
  .meta({
    description: 'Input data for retrieving a specific todo',
    title: 'Get Todo Request',
  });

  static readonly getTodos = z.object({
    limit: TodoBaseSchemas.limit,
    offset: TodoBaseSchemas.offset,
    completed: TodoBaseSchemas.completed.optional(),
  })
  .meta({
    description: 'Input data for retrieving a paginated list of todos',
    title: 'Get Todos Request',
  });

  static readonly deleteTodo = z.object({
    id: TodoBaseSchemas.uuid,
  })
  .meta({
    description: 'Input data for deleting a todo',
    title: 'Delete Todo Request',
  });

  static readonly toggleTodo = z.object({
    id: TodoBaseSchemas.uuid,
  })
  .meta({
    description: 'Input data for toggling todo completion status',
    title: 'Toggle Todo Request',
  });
}

/**
 * Output schemas for API responses
 */
export abstract class TodoOutputSchemas {
  static readonly todo = z.object({
    id: TodoBaseSchemas.uuid,
    text: TodoBaseSchemas.text,
    completed: TodoBaseSchemas.completed,
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .meta({
    description: 'Todo data response object (matches schema)',
    title: 'Todo Response',
  });

  static readonly todos = z.object({
    todos: z.array(TodoOutputSchemas.todo),
    total: z.number().int().optional(),
    limit: TodoBaseSchemas.limit.optional(),
    offset: TodoBaseSchemas.offset.optional(),
  })
  .meta({
    description: 'Paginated list of todos response',
    title: 'Todos List Response',
  });
}

// Export type inference from schemas - these are the ONLY types that should be used
export type CreateTodoInput = z.infer<typeof TodoInputSchemas.createTodo>;
export type UpdateTodoInput = z.infer<typeof TodoInputSchemas.updateTodo>;
export type GetTodoInput = z.infer<typeof TodoInputSchemas.getTodo>;
export type GetTodosInput = z.infer<typeof TodoInputSchemas.getTodos>;
export type DeleteTodoInput = z.infer<typeof TodoInputSchemas.deleteTodo>;
export type ToggleTodoInput = z.infer<typeof TodoInputSchemas.toggleTodo>;

export type TodoResponse = z.infer<typeof TodoOutputSchemas.todo>;
export type TodosResponse = z.infer<typeof TodoOutputSchemas.todos>;
