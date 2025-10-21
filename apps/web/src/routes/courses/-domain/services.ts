/**
 * Course Domain Services
 *
 * Pure business logic layer for course and enrollment operations.
 * This layer contains no infrastructure dependencies - only domain rules.
 *
 * Pattern: Abstract class with static methods (no instantiation)
 * Dependencies: ONLY domain entities and pure TypeScript
 */

import type { Course, Enrollment } from "./entities";
import type { CreateCourseInput, UpdateCourseInput } from "./schemas";

/**
 * Course Validation Result
 */
export type CourseValidationResult = {
  valid: boolean;
  reason?: string;
  field?: string;
};

/**
 * Enrollment Validation Result
 */
export type EnrollmentValidationResult = {
  valid: boolean;
  reason?: string;
  field?: string;
};

/**
 * Course Service
 *
 * Abstract class containing pure business logic for course operations.
 * All methods are static - no instantiation required.
 *
 * This service contains the core business rules and validation logic
 * for course management, independent of any infrastructure concerns.
 */
export abstract class CourseService {
  private constructor() {}

  // Business constants
  private static readonly MAX_CATEGORY_TAGS = 2;
  private static readonly VALID_CATEGORY_TAGS = ['prakerja', 'spl'] as const;
  private static readonly MIN_PRICE = 0;
  private static readonly MAX_PRICE = 99999999.99;
  private static readonly MIN_RATING = 1.0;
  private static readonly MAX_RATING = 5.0;

  /**
   * Validate Course Name
   *
   * Domain service: Validates course name according to business rules.
   *
   * @param name - Course name to validate
   * @returns Validation result
   */
  static validateCourseName(name: string): CourseValidationResult {
    if (!name || name.trim().length === 0) {
      return {
        valid: false,
        reason: "Course name is required",
        field: "name",
      };
    }

    if (name.length > 255) {
      return {
        valid: false,
        reason: "Course name cannot exceed 255 characters",
        field: "name",
      };
    }

    return { valid: true };
  }

  /**
   * Validate Course Price
   *
   * Domain service: Validates course price according to business rules.
   *
   * @param price - Price string to validate
   * @returns Validation result
   */
  static validateCoursePrice(price: string): CourseValidationResult {
    const numericPrice = parseFloat(price);

    if (isNaN(numericPrice)) {
      return {
        valid: false,
        reason: "Price must be a valid number",
        field: "price",
      };
    }

    if (numericPrice < this.MIN_PRICE) {
      return {
        valid: false,
        reason: "Price cannot be negative",
        field: "price",
      };
    }

    if (numericPrice > this.MAX_PRICE) {
      return {
        valid: false,
        reason: `Price cannot exceed ${this.MAX_PRICE}`,
        field: "price",
      };
    }

    return { valid: true };
  }

  /**
   * Validate Category Tags
   *
   * Domain service: Validates category tags according to business rules.
   *
   * @param categoryTags - Category tags to validate
   * @returns Validation result
   */
  static validateCategoryTags(categoryTags: string[]): CourseValidationResult {
    if (!categoryTags || categoryTags.length === 0) {
      return {
        valid: false,
        reason: "At least one category tag is required",
        field: "categoryTag",
      };
    }

    if (categoryTags.length > this.MAX_CATEGORY_TAGS) {
      return {
        valid: false,
        reason: `Maximum ${this.MAX_CATEGORY_TAGS} category tags allowed`,
        field: "categoryTag",
      };
    }

    // Check for invalid category tags
    const invalidTags = categoryTags.filter(
      (tag) => !this.VALID_CATEGORY_TAGS.includes(tag as any)
    );

    if (invalidTags.length > 0) {
      return {
        valid: false,
        reason: `Invalid category tags: ${invalidTags.join(", ")}. Valid tags: ${this.VALID_CATEGORY_TAGS.join(", ")}`,
        field: "categoryTag",
      };
    }

    return { valid: true };
  }

