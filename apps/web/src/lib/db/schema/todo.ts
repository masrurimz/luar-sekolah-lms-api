import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { generateUUID } from './utils';

export const todo = pgTable('todo', {
  id: uuid('id').primaryKey().$defaultFn(generateUUID),
  text: text('text').notNull(),
  completed: boolean('completed').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});


export type Todo = typeof todo.$inferSelect;
export type NewTodo = typeof todo.$inferInsert;
