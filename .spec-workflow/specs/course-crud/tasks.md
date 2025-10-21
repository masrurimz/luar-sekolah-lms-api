# Tasks Document

- [x] 1. Create course feature database schema
  - File: apps/web/src/lib/db/schema/course.ts
  - Define course and enrollment tables with proper relationships
  - Add TypeScript type exports (Course, NewCourse, Enrollment, NewEnrollment)
  - Purpose: Establish data layer foundation for course management
  - _Leverage: apps/web/src/lib/db/schema/auth.ts, apps/web/src/lib/db/schema/utils.ts_
  - _Requirements: 4.1, 4.2, 4.3, 4.4_
  - _Prompt: Implement the task for spec course-crud, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Database Developer with expertise in Drizzle ORM and PostgreSQL schema design | Task: Create course and enrollment database schemas following requirements 4.1-4.4, leveraging existing UUID generation and timestamp patterns from auth schema and utils | Restrictions: Must follow existing schema patterns, use proper data types, maintain referential integrity, include all required fields and relationships | Success: Schemas compile without errors, all required fields are properly typed, relationships are correctly defined, database migrations can be generated successfully_

- [x] 2. Update schema index exports
  - File: apps/web/src/lib/db/schema/index.ts
  - Add exports for course and enrollment schemas
  - Purpose: Make course schemas available throughout the application
  - _Leverage: existing schema export patterns_
  - _Requirements: 4.1, 4.2, 4.3, 4.4_
  - _Prompt: Implement the task for spec course-crud, first run spec-workflow-guide to get the workflow guide then implement the task: Role: TypeScript Developer specializing in module organization | Task: Update schema index to export course and enrollment types following existing export patterns | Restrictions: Must maintain proper import order, do not break existing exports, follow project naming conventions | Success: All course-related types are properly exported and accessible, existing functionality remains intact_

- [-] 3. Create course feature domain entities
  - File: apps/web/src/routes/courses/-domain/entities.ts
  - Define core business entities and types for courses and enrollments
  - Export TypeScript interfaces for domain layer
  - Purpose: Establish domain entities following Clean Architecture
  - _Leverage: database schema types_
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 5.1, 5.2, 5.3, 5.4, 5.5_
  - _Prompt: Implement the task for spec course-crud, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Domain Architect with expertise in Clean Architecture and entity design | Task: Create domain entities for courses and enrollments following Clean Architecture principles, defining core business types independent of infrastructure | Restrictions: Must be pure domain logic, no infrastructure dependencies, follow Clean Architecture separation, maintain type safety | Success: Domain entities are properly defined, follow Clean Architecture principles, maintain type safety, no infrastructure dependencies_

- [ ] 4. Create course feature domain schemas
  - File: apps/web/src/routes/courses/-domain/schemas.ts
  - Implement 4-layer schema organization as abstract classes
  - Create CourseBaseSchemas, CourseInputSchemas, CourseOutputSchemas, CourseValidationSchemas
  - Add enrollment schemas following same pattern
  - Purpose: Establish comprehensive validation layer using project patterns
  - _Leverage: existing domain schema patterns, Zod validation_
  - _Requirements: All requirements_
  - _Prompt: Implement the task for spec course-crud, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Validation Engineer with expertise in Zod schema design and abstract class patterns | Task: Create 4-layer schema organization for courses and enrollments using abstract classes, implementing BaseSchemas, InputSchemas, OutputSchemas, and ValidationSchemas following project patterns | Restrictions: Must use abstract class pattern, follow 4-layer organization, include all business constraints, maintain type safety | Success: All schemas compile without errors, validation covers all requirements, business rules are properly enforced, follows project abstract class patterns_

- [ ] 5. Create course feature domain errors
  - File: apps/web/src/routes/courses/-domain/errors.ts
  - Define oRPC error definitions using oc.errors() with message and Zod data schemas
  - Create reusable error bases for course operations
  - Add enrollment-specific error definitions
  - Purpose: Establish domain-level error handling following contract-first pattern
  - _Leverage: existing oRPC error patterns_
  - _Requirements: All requirements_
  - _Prompt: Implement the task for spec course-crud, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Error Handling Specialist with expertise in oRPC error definitions and contract-first development | Task: Create domain error definitions using oc.errors() pattern with message and Zod data schemas for all course and enrollment operations | Restrictions: Must use oc.errors() pattern, include message and Zod data schemas, create reusable error bases, follow contract-first approach | Success: Error definitions are comprehensive, follow oRPC contract-first pattern, include proper Zod data schemas, are reusable across operations_

