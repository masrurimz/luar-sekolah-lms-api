/**
 * Course Domain Contracts
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
import { courseErrors, enrollmentErrors } from "./errors";
import {
  CourseInputSchemas,
  CourseOutputSchemas,
  EnrollmentInputSchemas,
  EnrollmentOutputSchemas,
} from "./schemas";

/**
 * Course Contracts
 *
 * Abstract class containing all oRPC API contracts for course management.
 * All contracts are static readonly - no instantiation required.
 */
export abstract class CourseContracts {
  private constructor() {}

  /**
   * Get Course Contract
   * Retrieve a single course by ID
   */
  static readonly get = courseErrors
    .input(CourseInputSchemas.getCourse)
    .output(CourseOutputSchemas.course)
    .route({
      operationId: 'getCourse',
      summary: 'Get Course by ID',
      description: 'Retrieve detailed information about a specific course using its unique identifier',
      tags: ['Courses'],
      method: 'GET',
      path: '/course/{id}',
    });

  /**
   * Get Courses Contract
   * List courses with pagination and filtering
   */
  static readonly list = courseErrors
    .input(CourseInputSchemas.getCourses)
    .output(CourseOutputSchemas.courses)
    .route({
      operationId: 'getCourses',
      summary: 'List Courses',
      description: 'Retrieve a paginated list of courses with optional filtering by category tags',
      tags: ['Courses'],
      method: 'GET',
      path: '/courses',
    });

  /**
   * Create Course Contract
   * Create a new course
   */
  static readonly create = courseErrors
    .input(CourseInputSchemas.createCourse)
    .output(CourseOutputSchemas.course)
    .route({
      operationId: 'createCourse',
      summary: 'Create Course',
      description: 'Create a new course with specified details. Creator attribution is automatically added for authenticated users',
      tags: ['Courses'],
      method: 'POST',
      path: '/courses',
    });

  /**
   * Update Course Contract
   * Update course fields (partial update)
   */
  static readonly update = courseErrors
    .input(
      z.object({
        id: CourseInputSchemas.getCourse.shape.id,
        data: CourseInputSchemas.updateCourse,
      })
    )
    .output(CourseOutputSchemas.course)
    .route({
      operationId: 'updateCourse',
      summary: 'Update Course',
      description: 'Update specific fields of an existing course. Only provided fields will be updated',
      tags: ['Courses'],
      method: 'PUT',
      path: '/course/{id}',
    });

  /**
   * Delete Course Contract
   * Delete a course
   */
  static readonly delete = courseErrors
    .input(CourseInputSchemas.deleteCourse)
    .output(
      z.object({
        success: z.boolean(),
        id: z.string(),
      })
    )
    .route({
      operationId: 'deleteCourse',
      summary: 'Delete Course',
      description: 'Delete a course permanently. Cannot be undone and only allowed if no active enrollments exist',
      tags: ['Courses'],
      method: 'DELETE',
      path: '/course/{id}',
    });
}

/**
 * Enrollment Contracts
 *
 * Abstract class containing all oRPC API contracts for enrollment management.
 * These contracts use protected procedures and include authentication errors.
 */
export abstract class EnrollmentContracts {
  private constructor() {}

  /**
   * Enroll in Course Contract
   * Enroll authenticated user in a course
   */
  static readonly enroll = enrollmentErrors
    .input(EnrollmentInputSchemas.enrollCourse)
    .output(EnrollmentOutputSchemas.enrollmentWithCourse)
    .route({
      operationId: 'enrollCourse',
      summary: 'Enroll in Course',
      description: 'Enroll the authenticated user in a specific course. Prevents duplicate enrollments',
      tags: ['Enrollments'],
      method: 'POST',
      path: '/enrollments',
    });

  /**
   * Get My Courses Contract
   * Get courses enrolled by authenticated user
   */
  static readonly getMyCourses = enrollmentErrors
    .input(EnrollmentInputSchemas.getMyCourses)
    .output(EnrollmentOutputSchemas.myCourses)
    .route({
      operationId: 'getMyCourses',
      summary: 'Get My Enrolled Courses',
      description: 'Retrieve a list of courses the authenticated user is enrolled in, with enrollment details',
      tags: ['Enrollments'],
      method: 'GET',
      path: '/enrollments/my-courses',
    });

  /**
   * Get Enrollment Contract
   * Get specific enrollment details (for authenticated user)
   */
  static readonly getEnrollment = enrollmentErrors
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .output(EnrollmentOutputSchemas.enrollmentWithCourse)
    .route({
      operationId: 'getEnrollment',
      summary: 'Get Enrollment Details',
      description: 'Retrieve detailed information about a specific enrollment record',
      tags: ['Enrollments'],
      method: 'GET',
      path: '/enrollments/{id}',
    });

  /**
   * Unenroll from Course Contract
   * Remove user enrollment from a course
   */
  static readonly unenroll = enrollmentErrors
    .input(
      z.object({
        enrollmentId: z.string().uuid(),
      })
    )
    .output(
      z.object({
        success: z.boolean(),
        enrollmentId: z.string(),
      })
    )
    .route({
      operationId: 'unenrollCourse',
      summary: 'Unenroll from Course',
      description: 'Remove the authenticated user\'s enrollment from a course',
      tags: ['Enrollments'],
      method: 'DELETE',
      path: '/enrollments/{enrollmentId}',
    });
}
