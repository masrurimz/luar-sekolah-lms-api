/**
 * Enrollment Repository
 *
 * Abstract class containing all data access methods for enrollment management.
 * All methods are static with db as first parameter - no instantiation required.
 */

import { and, count, desc, eq } from "drizzle-orm";
import type { DatabaseType } from "@/lib/db";
import { course, enrollment } from "@/lib/db/schema";
import type {
  Enrollment,
} from "../-domain/entities";
import type {
  EnrollCourseInput,
  GetMyCoursesInput,
} from "../-domain/schemas";

/**
 * Enrollment Repository
 *
 * Implements all enrollment operations with user-course relationship management.
 * Database parameter is first argument for dependency injection.
 */
export abstract class EnrollmentRepository {
  private constructor() {}

  /**
   * Find Enrollment by ID
   *
   * Retrieves a single enrollment by ID with course details.
   *
   * @param db - Database instance
   * @param id - Enrollment UUID
   * @returns Enrollment with course or null if not found
   */
  static async findById(db: DatabaseType, id: string): Promise<(Enrollment & { course?: any }) | null> {
    const enrollmentRecord = await db.query.enrollment.findFirst({
      where: eq(enrollment.id, id),
      with: {
        course: true,
      },
    });

    return enrollmentRecord || null;
  }

  /**
   * Find Enrollment by User and Course
   *
   * Retrieves enrollment for specific user-course combination.
   *
   * @param db - Database instance
   * @param userId - User UUID
   * @param courseId - Course UUID
   * @returns Enrollment or null if not found
   */
  static async findByUserAndCourse(
    db: DatabaseType,
    userId: string,
    courseId: string
  ): Promise<Enrollment | null> {
    const enrollmentRecord = await db.query.enrollment.findFirst({
      where: and(
        eq(enrollment.userId, userId),
        eq(enrollment.courseId, courseId)
      ),
    });

    return enrollmentRecord || null;
  }

  /**
   * Get User Enrollments
   *
   * Retrieves all enrollments for a specific user with course details.
   *
   * @param db - Database instance
   * @param userId - User UUID
   * @param input - Pagination parameters
   * @returns Paginated user enrollments with course details
   */
  static async findByUser(
    db: DatabaseType,
    userId: string,
    input: Omit<GetMyCoursesInput, 'userId'> = {}
  ): Promise<{ enrollments: (Enrollment & { course?: any })[]; total: number }> {
    const { limit = 50, offset = 0 } = input;

    const [enrollmentList, totalCount] = await Promise.all([
      db.query.enrollment.findMany({
        where: eq(enrollment.userId, userId),
        with: {
          course: true,
        },
        orderBy: desc(enrollment.enrolledAt),
        limit,
        offset,
      }),
      db
        .select({ count: count() })
        .from(enrollment)
        .where(eq(enrollment.userId, userId))
        .then((result) => result[0]?.count || 0),
    ]);

    return {
      enrollments: enrollmentList,
      total: totalCount,
    };
  }

  /**
   * Get Course Enrollments
   *
   * Retrieves all enrollments for a specific course.
   *
   * @param db - Database instance
   * @param courseId - Course UUID
   * @param limit - Result limit
   * @param offset - Result offset
   * @returns Paginated course enrollments
   */
  static async findByCourse(
    db: DatabaseType,
    courseId: string,
    limit = 50,
    offset = 0
  ): Promise<{ enrollments: Enrollment[]; total: number }> {
    const [enrollmentList, totalCount] = await Promise.all([
      db.query.enrollment.findMany({
        where: eq(enrollment.courseId, courseId),
        orderBy: desc(enrollment.enrolledAt),
        limit,
        offset,
      }),
      db
        .select({ count: count() })
        .from(enrollment)
        .where(eq(enrollment.courseId, courseId))
        .then((result) => result[0]?.count || 0),
    ]);

    return {
      enrollments: enrollmentList,
      total: totalCount,
    };
  }

  /**
   * Create Enrollment
   *
   * Creates a new enrollment for a user in a course.
   *
   * @param db - Database instance
   * @param input - Enrollment creation data
   * @returns Created enrollment
   */
  static async create(
    db: DatabaseType,
    input: EnrollCourseInput & { userId: string }
  ): Promise<Enrollment> {
    const { userId, courseId } = input;
    const now = new Date();

    const [newEnrollment] = await db
      .insert(enrollment)
      .values({
        userId,
        courseId,
        enrolledAt: now,
      })
      .returning();

    return newEnrollment;
  }

  /**
   * Delete Enrollment
   *
   * Deletes an enrollment (unenrollment).
   *
   * @param db - Database instance
   * @param id - Enrollment UUID
   * @returns Success status
   */
  static async delete(db: DatabaseType, id: string): Promise<boolean> {
    const [deletedEnrollment] = await db
      .delete(enrollment)
      .where(eq(enrollment.id, id))
      .returning();

    return !!deletedEnrollment;
  }

  /**
   * Delete by User and Course
   *
   * Deletes enrollment by user and course (alternative delete method).
   *
   * @param db - Database instance
   * @param userId - User UUID
   * @param courseId - Course UUID
   * @returns Success status
   */
  static async deleteByUserAndCourse(
    db: DatabaseType,
    userId: string,
    courseId: string
  ): Promise<boolean> {
    const [deletedEnrollment] = await db
      .delete(enrollment)
      .where(and(
        eq(enrollment.userId, userId),
        eq(enrollment.courseId, courseId)
      ))
      .returning();

    return !!deletedEnrollment;
  }