  /**
   * Validate Course Rating
   *
   * Domain service: Validates course rating according to business rules.
   *
   * @param rating - Rating string to validate
   * @param price - Price string for business rule validation
   * @returns Validation result
   */
  static validateCourseRating(
    rating: string | null | undefined,
    price: string
  ): CourseValidationResult {
    if (!rating) {
      return { valid: true }; // Rating is optional
    }

    const numericRating = parseFloat(rating);

    if (isNaN(numericRating)) {
      return {
        valid: false,
        reason: "Rating must be a valid number",
        field: "rating",
      };
    }

    if (numericRating < this.MIN_RATING || numericRating > this.MAX_RATING) {
      return {
        valid: false,
        reason: `Rating must be between ${this.MIN_RATING} and ${this.MAX_RATING}`,
        field: "rating",
      };
    }

    // Business rule: Free courses cannot have high ratings
    const numericPrice = parseFloat(price);
    if (numericPrice === 0 && numericRating > 3.0) {
      return {
        valid: false,
        reason: "Free courses cannot have ratings above 3.0",
        field: "rating",
      };
    }

    return { valid: true };
  }

  /**
   * Validate Thumbnail URL
   *
   * Domain service: Validates thumbnail URL according to business rules.
   *
   * @param thumbnail - Thumbnail URL to validate
   * @returns Validation result
   */
  static validateThumbnailUrl(thumbnail: string | null | undefined): CourseValidationResult {
    if (!thumbnail) {
      return { valid: true }; // Thumbnail is optional
    }

    try {
      new URL(thumbnail);
      return { valid: true };
    } catch {
      return {
        valid: false,
        reason: "Thumbnail must be a valid URL",
        field: "thumbnail",
      };
    }
  }

  /**
   * Validate Complete Course Data
   *
   * Domain service: Validates complete course data for creation/update.
   *
   * @param courseData - Course data to validate
   * @returns Array of validation results
   */
  static validateCompleteCourse(courseData: CreateCourseInput | UpdateCourseInput): CourseValidationResult[] {
    const results: CourseValidationResult[] = [];

    // Validate name (if provided)
    if (courseData.name !== undefined) {
      const nameResult = this.validateCourseName(courseData.name);
      if (!nameResult.valid) {
        results.push(nameResult);
      }
    }

    // Validate price (if provided)
    if (courseData.price !== undefined) {
      const priceResult = this.validateCoursePrice(courseData.price);
      if (!priceResult.valid) {
        results.push(priceResult);
      }
    }

    // Validate category tags (if provided)
    if (courseData.categoryTag !== undefined) {
      const categoryResult = this.validateCategoryTags(courseData.categoryTag);
      if (!categoryResult.valid) {
        results.push(categoryResult);
      }
    }

    // Validate rating (if provided)
    if (courseData.rating !== undefined && courseData.price !== undefined) {
      const ratingResult = this.validateCourseRating(courseData.rating, courseData.price);
      if (!ratingResult.valid) {
        results.push(ratingResult);
      }
    }

    // Validate thumbnail (if provided)
    if (courseData.thumbnail !== undefined) {
      const thumbnailResult = this.validateThumbnailUrl(courseData.thumbnail);
      if (!thumbnailResult.valid) {
        results.push(thumbnailResult);
      }
    }

    return results;
  }

  /**
   * Can Course Be Updated
   *
   * Domain service: Determines if course can be updated based on business rules.
   *
   * @param course - Current course data
   * @returns Whether course can be updated
   */
  static canCourseBeUpdated(_course: Course): boolean {
    // All courses can be updated (public access)
    return true;
  }

  /**
   * Can Course Be Deleted
   *
   * Domain service: Determines if course can be deleted based on business rules.
   *
   * @param _course - Current course data
   * @param enrollmentCount - Number of active enrollments
   * @returns Whether course can be deleted
   */
  static canCourseBeDeleted(_course: Course, enrollmentCount: number): boolean {
    // Business rule: Courses with active enrollments should not be deleted
    // This is a soft business rule that could be adjusted based on requirements
    return enrollmentCount === 0;
  }

