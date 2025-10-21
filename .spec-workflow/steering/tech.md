# Technology Stack

## Project Type
Enterprise-scale digital transformation platform for comprehensive organizational management and majlis coordination. Full-stack web application with real-time capabilities, multi-role user system, and extensive database operations for religious organization management.

## Core Technologies

### Primary Language(s)
- **TypeScript**: End-to-end type safety with strict configuration and modern ES features
- **JavaScript**: Runtime execution with Bun runtime for optimal performance
- **Runtime/Compiler**: Bun 1.2+ for package management and execution
- **Language-specific tools**: Turborepo for monorepo management, Vite for build tooling

### Key Dependencies/Libraries

#### Core Framework & Routing
- **TanStack Start**: Modern full-stack React framework with SSR capabilities
- **TanStack Router**: Type-safe routing with file-based routing and query integration
- **TanStack Query**: Data fetching and caching with optimistic updates
- **TanStack Router Loader Pattern**: React Query integration to ensure query data is fetched as early as possible during page loading
- **React 19**: Modern React with concurrent features and server components

#### Type Safety & Validation
- **Zod**: Runtime type validation and schema definitions
- **Drizzle ORM**: Type-safe database operations with automatic type inference
- **oRPC**: Type-safe RPC framework for seamless API integration
- **oRPC Contract-First**: API contracts defined in domain using `oc` builder, implementation via `implement(contract)`
- **oRPC Error Definitions**: Domain-level error definitions using `oc.errors()` from `@orpc/contract` with message and Zod data schemas
- **Type-Safe Error Handling**: Full type inference for error throwing and client-side error handling with `isDefinedError()`

#### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **Shadcn/UI**: Enterprise-ready component library built on Radix UI
- **Radix UI**: Accessible UI primitives with keyboard navigation
- **Lucide React**: Modern icon library with extensive icon set

#### Forms & State Management
- **TanStack Form**: Type-safe form handling with composition pattern for identical form fields
- **Jotai**: Atomic state management to avoid props drilling and hooks overuse
- **Atom Composition**: Complex state management using atomic patterns
- **Type-safe Search Params**: TanStack Start type-safe URL parameter handling
- **URL-first State Management**: Utilizing search params for state management approach

#### Authentication & Security
- **Better Auth**: Comprehensive authentication system with social providers
- **Session Management**: Secure session handling with proper CSRF protection
- **Role-based Access Control**: Multi-tier permission system aligned with organizational hierarchy

#### Internationalization
- **Lingui**: React-based internationalization with compile-time optimizations
- **Multi-language Support**: Indonesian and English language support

#### Frontend Architecture & State Management
- **TanStack Router Loader Pattern**: Pre-populates query data during route loading with ensureQueryData
- **URL-First State Management**: Search parameters drive all application state for bookmarkable URLs
- **TanStack Form Composition**: Type-safe forms with createFormHook and field-level components
- **TanStack Query Integration**: Data fetching with caching, pre-loading, and optimistic updates
- **Mobile-First Responsive Design**: Progressive enhancement with breakpoint-based conditional rendering
- **Component Composition over Custom Hooks**: Prefer composable patterns and compound components over custom hooks
- **Accessibility-First Architecture**: Comprehensive ARIA attributes, keyboard navigation, and screen reader support
- **Error Boundary Pattern**: Route-level and component-level error handling with graceful fallbacks
- **Link Component Navigation**: TanStack Router Link component for type-safe URL navigation with search state
- **Jotai Atomic State**: Composable state management using atoms instead of prop drilling or complex hooks

#### Database & ORM
- **PostgreSQL**: Enterprise-grade relational database
- **Drizzle Kit**: Database toolkit for migrations and schema management
- **IDN Area Data**: Indonesian administrative area integration

### Application Architecture
Full-stack application with file-based routing architecture:
- **Server-Side Rendering (SSR)** with TanStack Start
- **Component-based architecture** with separation of concerns
- **Feature-based organization** with domain-driven design principles
- **Type-safe API layer** using oRPC with automatic client generation
- **Real-time capabilities** through WebSocket integration planning
- **Abstract Class Pattern**: Services, repositories, and schema containers organized as abstract classes with static methods for namespace organization and elegant API access (e.g., `FeatureService.validateRule()`, `FeatureRepository.findById(db, id)`)
- **Repository Pattern**: Data access layer with database parameter as first argument for dependency injection
- **4-Layer Schema Organization**: Zod schemas grouped into BaseSchemas (primitives), InputSchemas (requests), OutputSchemas (responses), and ValidationSchemas (business rules) for consistency across features
- **Feature-First Colocation**: Code lives within feature directories by default. When functionality is needed by sibling features, it progressively moves up to parent directories. This keeps related code changes together and close: feature-specific → parent directory → root level, only moving up when necessary

### Data Storage
- **Primary storage**: TimescaleDB (now Tigerdata) based on PostgreSQL 17 for real-time data aggregation capabilities
- **Connection pooling**: Managed database connections for performance
- **Data formats**: JSON for flexible data storage, structured schemas for core entities
- **Migration system**: Drizzle-based version-controlled schema migrations
- **Seed data**: Indonesian administrative areas and organizational structure

### External Integrations
- **APIs**: Indonesian administrative area services, future third-party integrations
- **Protocols**: HTTP/REST, WebSocket for real-time features, oRPC for internal APIs
- **Authentication**: OAuth providers, session-based authentication, API key management

### Monitoring & Dashboard Technologies
- **Dashboard Framework**: React-based admin dashboards with role-specific interfaces
- **Real-time Communication**: WebSocket planning for live updates
- **State Management**: TanStack Query for server state, Jotai for client state
- **Development Tools**: Hot module replacement, development server with HMR