- [ ] 6. Create course feature domain contracts
  - File: apps/web/src/routes/courses/-domain/contracts.ts
  - Define oRPC API contracts abstract class using oc builder
  - Compose errors with input/output schemas
  - Create contracts for all course CRUD and enrollment operations
  - Purpose: Establish type-safe API contracts following contract-first pattern
  - _Leverage: domain schemas, domain errors_
  - _Requirements: All requirements_
  - _Prompt: Implement the task for spec course-crud, first run spec-workflow-guide to get the workflow guide then implement the task: Role: API Contract Architect with expertise in oRPC contract-first development | Task: Create oRPC contracts abstract class using oc builder, composing errors with input/output schemas for all course and enrollment operations following contract-first pattern | Restrictions: Must use oc builder, compose errors with schemas, include all CRUD and enrollment operations, follow contract-first approach | Success: Contracts are type-safe and comprehensive, follow contract-first pattern, properly compose errors with schemas, cover all operations_

- [ ] 7. Create course feature domain services
  - File: apps/web/src/routes/courses/-domain/services.ts
  - Implement abstract class CourseService with static methods
  - Add business logic for course operations and validation
  - Create EnrollmentService for enrollment business logic
  - Purpose: Implement pure business logic following Clean Architecture
  - _Leverage: domain entities, domain schemas_
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 5.1, 5.2, 5.3, 5.4, 5.5_
  - _Prompt: Implement the task for spec course-crud, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Domain Service Developer with expertise in Clean Architecture and business logic | Task: Create abstract class services with static methods for course and enrollment business logic, following Clean Architecture principles and abstract class patterns | Restrictions: Must be pure business logic, use abstract class pattern, follow Clean Architecture separation, include comprehensive validation | Success: Services implement all business logic correctly, follow Clean Architecture, use abstract class pattern, validation is comprehensive_

- [ ] 8. Create course feature infrastructure repository
  - File: apps/web/src/routes/courses/-lib/course-repository.ts
  - Implement abstract class CourseRepository with static methods
  - Add database parameter as first argument for dependency injection
  - Include CRUD operations and query methods
  - Purpose: Implement data access layer following repository pattern
  - _Leverage: database schema, existing repository patterns_
  - _Requirements: 1.1, 1.2, 2.1, 2.2, 2.3_
  - _Prompt: Implement the task for spec course-crud, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Infrastructure Developer with expertise in repository pattern and Drizzle ORM | Task: Create CourseRepository abstract class with static methods, using database parameter as first argument for dependency injection, implementing all CRUD operations | Restrictions: Must use abstract class pattern, database parameter first argument, follow repository pattern, include proper error handling | Success: Repository implements all CRUD operations, follows abstract class pattern, uses proper dependency injection, error handling is comprehensive_

- [ ] 9. Create enrollment feature infrastructure repository
  - File: apps/web/src/routes/courses/-lib/enrollment-repository.ts
  - Implement abstract class EnrollmentRepository with static methods
  - Add user-specific queries and duplicate checking
  - Include relationship management between users and courses
  - Purpose: Implement enrollment data access following repository pattern
  - _Leverage: course repository patterns, database schema_
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 6.1, 6.2, 6.3, 6.4_
  - _Prompt: Implement the task for spec course-crud, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Infrastructure Developer with expertise in relationship management and repository pattern | Task: Create EnrollmentRepository abstract class for user-course relationships, including duplicate checking and user-specific queries following repository pattern | Restrictions: Must use abstract class pattern, database parameter first argument, handle relationships properly, prevent duplicates | Success: Repository handles enrollments correctly, prevents duplicates, supports user-specific queries, follows repository pattern_

- [ ] 10. Create course feature infrastructure types
  - File: apps/web/src/routes/courses/-lib/types.ts
  - Export infrastructure-specific types and utilities
  - Include repository type exports and helper types
  - Purpose: Provide infrastructure type exports for feature
  - _Leverage: domain entities, repository types_
  - _Requirements: All requirements_
  - _Prompt: Implement the task for spec course-crud, first run spec-workflow-guide to get the workflow guide then implement the task: Role: TypeScript Developer specializing in infrastructure type organization | Task: Create infrastructure types exports for the course feature, including repository types and helper utilities | Restrictions: Must export infrastructure-specific types only, maintain proper type organization, follow project type patterns | Success: Infrastructure types are properly organized and exported, maintain type safety, follow project patterns_

