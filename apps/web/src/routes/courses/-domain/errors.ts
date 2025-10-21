/**
 * Course Domain Errors
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
 * Standard Course Errors
 *
 * All course-related errors with:
 * - Default message for consistency
 * - Typed data schema for additional context
 */
export const courseErrors = oc.errors({
  NOT_FOUND: {
    message: "Course not found",
    data: z.object({
      id: z.string(),
    }),
  },
  VALIDATION_FAILED: {
    message: "Course validation failed",
    data: z.object({
      field: z.string(),
      reason: z.string(),
    }),
  },
  INVALID_PRICE: {
    message: "Invalid course price",
    data: z.object({
      price: z.number(),
      reason: z.string(),
    }),
  },
  INVALID_CATEGORY_TAGS: {
    message: "Invalid category tags",
    data: z.object({
      tags: z.array(z.string()),
      reason: z.string(),
    }),
  },
  INVALID_RATING: {
    message: "Invalid course rating",
    data: z.object({
      rating: z.number(),
      reason: z.string(),
    }),
  },
  FREE_COURSE_HIGH_RATING: {
    message: "Free courses cannot have ratings above 3.0",
    data: z.object({
      price: z.number(),
      rating: z.number(),
    }),
  },
  PRAKERJA_PRICE_EXCEEDED: {
    message: "Prakerja courses should not exceed Rp 1,000,000",
    data: z.object({
      price: z.number(),
      categoryTags: z.array(z.string()),
    }),
  },
  CREATOR_NOT_FOUND: {
    message: "Course creator not found",
    data: z.object({
      creatorId: z.string(),
    }),
  },
  UNAUTHORIZED_ACCESS: {
    message: "Unauthorized access to course",
    data: z.object({
      courseId: z.string(),
      userId: z.string(),
    }),
  },
  CANNOT_DELETE: {
    message: "Course cannot be deleted",
    data: z.object({
      id: z.string(),
      reason: z.string(),
    }),
  },
  CANNOT_UPDATE: {
    message: "Course cannot be updated",
    data: z.object({
      id: z.string(),
      reason: z.string(),
    }),
  },
});

/**
 * Standard Enrollment Errors
 *
 * All enrollment-related errors with:
 * - Default message for consistency
 * - Typed data schema for additional context
 */
export const enrollmentErrors = oc.errors({
  NOT_FOUND: {
    message: "Enrollment not found",
    data: z.object({
      id: z.string(),
    }),
  },
  COURSE_NOT_FOUND: {
    message: "Course not found for enrollment",
    data: z.object({
      courseId: z.string(),
    }),
  },
  USER_NOT_FOUND: {
    message: "User not found for enrollment",
    data: z.object({
      userId: z.string(),
    }),
  },
  ALREADY_ENROLLED: {
    message: "User is already enrolled in this course",
    data: z.object({
      userId: z.string(),
      courseId: z.string(),
      enrollmentId: z.string().optional(),
    }),
  },
  ENROLLMENT_FAILED: {
    message: "Failed to enroll in course",
    data: z.object({
      userId: z.string(),
      courseId: z.string(),
      reason: z.string(),
    }),
  },
  CANNOT_UNENROLL: {
    message: "Cannot unenroll from course",
    data: z.object({
      enrollmentId: z.string(),
      reason: z.string(),
    }),
  },
  UNAUTHORIZED_ACCESS: {
    message: "Unauthorized access to enrollment",
    data: z.object({
      enrollmentId: z.string(),
      userId: z.string(),
    }),
  },
  VALIDATION_FAILED: {
    message: "Enrollment validation failed",
    data: z.object({
      field: z.string(),
      reason: z.string(),
    }),
  },
  UNAUTHORIZED: {
    message: "Authentication required for this operation",
    data: z.object({
      operation: z.string(),
    }),
  },
});

/**
 * Authentication Errors (for protected enrollment operations)
 */
export const authErrors = oc.errors({
  UNAUTHORIZED: {
    message: "Authentication required for this operation",
    data: z.object({
      operation: z.string(),
    }),
  },
  INVALID_SESSION: {
    message: "Invalid or expired session",
    data: z.object({
      sessionId: z.string().optional(),
    }),
  },
  INSUFFICIENT_PERMISSIONS: {
    message: "Insufficient permissions for this operation",
    data: z.object({
      userId: z.string(),
      requiredPermission: z.string(),
    }),
  },
});
