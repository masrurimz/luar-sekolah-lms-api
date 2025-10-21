import { sql } from 'drizzle-orm';
import {
  decimal,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { user } from './auth';
import { generateUUID } from './utils';

/**
 * Course table for storing course information
 * Supports public CRUD operations with optional creator attribution
 */
export const course = pgTable('course', {
  id: uuid('id').primaryKey().$defaultFn(generateUUID),
  name: varchar('name', { length: 255 }).notNull(),
  price: decimal('price', { precision: 10, scale: 2 })
    .notNull()
    .default('0.00'),
  categoryTag: text('category_tag')
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  thumbnail: text('thumbnail'),
  rating: decimal('rating', { precision: 3, scale: 1 }),
  createdBy: uuid('created_by').references(() => user.id, {
    onDelete: 'set null',
  }),
  createdAt: timestamp('created_at')
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp('updated_at')
    .$defaultFn(() => new Date())
    .notNull(),
});

/**
 * Enrollment table for tracking user-course relationships
 * Supports private enrollment operations requiring authentication
 */
export const enrollment = pgTable('course_enrollment', {
  id: uuid('id').primaryKey().$defaultFn(generateUUID),
  userId: uuid('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  courseId: uuid('course_id')
    .notNull()
    .references(() => course.id, { onDelete: 'cascade' }),
  enrolledAt: timestamp('enrolled_at')
    .$defaultFn(() => new Date())
    .notNull(),
});

// Type exports for TypeScript usage
export type Course = typeof course.$inferSelect;
export type NewCourse = typeof course.$inferInsert;
export type Enrollment = typeof enrollment.$inferSelect;
export type NewEnrollment = typeof enrollment.$inferInsert;
