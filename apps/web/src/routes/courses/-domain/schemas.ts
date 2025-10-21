import { z } from 'zod';

/**
 * Abstract class containing primitive base schemas for Course feature
 * Aligns with database schema types
 */
export abstract class CourseBaseSchemas {
  /**
   * UUID validation schema
   */
  static readonly uuid = z
    .string()
    .uuid('Invalid UUID format')
    .meta({
      description: 'Unique identifier for resources',
      examples: ['550e8400-e29b-41d4-a716-446655440000'],
    });

  /**
   * Course name validation - required, non-empty string with length constraints
   */
  static readonly name = z
    .string()
    .min(1, 'Course name is required')
    .max(255, 'Course name cannot exceed 255 characters')
    .trim()
    .meta({
      description: 'Name of the course',
      examples: ['Introduction to Web Development', 'Advanced React Patterns'],
    });

  /**
   * Course price validation - string to match decimal from schema
   */
  static readonly price = z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Price must be a valid decimal number')
    .refine((price) => parseFloat(price) >= 0, 'Price cannot be negative')
    .default('0.00')
    .meta({
      description: 'Price of the course as decimal string (from schema)',
      examples: ['0.00', '299000.00', '1500000.00'],
    });

  /**
   * Category tag validation - string array to match schema
   */
  static readonly categoryTag = z
    .array(z.string())
    .default([])
    .meta({
      description: 'Array of category tags as strings (from schema)',
      examples: [['prakerja'], ['spl'], ['prakerja', 'spl']],
    }).optional();

  /**
   * Thumbnail URL validation - optional string to match schema
   */
  static readonly thumbnail = z
    .string()
    .url('Thumbnail must be a valid URL')
    .nullable()
    .optional()
    .meta({
      description: 'URL of the course thumbnail image (nullable in schema)',
      examples: ['https://example.com/course-thumbnail.jpg'],
    });

