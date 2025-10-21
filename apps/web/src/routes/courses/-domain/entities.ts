/**
 * Domain entities for Course feature
 * Directly inferred from database schema for type consistency
 */

// Import ONLY the types that are actually exported from the schema
import type {
  Course as CourseSchema,
  NewCourse as NewCourseSchema,
  Enrollment as EnrollmentSchema,
  NewEnrollment as NewEnrollmentSchema,
} from '@/lib/db/schema/course';

// Direct schema inference - NO custom types, just alias the schema types
export type Course = CourseSchema;
export type NewCourse = NewCourseSchema;
export type Enrollment = EnrollmentSchema;
export type NewEnrollment = NewEnrollmentSchema;

// All other types should come from schemas.ts, not defined here