- [ ] 11. Create get-courses application handler
  - File: apps/web/src/routes/courses/-app/get-courses.ts
  - Implement contract via implement() for course listing
  - Use publicProcedure for public access
  - Coordinate with repository and service layers
  - Purpose: Implement public course listing endpoint
  - _Leverage: domain contracts, course repository, course service_
  - _Requirements: 1.1, 1.2, 1.3, 1.4_
  - _Prompt: Implement the task for spec course-crud, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Application Layer Developer with expertise in oRPC handler implementation | Task: Create get-courses handler using implement() pattern, coordinating with repository and service layers for public course listing | Restrictions: Must use implement() pattern, use publicProcedure, coordinate with layers properly, handle errors comprehensively | Success: Handler returns course list correctly, follows implement() pattern, coordinates with layers, error handling is comprehensive_

- [ ] 12. Create get-course application handler
  - File: apps/web/src/routes/courses/-app/get-course.ts
  - Implement contract via implement() for single course retrieval
  - Use publicProcedure for public access
  - Include proper error handling for not found scenarios
  - Purpose: Implement public single course retrieval endpoint
  - _Leverage: domain contracts, course repository_
  - _Requirements: 1.1, 1.2, 1.3, 1.4_
  - _Prompt: Implement the task for spec course-crud, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Application Layer Developer with expertise in oRPC handler implementation | Task: Create get-course handler using implement() pattern for single course retrieval with proper error handling | Restrictions: Must use implement() pattern, use publicProcedure, handle not found errors properly, coordinate with repository | Success: Handler returns single course correctly, handles not found errors, follows implement() pattern_

- [ ] 13. Create create-course application handler
  - File: apps/web/src/routes/courses/-app/create-course.ts
  - Implement contract via implement() for course creation
  - Use publicProcedure for public access
  - Include creator attribution for authenticated users
  - Purpose: Implement public course creation endpoint
  - _Leverage: domain contracts, course service, course repository_
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  - _Prompt: Implement the task for spec course-crud, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Application Layer Developer with expertise in oRPC handler implementation | Task: Create create-course handler using implement() pattern with creator attribution for authenticated users and comprehensive validation | Restrictions: Must use implement() pattern, use publicProcedure, handle creator attribution, coordinate with service layer | Success: Handler creates courses correctly, handles creator attribution, validation is comprehensive, follows implement() pattern_

- [ ] 14. Create update-course application handler
  - File: apps/web/src/routes/courses/-app/update-course.ts
  - Implement contract via implement() for course updates
  - Use publicProcedure for public access
  - Include proper validation and update logic
  - Purpose: Implement public course update endpoint
  - _Leverage: domain contracts, course service, course repository_
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  - _Prompt: Implement the task for spec course-crud, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Application Layer Developer with expertise in oRPC handler implementation | Task: Create update-course handler using implement() pattern with proper validation and update logic | Restrictions: Must use implement() pattern, use publicProcedure, validate inputs properly, coordinate with service layer | Success: Handler updates courses correctly, validation is comprehensive, follows implement() pattern_

- [ ] 15. Create delete-course application handler
  - File: apps/web/src/routes/courses/-app/delete-course.ts
  - Implement contract via implement() for course deletion
  - Use publicProcedure for public access
  - Include proper error handling and deletion logic
  - Purpose: Implement public course deletion endpoint
  - _Leverage: domain contracts, course repository_
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  - _Prompt: Implement the task for spec course-crud, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Application Layer Developer with expertise in oRPC handler implementation | Task: Create delete-course handler using implement() pattern with proper error handling and deletion logic | Restrictions: Must use implement() pattern, use publicProcedure, handle not found errors properly, coordinate with repository | Success: Handler deletes courses correctly, handles not found errors, follows implement() pattern_

