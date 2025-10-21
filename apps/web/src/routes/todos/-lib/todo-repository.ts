/**
 * Todo Repository
 *
 * Data access layer for todos. Handles all database operations.
 * Returns raw database types, no business logic here.
 *
 * Layer: Repository (data access)
 * Dependencies: Database schema and connection
 */

import { and, asc, desc, eq, sql } from 'drizzle-orm';
import { todo } from '@/lib/db/schema/todo';
import type { DatabaseType } from '@/lib/db';
import type { Todo, NewTodo } from '../-domain/entities';
import type { CreateTodoInput, UpdateTodoInput, GetTodosInput } from '../-domain/schemas';

/**
 * Todo Repository - Data access operations
 */
export abstract class TodoRepository {
  /**
   * Create a new todo in the database
   */
  static async create(db: DatabaseType, input: CreateTodoInput): Promise<Todo> {
    const newTodo: NewTodo = {
      text: input.text,
      completed: input.completed ?? false,
    };

    const [result] = await db.insert(todo).values(newTodo).returning();
    return result;
  }

  /**
   * Get a specific todo by ID
   */
  static async getById(db: DatabaseType, id: string): Promise<Todo | null> {
    const [result] = await db.select().from(todo).where(eq(todo.id, id)).limit(1);
    return result || null;
  }

  /**
   * Get all todos with pagination and optional filtering
   */
  static async list(db: DatabaseType, input: GetTodosInput): Promise<{
    todos: Todo[];
    total: number;
  }> {
    const { limit = 50, offset = 0, completed } = input;

    // Build the base query conditions
    const conditions = [];

    // Add completed filter if specified
    if (completed !== undefined) {
      conditions.push(eq(todo.completed, completed));
    }

    // Get total count
    const countQuery = db.select({ count: sql<number>`count(*)` }).from(todo);
    if (conditions.length > 0) {
      countQuery.where(conditions[0]);
    }
    const [{ count }] = await countQuery;

    // Get todos with pagination
    let todosQuery = db
      .select()
      .from(todo)
      .orderBy(asc(todo.createdAt)) // Order by creation time
      .limit(limit)
      .offset(offset)
      .where(and(...conditions))


    const todos = await todosQuery;

    return {
      todos,
      total: Number(count),
    };
  }

  /**
   * Update an existing todo
   */
  static async update(db: DatabaseType, id: string, input: Partial<UpdateTodoInput>): Promise<Todo | null> {
    const updateData: Partial<Todo> = {};

    if (input.text !== undefined) {
      updateData.text = input.text;
    }

    if (input.completed !== undefined) {
      updateData.completed = input.completed;
    }

    // Only update if there's something to update
    if (Object.keys(updateData).length === 0) {
      return this.getById(db, id);
    }

    const [result] = await db
      .update(todo)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(todo.id, id))
      .returning();

    return result || null;
  }

  /**
   * Delete a todo by ID
   */
  static async delete(db: DatabaseType, id: string): Promise<boolean> {
    const result = await db.delete(todo).where(eq(todo.id, id)).returning();
    return result.length > 0;
  }

  /**
   * Toggle todo completion status
   */
  static async toggle(db: DatabaseType, id: string): Promise<Todo | null> {
    // First get the current todo
    const existingTodo = await this.getById(db, id);
    if (!existingTodo) {
      return null;
    }

    // Toggle the completion status
    const [result] = await db
      .update(todo)
      .set({
        completed: !existingTodo.completed,
        updatedAt: new Date()
      })
      .where(eq(todo.id, id))
      .returning();

    return result || null;
  }

  /**
   * Get todos by completion status
   */
  static async getByCompletedStatus(db: DatabaseType, completed: boolean, limit = 50, offset = 0): Promise<{
    todos: Todo[];
    total: number;
  }> {
    const whereCondition = eq(todo.completed, completed);

    // Get total count
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(todo)
      .where(whereCondition);

    // Get todos with pagination
    const todos = await db
      .select()
      .from(todo)
      .where(whereCondition)
      .orderBy(desc(todo.createdAt)) // Most recent first
      .limit(limit)
      .offset(offset);

    return {
      todos,
      total: Number(count),
    };
  }

  /**
   * Search todos by text content
   */
  static async search(db: DatabaseType, query: string, limit = 50, offset = 0): Promise<{
    todos: Todo[];
    total: number;
  }> {
    // Simple ILIKE search
    const searchPattern = `%${query}%`;
    const todos = await db
      .select()
      .from(todo)
      .where(sql`${todo.text} ILIKE ${searchPattern}`)
      .orderBy(desc(todo.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count for search
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(todo)
      .where(sql`${todo.text} ILIKE ${searchPattern}`);

    return {
      todos,
      total: Number(count),
    };
  }

  /**
   * Get todo statistics
   */
  static async getStats(db: DatabaseType): Promise<{
    total: number;
    completed: number;
    pending: number;
  }> {
    const [totalResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(todo);

    const [completedResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(todo)
      .where(eq(todo.completed, true));

    const total = Number(totalResult.count);
    const completed = Number(completedResult.count);

    return {
      total,
      completed,
      pending: total - completed,
    };
  }
}