  /**
   * Rating validation - string to match decimal from schema
   */
  static readonly rating = z
    .string()
    .regex(/^\d(\.\d)?$/, 'Rating must be a decimal with at most 1 digit')
    .nullable()
    .optional()
    .refine((rating) => !rating || (parseFloat(rating) >= 1 && parseFloat(rating) <= 5), 'Rating must be between 1.0 and 5.0')
    .meta({
      description: 'Course rating as decimal string (from schema)',
      examples: ['4.5', '3.0', '5.0'],
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
export abstract class CourseInputSchemas {
  static readonly createCourse = z.object({
    name: CourseBaseSchemas.name,
    price: CourseBaseSchemas.price,
    categoryTag: CourseBaseSchemas.categoryTag,
    thumbnail: CourseBaseSchemas.thumbnail,
    rating: CourseBaseSchemas.rating,
  })
  .meta({
    description: 'Input data for creating a new course',
    title: 'Create Course Request',
  });

  static readonly updateCourse = z.object({
    name: CourseBaseSchemas.name.optional(),
    price: CourseBaseSchemas.price.optional(),
    categoryTag: CourseBaseSchemas.categoryTag.optional(),
    thumbnail: CourseBaseSchemas.thumbnail.optional(),
    rating: CourseBaseSchemas.rating.optional(),
  })
  .meta({
    description: 'Input data for updating an existing course',
    title: 'Update Course Request',
  });

  static readonly getCourse = z.object({
    id: CourseBaseSchemas.uuid,
  })
  .meta({
    description: 'Input data for retrieving a specific course',
    title: 'Get Course Request',
  });

  static readonly getCourses = z.object({
    limit: CourseBaseSchemas.limit,
    offset: CourseBaseSchemas.offset,
    categoryTag: CourseBaseSchemas.categoryTag.optional(),
  })
  .meta({
    description: 'Input data for retrieving a paginated list of courses',
    title: 'Get Courses Request',
  });

  static readonly deleteCourse = z.object({
    id: CourseBaseSchemas.uuid,
  })
  .meta({
    description: 'Input data for deleting a course',
    title: 'Delete Course Request',
  });
}

/**
 * Output schemas for API responses
 */
export abstract class CourseOutputSchemas {
  static readonly course = z.object({
    id: CourseBaseSchemas.uuid,
    name: CourseBaseSchemas.name,
    price: CourseBaseSchemas.price, // string from schema
    categoryTag: CourseBaseSchemas.categoryTag, // string[] from schema
    thumbnail: CourseBaseSchemas.thumbnail, // nullable from schema
    rating: CourseBaseSchemas.rating, // nullable string from schema
    createdBy: CourseBaseSchemas.uuid.nullable().optional(), // nullable from schema
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .meta({
    description: 'Course data response object (matches schema)',
    title: 'Course Response',
  });

  static readonly courses = z.object({
    courses: z.array(CourseOutputSchemas.course),
    total: z.number().int().optional(),
    limit: CourseBaseSchemas.limit.optional(),
    offset: CourseBaseSchemas.offset.optional(),
  })
  .meta({
    description: 'Paginated list of courses response',
    title: 'Courses List Response',
  });
}

/**
 * Enrollment schemas
 */
export abstract class EnrollmentBaseSchemas {
  static readonly userId = CourseBaseSchemas.uuid;
  static readonly courseId = CourseBaseSchemas.uuid;
  static readonly enrolledAt = z.date();
}

export abstract class EnrollmentInputSchemas {
  static readonly enrollCourse = z.object({
    courseId: EnrollmentBaseSchemas.courseId,
  })
  .meta({
    description: 'Input data for enrolling in a course',
    title: 'Enroll Course Request',
  });

  static readonly getMyCourses = z.object({
    limit: CourseBaseSchemas.limit,
    offset: CourseBaseSchemas.offset,
  })
  .meta({
    description: 'Input data for retrieving user enrolled courses',
    title: 'Get My Courses Request',
  });
}

export abstract class EnrollmentOutputSchemas {
  static readonly enrollment = z.object({
    id: CourseBaseSchemas.uuid,
    userId: EnrollmentBaseSchemas.userId,
    courseId: EnrollmentBaseSchemas.courseId,
    enrolledAt: EnrollmentBaseSchemas.enrolledAt,
  })
  .meta({
    description: 'Enrollment data response object',
    title: 'Enrollment Response',
  });

  static readonly enrollmentWithCourse = z.object({
    id: CourseBaseSchemas.uuid,
    userId: EnrollmentBaseSchemas.userId,
    courseId: EnrollmentBaseSchemas.courseId,
    enrolledAt: EnrollmentBaseSchemas.enrolledAt,
    course: CourseOutputSchemas.course.optional(),
  })
  .meta({
    description: 'Enrollment with course details response object',
    title: 'Enrollment with Course Response',
  });

  static readonly myCourses = z.object({
    enrollments: z.array(EnrollmentOutputSchemas.enrollmentWithCourse),
    total: z.number().int().optional(),
    limit: CourseBaseSchemas.limit.optional(),
    offset: CourseBaseSchemas.offset.optional(),
  })
  .meta({
    description: 'User enrolled courses response object',
    title: 'My Courses Response',
  });
}

// Export type inference from schemas - these are the ONLY types that should be used
export type CreateCourseInput = z.infer<typeof CourseInputSchemas.createCourse>;
export type UpdateCourseInput = z.infer<typeof CourseInputSchemas.updateCourse>;
export type GetCourseInput = z.infer<typeof CourseInputSchemas.getCourse>;
export type GetCoursesInput = z.infer<typeof CourseInputSchemas.getCourses>;
export type DeleteCourseInput = z.infer<typeof CourseInputSchemas.deleteCourse>;

export type CourseResponse = z.infer<typeof CourseOutputSchemas.course>;
export type CoursesResponse = z.infer<typeof CourseOutputSchemas.courses>;

export type EnrollCourseInput = z.infer<typeof EnrollmentInputSchemas.enrollCourse>;
export type GetMyCoursesInput = z.infer<typeof EnrollmentInputSchemas.getMyCourses>;
export type EnrollmentResponse = z.infer<typeof EnrollmentOutputSchemas.enrollment>;
export type EnrollmentWithCourseResponse = z.infer<typeof EnrollmentOutputSchemas.enrollmentWithCourse>;
export type MyCoursesResponse = z.infer<typeof EnrollmentOutputSchemas.myCourses>;