- [ ] 16. Create enroll-course application handler
  - File: apps/web/src/routes/courses/-app/enroll-course.ts
  - Implement contract via implement() for course enrollment
  - Use protectedProcedure for authenticated access
  - Include duplicate checking and user validation
  - Purpose: Implement private course enrollment endpoint
  - _Leverage: domain contracts, enrollment service, enrollment repository_
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  - _Prompt: Implement the task for spec course-crud, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Application Layer Developer with expertise in authentication and protected endpoints | Task: Create enroll-course handler using implement() pattern with protectedProcedure, including duplicate checking and user validation | Restrictions: Must use implement() pattern, use protectedProcedure, enforce authentication, prevent duplicates | Success: Handler enrolls users correctly, authentication is enforced, duplicates are prevented, follows implement() pattern_

- [ ] 17. Create get-my-courses application handler
  - File: apps/web/src/routes/courses/-app/get-my-courses.ts
  - Implement contract via implement() for user's enrolled courses
  - Use protectedProcedure for authenticated access
  - Filter courses by authenticated user
  - Purpose: Implement private user courses listing endpoint
  - _Leverage: domain contracts, enrollment repository, course repository_
  - _Requirements: 6.1, 6.2, 6.3, 6.4_
  - _Prompt: Implement the task for spec course-crud, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Application Layer Developer with expertise in authentication and data filtering | Task: Create get-my-courses handler using implement() pattern with protectedProcedure, filtering courses by authenticated user | Restrictions: Must use implement() pattern, use protectedProcedure, filter by user context, maintain data privacy | Success: Handler returns user's courses only, authentication is enforced, data privacy is maintained, follows implement() pattern_

- [ ] 18. Update main oRPC router with course feature
  - File: apps/web/src/lib/orpc/router/index.ts
  - Import and add course feature contracts to main router
  - Ensure proper organization and documentation
  - Purpose: Integrate course feature into main API router
  - _Leverage: existing router organization, course domain contracts_
  - _Requirements: All requirements_
  - _Prompt: Implement the task for spec course-crud, first run spec-workflow-guide to get the workflow guide then implement the task: Role: API Integration Specialist with expertise in oRPC router organization | Task: Update main oRPC router to include course feature contracts, maintaining proper organization and following existing patterns | Restrictions: Must follow existing router organization, maintain backward compatibility, ensure all endpoints are properly exposed | Success: All course endpoints are accessible through main router, organization is clean, existing functionality remains intact_

- [ ] 19. Generate and apply database migrations
  - File: apps/web/src/lib/db/migrations/ (generated)
  - Run database migration generation for course and enrollment schemas
  - Apply migrations and verify table creation
  - Purpose: Update database schema with course feature tables
  - _Leverage: existing migration tools and patterns_
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 5.1, 5.2, 5.3, 5.4, 5.5_
  - _Prompt: Implement the task for spec course-crud, first run spec-workflow-guide to get the workflow guide then implement the task: Role: Database Administrator with expertise in Drizzle migrations | Task: Generate and apply database migrations for course and enrollment schemas, verifying proper table creation and relationships | Restrictions: Must use existing migration tools, verify schema before applying, maintain data integrity | Success: Database schema is updated correctly, tables and relationships are created properly, migrations can be applied safely_

- [ ] 20. Enhance OpenAPI documentation with metadata
  - File: apps/web/src/routes/courses/-domain/schemas.ts
  - Add .meta() with descriptions and examples to Zod schemas
  - Use JSON_SCHEMA_REGISTRY for advanced schema customization
  - Add .route() metadata to contracts with operationId, summary, description, tags
  - Purpose: Enhance auto-generated OpenAPI documentation with rich metadata
  - _Leverage: existing OpenAPI configuration, @orpc/zod/zod4 JSON_SCHEMA_REGISTRY, course domain contracts_
  - _Requirements: All requirements_
  - _Prompt: Implement the task for spec course-crud, first run spec-workflow-guide to get the workflow guide then implement the task: Role: API Documentation Specialist with expertise in oRPC OpenAPI metadata enhancement | Task: Enhance course and enrollment schemas with .meta() descriptions and examples, use JSON_SCHEMA_REGISTRY for advanced customization, add .route() metadata to contracts with operationId, summary, description, and tags for comprehensive OpenAPI documentation | Restrictions: Must use .meta() for schema descriptions/examples, JSON_SCHEMA_REGISTRY for advanced customization, .route() for operation metadata, leverage existing auto-configuration | Success: Auto-generated OpenAPI documentation is enhanced with rich metadata, schemas have descriptions and examples, operations have proper IDs and summaries, Scalar integration displays comprehensive documentation_
