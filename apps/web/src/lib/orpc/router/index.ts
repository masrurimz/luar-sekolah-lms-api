import { protectedProcedure, publicProcedure } from '@/lib/orpc';
import { getSession } from '@/routes/auth/-app/get-session';
import { createTodo } from '@/routes/todos/-app/create-todo';
import { deleteTodo } from '@/routes/todos/-app/delete-todo';
import { getTodos } from '@/routes/todos/-app/get-todos';
import { toggleTodo } from '@/routes/todos/-app/toggle-todo';

// Course feature imports
import { getCourses } from '@/routes/courses/-app/get-courses';
import { getCourse } from '@/routes/courses/-app/get-course';
import { createCourse } from '@/routes/courses/-app/create-course';
import { updateCourse } from '@/routes/courses/-app/update-course';
import { deleteCourse } from '@/routes/courses/-app/delete-course';
import { enrollCourse } from '@/routes/courses/-app/enroll-course';
import { getMyCourses } from '@/routes/courses/-app/get-my-courses';

/**
 * Main oRPC Router
 *
 * This router provides a unified API interface for the entire application,
 * following Clean Architecture principles with feature-based organization.
 *
 * **Architecture Benefits:**
 * - **Unified Data Layer**: All API calls go through oRPC for consistency
 * - **Type Safety**: End-to-end TypeScript inference from server to client
 * - **Feature Organization**: Endpoints grouped by business domain (auth, todos, etc.)
 * - **Clean Architecture**: Domain logic separated in feature modules (_api folders)
 *
 * **Better Auth Integration:**
 * - Auth endpoints follow Better Auth conventions and terminology
 * - Session management integrated with Better Auth context
 * - Compatible with existing Better Auth patterns and middleware
 */
export default {
  /**
   * Health check endpoint for monitoring
   */
  healthCheck: publicProcedure.handler(() => {
    return 'OK';
  }),

  /**
   * Authentication endpoints following Better Auth conventions
   */
  auth: {
    getSession,
  },

  /**
   * Protected data endpoint demonstrating auth-required functionality
   */
  privateData: protectedProcedure.handler(({ context }) => {
    return {
      message: 'This is private',
      user: context.session?.user,
    };
  }),

  /**
   * Todo feature endpoints organized by domain
   */
  todo: {
    getAll: getTodos,
    create: createTodo,
    toggle: toggleTodo,
    delete: deleteTodo,
  },

  /**
   * Course feature endpoints organized by domain
   * Public course management operations
   */
  course: {
    getAll: getCourses,
    get: getCourse,
    create: createCourse,
    update: updateCourse,
    delete: deleteCourse,
  },

  /**
   * Enrollment feature endpoints organized by domain
   * Protected enrollment operations requiring authentication
   */
  enrollment: {
    enroll: enrollCourse,
    getMyCourses: getMyCourses,
  },
};
