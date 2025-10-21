/**
 * Domain entities for Todo feature
 * Directly inferred from database schema for type consistency
 */

// Import ONLY the types that are actually exported from the schema
import type {
  Todo as TodoSchema,
  NewTodo as NewTodoSchema,
} from '@/lib/db/schema/todo';

// Direct schema inference - NO custom types, just alias the schema types
export type Todo = TodoSchema;
export type NewTodo = NewTodoSchema;

// All other types should come from schemas.ts, not defined here