  /**
   * Check if User is Enrolled
   *
   * Checks if a user is enrolled in a specific course.
   *
   * @param db - Database instance
   * @param userId - User UUID
   * @param courseId - Course UUID
   * @returns True if enrolled
   */
  static async isUserEnrolled(
    db: DatabaseType,
    userId: string,
    courseId: string
  ): Promise<boolean> {
    const enrollmentRecord = await db.query.enrollment.findFirst({
      where: and(
        eq(enrollment.userId, userId),
        eq(enrollment.courseId, courseId)
      ),
      columns: { id: true },
    });

    return !!enrollmentRecord;
  }

  /**
   * Get Enrollment Count by Course
   *
   * Returns the number of enrollments for each course.
   *
   * @param db - Database instance
   * @returns Array of course enrollment counts
   */
  static async countByCourse(db: DatabaseType): Promise<{ courseId: string; count: number }[]> {
    const result = await db
      .select({
        courseId: enrollment.courseId,
        count: count(enrollment.id),
      })
      .from(enrollment)
      .groupBy(enrollment.courseId)
      .orderBy(desc(count(enrollment.id)));

    return result;
  }

  /**
   * Get Enrollment Count by User
   *
   * Returns the number of courses a user is enrolled in.
   *
   * @param db - Database instance
   * @param userId - User UUID
   * @returns Enrollment count for user
   */
  static async countByUser(db: DatabaseType, userId: string): Promise<number> {
    const result = await db
      .select({ count: count() })
      .from(enrollment)
      .where(eq(enrollment.userId, userId));

    return result[0]?.count || 0;
  }

  /**
   * Get Course Enrollment Statistics
   *
   * Returns detailed enrollment statistics for a specific course.
   *
   * @param db - Database instance
   * @param courseId - Course UUID
   * @returns Course enrollment statistics
   */
  static async getCourseStatistics(
    db: DatabaseType,
    courseId: string
  ): Promise<{
    totalEnrollments: number;
    recentEnrollments: number; // Last 30 days
    averageEnrollmentsPerDay: number;
  }> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [totalResult, recentResult] = await Promise.all([
      db
        .select({ count: count() })
        .from(enrollment)
        .where(eq(enrollment.courseId, courseId)),
      db
        .select({ count: count() })
        .from(enrollment)
        .where(and(
          eq(enrollment.courseId, courseId),
          sql`${enrollment.enrolledAt} >= ${thirtyDaysAgo}`
        )),
    ]);

    const totalEnrollments = totalResult[0]?.count || 0;
    const recentEnrollments = recentResult[0]?.count || 0;

    // Calculate average enrollments per day
    // For simplicity, we'll divide total by 90 days (3 months)
    const averageEnrollmentsPerDay = totalEnrollments > 0 ? totalEnrollments / 90 : 0;

    return {
      totalEnrollments,
      recentEnrollments,
      averageEnrollmentsPerDay,
    };
  }

  /**
   * Get User Enrollment Statistics
   *
   * Returns detailed enrollment statistics for a specific user.
   *
   * @param db - Database instance
   * @param userId - User UUID
   * @returns User enrollment statistics
   */
  static async getUserStatistics(
    db: DatabaseType,
    userId: string
  ): Promise<{
    totalEnrollments: number;
    freeCourses: number;
    paidCourses: number;
    totalSpent: number;
    prakerjaCourses: number;
    splCourses: number;
  }> {
    // Get user enrollments with course details using manual join
    const userEnrollments = await db
      .select({
        enrollment: enrollment,
        course: course,
      })
      .from(enrollment)
      .leftJoin(course, eq(enrollment.courseId, course.id))
      .where(eq(enrollment.userId, userId));

    const totalEnrollments = userEnrollments.length;

    let freeCourses = 0;
    let paidCourses = 0;
    let totalSpent = 0;
    let prakerjaCourses = 0;
    let splCourses = 0;

    userEnrollments.forEach((row) => {
      const coursePrice = parseFloat(row.course?.price || '0');
      const categoryTags = row.course?.categoryTag || [];

      if (coursePrice === 0) {
        freeCourses++;
      } else {
        paidCourses++;
        totalSpent += coursePrice;
      }

      if (categoryTags.includes('prakerja')) {
        prakerjaCourses++;
      }
      if (categoryTags.includes('spl')) {
        splCourses++;
      }
    });

    return {
      totalEnrollments,
      freeCourses,
      paidCourses,
      totalSpent,
      prakerjaCourses,
      splCourses,
    };
  }

  /**
   * Get Popular Courses by Enrollments
   *
   * Returns courses ordered by enrollment count.
   *
   * @param db - Database instance
   * @param limit - Result limit
   * @returns Popular courses with enrollment counts
   */
  static async getPopularCourses(
    db: DatabaseType,
    limit = 10
  ): Promise<{ course: any; enrollmentCount: number }[]> {
    const result = await db
      .select({
        course: course,
        enrollmentCount: count(enrollment.id),
      })
      .from(course)
      .leftJoin(enrollment, eq(course.id, enrollment.courseId))
      .groupBy(course.id)
      .orderBy(desc(count(enrollment.id)))
      .limit(limit);

    return result;
  }
}

// Import the sql function from drizzle-orm
import { sql } from "drizzle-orm";