## Development Environment

### Build & Development Tools
- **Build System**: Vite with optimized production builds and tree-shaking
- **Package Management**: Bun for ultra-fast package management and installation
- **Development workflow**: Hot reload, file watchers, incremental builds
- **Monorepo**: Turborepo for managing multiple packages and shared dependencies

### Code Quality Tools
- **Static Analysis**: Biome/Ultracite for comprehensive linting and formatting
- **Formatting**: Biome/Ultracite only for consistent code formatting
- **Testing Framework**: Vitest for unit and integration testing with React Testing Library
- **Type Checking**: Strict TypeScript configuration for maximum type safety

### Version Control & Collaboration
- **VCS**: Git with conventional commit formatting
- **Branching Strategy**: Feature branching with main branch protection
- **Code Review Process**: Pull request workflow with automated checks
- **Hooks**: Lefthook for pre-commit automation and quality gates

### Dashboard Development
- **Live Reload**: Hot module replacement during development
- **Port Management**: Configurable development ports with automatic allocation
- **Multi-Instance Support**: Support for running multiple environments simultaneously

## Deployment & Distribution
- **Target Platform(s)**: Cloud deployment with container support, multi-environment configurations
- **Distribution Method**: Container-based deployment with Docker Compose for development
- **Installation Requirements**: Node.js/Bun runtime, PostgreSQL database, Docker for containerization
- **Update Mechanism**: Blue-green deployment strategy with zero-downtime updates

## Technical Requirements & Constraints

### Performance Requirements
- **Response Time**: Sub-2 second page load times, API responses under 500ms
- **Throughput**: Support for 1000+ concurrent users with optimized database queries
- **Memory Usage**: Efficient memory management with proper cleanup and garbage collection
- **Startup Time**: Fast application startup with optimized bundling and lazy loading

### Compatibility Requirements
- **Platform Support**: Cross-platform compatibility (Linux, macOS, Windows)
- **Dependency Versions**: Modern dependency versions with regular security updates
- **Standards Compliance**: Web standards compliance, accessibility standards (WCAG 2.1)
- **Browser Support**: Modern browsers with ES2022+ support

### Security & Compliance
- **Security Requirements**: JWT authentication, CSRF protection, XSS prevention, SQL injection protection
- **Compliance Standards**: Data protection compliance, audit logging, secure data handling
- **Threat Model**: Protection against common web vulnerabilities, secure session management
- **Data Encryption**: Encryption at rest and in transit, secure credential storage

### Scalability & Reliability
- **Expected Load**: Support for organizational growth across multiple regions
- **Availability Requirements**: 99.9% uptime targets, graceful degradation under load
- **Growth Projections**: Horizontal scalability with database optimization and caching strategies
- **Disaster Recovery**: Regular backups, database replication, rollback capabilities

## Technical Decisions & Rationale

### Decision Log

1. **TanStack Start over Next.js**: Chosen for superior type safety, modern routing, and built-in data fetching integration with TanStack Query
2. **Drizzle ORM over Prisma**: Selected for better TypeScript integration, SQL-first approach, and lightweight footprint
3. **Bun over npm**: Chosen for significantly faster package management and runtime performance
4. **oRPC over tRPC**: Selected for enhanced type safety, better schema validation, and OpenAPI generation
5. **Biome/Ultracite over ESLint/Prettier**: Chosen for unified tooling, faster performance, and consistent formatting
6. **PostgreSQL over MySQL**: Selected for superior JSON support, advanced indexing, and enterprise features
7. **Radix UI over Material-UI**: Chosen for accessibility, composability, and unstyled components with Tailwind integration
8. **oRPC Contract-First Pattern**: Adopted contract-first development over implementation-first for superior type safety and API contract enforcement. Error definitions use `oc.errors()` to create reusable error bases. Contracts compose errors with input/output schemas. Application layer implements contracts with `implement()` for type-safe handlers with automatic error inference.

9. **Abstract Classes for Organization**: Adopted abstract class pattern with static methods as a container for organizing related functionality (services, repositories, schemas). Provides namespace organization and elegant API access. This is a flexible organizational approach that can be adjusted per layer needs. Start simple and break into multiple abstract classes only when complexity warrants it.

10. **Schema Organization Pattern**: Zod schemas grouped into 4 categories per feature (BaseSchemas, InputSchemas, OutputSchemas, ValidationSchemas) for consistency and discoverability, replacing comment-based organization with proper TypeScript structure.

11. **Repository Parameter Convention**: Database parameter passed as first argument to all repository methods for explicit dependency injection and easier transaction management.

12. **Feature-First Colocation Pattern**: Code starts within feature directories and only moves to parent directories when needed by sibling features. This nested, progressive approach (feature → parent → root) keeps related code changes together and close, reducing coupling while enabling reuse when necessary.

## Known Limitations

### Current Limitations
- **Real-time Features**: WebSocket integration not yet implemented (planned for future phases)
- **Mobile Applications**: Native mobile apps not yet developed (responsive web design prioritized)
- **Advanced Analytics**: Comprehensive analytics dashboard in development phase
- **API Rate Limiting**: Basic rate limiting implemented, advanced throttling planned

### Areas for Improvement
- **Database Optimization**: Query optimization and indexing strategies for large datasets
- **Caching Strategy**: Redis integration planned for improved performance
- **File Storage**: Cloud storage integration for document management and media files
- **Background Jobs**: Queue system for long-running tasks and scheduled operations
- **Monitoring**: Advanced monitoring and alerting system implementation
- **Testing**: E2E testing framework implementation and expanded test coverage