  /**
   * Get Course Display Information
   *
   * Domain service: Returns display information for course cards and lists.
   *
   * @param course - Course data
   * @returns Display configuration
   */
  static getCourseDisplayInformation(course: Course) {
    const numericPrice = parseFloat(course.price);
    const numericRating = course.rating ? parseFloat(course.rating) : null;

    return {
      priceDisplay: numericPrice === 0 ? "Free" : `Rp ${numericPrice.toLocaleString()}`,
      categoryDisplay: course.categoryTag.join(", "),
      ratingDisplay: numericRating ? `${numericRating.toFixed(1)}/5` : "Not rated",
      hasThumbnail: !!course.thumbnail,
      createdByDisplay: course.createdBy ? "Created by user" : "Anonymous",
    };
  }
}

/**
 * Enrollment Service
 *
 * Abstract class containing pure business logic for enrollment operations.
 * All methods are static - no instantiation required.
 *
 * This service contains the core business rules and validation logic
 * for enrollment management, independent of any infrastructure concerns.
 */
export abstract class EnrollmentService {
  private constructor() {}

  /**
   * Validate Enrollment Data
   *
   * Domain service: Validates enrollment data according to business rules.
   *
   * @param courseId - Course ID to validate
   * @param userId - User ID to validate
   * @returns Validation result
   */
  static validateEnrollmentData(courseId: string, userId: string): EnrollmentValidationResult {
    if (!courseId || courseId.trim().length === 0) {
      return {
        valid: false,
        reason: "Course ID is required",
        field: "courseId",
      };
    }

    if (!userId || userId.trim().length === 0) {
      return {
        valid: false,
        reason: "User ID is required",
        field: "userId",
      };
    }

    return { valid: true };
  }

  /**
   * Can User Enroll
   *
   * Domain service: Determines if user can enroll in course based on business rules.
   *
   * @param _userId - User ID
   * @param _courseId - Course ID
   * @param existingEnrollment - Existing enrollment record (if any)
   * @returns Whether user can enroll
   */
  static canUserEnroll(
    _userId: string,
    _courseId: string,
    existingEnrollment: Enrollment | null
  ): { canEnroll: boolean; reason?: string } {
    // Check if already enrolled
    if (existingEnrollment) {
      return {
        canEnroll: false,
        reason: "User is already enrolled in this course",
      };
    }

    // Add any additional business rules here
    // For example: course capacity, enrollment deadlines, etc.

    return { canEnroll: true };
  }

  /**
   * Can User Unenroll
   *
   * Domain service: Determines if user can unenroll from course based on business rules.
   *
   * @param userId - User ID
   * @param enrollment - Existing enrollment record
   * @returns Whether user can unenroll
   */
  static canUserUnenroll(
    userId: string,
    enrollment: Enrollment | null
  ): { canUnenroll: boolean; reason?: string } {
    if (!enrollment) {
      return {
        canUnenroll: false,
        reason: "No enrollment record found",
      };
    }

    if (enrollment.userId !== userId) {
      return {
        canUnenroll: false,
        reason: "User can only unenroll from their own enrollments",
      };
    }

    // Add any additional business rules here
    // For example: refund policies, completion requirements, etc.

    return { canUnenroll: true };
  }

  /**
   * Get Enrollment Status
   *
   * Domain service: Returns enrollment status information.
   *
   * @param enrollment - Enrollment record
   * @returns Status information
   */
  static getEnrollmentStatus(enrollment: Enrollment) {
    return {
      isEnrolled: true,
      enrolledAt: enrollment.enrolledAt,
      enrollmentDuration: this.calculateEnrollmentDuration(enrollment.enrolledAt),
    };
  }

  /**
   * Calculate Enrollment Duration
   *
   * Domain service: Calculates how long user has been enrolled.
   *
   * @param enrolledAt - Enrollment date
   * @returns Duration in days
   */
  private static calculateEnrollmentDuration(enrolledAt: Date): number {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - enrolledAt.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert to days
  }

  /**
   * Validate User Can Enroll
   *
   * Domain service: Comprehensive validation for user enrollment eligibility.
   *
   * @param userId - User ID to validate
   * @param courseId - Course ID to validate
   * @param db - Database instance for validation checks
   * @returns Validation result with detailed information
   */
  static async validateUserCanEnroll(
    userId: string,
    courseId: string,
    db: any
  ): Promise<{ canEnroll: boolean; reason?: string; details?: any }> {
    // Validate basic input parameters
    const basicValidation = this.validateEnrollmentData(courseId, userId);
    if (!basicValidation.valid) {
      return {
        canEnroll: false,
        reason: basicValidation.reason,
      };
    }

    try {
      // Check if user exists
      const user = await db.query.users.findFirst({
        where: (users: any, { eq }: any) => eq(users.id, userId),
      });

      if (!user) {
        return {
          canEnroll: false,
          reason: "User not found",
        };
      }

      // Check if course exists
      const course = await db.query.courses.findFirst({
        where: (courses: any, { eq }: any) => eq(courses.id, courseId),
      });

      if (!course) {
        return {
          canEnroll: false,
          reason: "Course not found",
        };
      }

      // Check if already enrolled
      const existingEnrollment = await db.query.enrollments.findFirst({
        where: (enrollments: any, { and, eq }: any) =>
          and(
            eq(enrollments.userId, userId),
            eq(enrollments.courseId, courseId)
          ),
      });

      if (existingEnrollment) {
        return {
          canEnroll: false,
          reason: "User is already enrolled in this course",
          details: { enrollmentId: existingEnrollment.id },
        };
      }

      return { canEnroll: true };
    } catch (error) {
      return {
        canEnroll: false,
        reason: "Validation failed due to database error",
        details: error,
      };
    }
  }

  /**
   * Get Enrollment Display Information
   *
   * Domain service: Creates display information for enrollment responses.
   *
   * @param enrollment - Enrollment record
   * @param course - Associated course record (optional)
   * @returns Display information object
   */
  static getEnrollmentDisplayInformation(
    enrollment: any,
    course?: any
  ): {
    enrollmentStatus: string;
    enrollmentDateDisplay: string;
    courseTitle?: string;
    coursePriceDisplay?: string;
    progressPercentage?: number;
  } {
    const enrollmentDate = new Date(enrollment.enrolledAt).toLocaleDateString();

    return {
      enrollmentStatus: "Active",
      enrollmentDateDisplay: enrollmentDate,
      courseTitle: course?.name,
      coursePriceDisplay: course?.price ? `Rp ${course.price}` : "Free",
      progressPercentage: 0, // Default progress, can be calculated based on course completion
    };
  }

  /**
   * Calculate Enrollment Statistics
   *
   * Domain service: Calculates statistics for user enrollments.
   *
   * @param enrollments - Array of enrollment records
   * @param courses - Array of associated course records (optional)
   * @returns Statistics object
   */
  static calculateEnrollmentStatistics(
    enrollments: any[],
    courses?: any[]
  ): {
    totalEnrollments: number;
    activeEnrollments: number;
    completedEnrollments: number;
    totalSpent: string;
    averageCoursePrice: string;
    enrolledCategories: string[];
  } {
    const totalEnrollments = enrollments.length;
    const activeEnrollments = enrollments.filter(e =>
      !e.completedAt || new Date(e.completedAt) > new Date()
    ).length;
    const completedEnrollments = totalEnrollments - activeEnrollments;

    // Calculate total spent and average price
    let totalSpent = 0;
    const enrolledCategories = new Set<string>();

    enrollments.forEach(enrollment => {
      const course = courses?.find(c => c.id === enrollment.courseId);
      if (course?.price) {
        totalSpent += parseFloat(course.price);
      }
      if (course?.categoryTag) {
        course.categoryTag.forEach((tag: string) => enrolledCategories.add(tag));
      }
    });

    const averageCoursePrice = totalEnrollments > 0 ? totalSpent / totalEnrollments : 0;

    return {
      totalEnrollments,
      activeEnrollments,
      completedEnrollments,
      totalSpent: totalSpent.toString(),
      averageCoursePrice: averageCoursePrice.toString(),
      enrolledCategories: Array.from(enrolledCategories),
    };
  }
}
