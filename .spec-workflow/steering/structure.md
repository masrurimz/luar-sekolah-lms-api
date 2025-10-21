# Project Structure

## Directory Organization

High-level structure emphasizing layered architecture:

```
alkhidmah-digital-platform/
├── apps/web/                    # Main application
│   ├── src/
│   │   ├── lib/                # Infrastructure Layer (global)
│   │   │   ├── db/            # Database, ORM, migrations
│   │   │   ├── auth/          # Authentication setup
│   │   │   └── orpc/          # API framework config
│   │   ├── routes/            # Feature routes (file-based)
│   │   │   └── [area]/        # Area (admin, public, api)
│   │   │       ├── [feature]/ # Feature module
│   │   │       │   ├── -domain/    # Business logic (pure)
│   │   │       │   ├── -app/       # Handlers (orchestration)
│   │   │       │   ├── -lib/       # Infrastructure (feature-level)
│   │   │       │   └── -components/# UI components
│   │   │       └── -lib/      # Infrastructure (area-level shared)
│   │   ├── components/        # Global UI components
│   │   └── hooks/            # Global React hooks
│   └── public/               # Static assets
├── packages/                 # Shared monorepo packages (future)
└── .spec-workflow/          # Specs and steering docs
```

**Scalability Notes:**
- Features grow horizontally: add new feature folders as needed
- Areas remain stable: admin, public, api
- Infrastructure grows vertically: feature → area → global as sharing needs emerge
- No need to document every feature - pattern stays consistent

**Infrastructure Layer Clarification:**
- `src/lib/`: Global infrastructure (database, auth, framework setup)
- `routes/[area]/-lib/`: Area-level infrastructure (shared by features in area)
- `routes/[area]/[feature]/-lib/`: Feature-level infrastructure (repositories, data access)

All `-lib/` folders follow Clean Architecture's infrastructure layer principle: external concerns, database access, third-party integrations.

## Naming Conventions

### Files (Pure kebab-case only)
- **Components**: kebab-case (e.g., `board-form-dialog.tsx`, `admin-layout.tsx`)
- **Pages/Routes**: kebab-case for route folders and files (e.g., `boards/index.tsx`)
- **Domain Files**: kebab-case (e.g., `board-schemas.ts`, `auth-entities.ts`)
- **Application Files**: kebab-case (e.g., `board-service.ts`, `auth-actions.ts`)
- **Infrastructure Files**: kebab-case (e.g., `board-infrastructure.ts`, `auth-atoms.ts`)
- **API Routes**: dollar sign suffix (e.g., `rpc.$.ts`, `auth.$.ts`)

### Code (Standard TypeScript conventions)
- **Classes/Types**: PascalCase (e.g., `BoardEntity`, `UserSession`)
- **Functions/Methods**: camelCase (e.g., `createBoard`, `validateFormData`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`, `DEFAULT_PAGE_SIZE`)
- **Variables**: camelCase (e.g., `boardList`, `currentUser`)

## Import Patterns

### Import Order
1. External dependencies (React, TanStack, etc.)
2. Internal shared packages (`@/components/ui`, `@/lib/*`)
3. Route-specific imports (from same or related routes)
4. Relative imports within the same feature

### Module/Package Organization
```
// External dependencies
import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

// Internal shared services
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { db } from "@/lib/db";

// Feature-specific imports
import { BoardFormDialog } from "./-components/board-form-dialog";
import { boardService } from "./-app/board-service";
import { boardAtom } from "./-lib/board-atom";
```

## Code Structure Patterns

### Route Organization
TanStack Start file-based routing with feature-based organization following Clean Architecture and Contract-First principles:
```
routes/
├── feature-name/
│   ├── index.tsx                 # Main feature page
│   ├── -components/              # Feature-specific UI components
│   ├── -domain/                  # Domain layer (Clean Architecture)
│   │   ├── entities.ts          # Core business entities and types
│   │   ├── schemas.ts           # Zod validation schemas (4 abstract classes)
│   │   ├── errors.ts            # oRPC error definitions using oc.errors() with message + Zod data
│   │   ├── contracts.ts         # oRPC API contracts abstract class - compose errors with input/output
│   │   └── services.ts          # Pure business logic functions (abstract class)
│   ├── -app/                     # Application layer (Clean Architecture)
│   │   ├── create.ts            # Implements contract via implement()
│   │   ├── update.ts            # Implements contract via implement()
│   │   └── ...                  # Pure handlers with orchestration logic
│   ├── -lib/                     # Infrastructure layer (Clean Architecture)
│   │   ├── feature-repository.ts # Data access patterns (abstract class)
│   │   └── types.ts             # Infrastructure type exports
│   ├── -locales/                 # Feature internationalization files
│   └── sub-feature/              # Nested sub-features with own layering
│       ├── index.tsx            # Sub-feature page
│       ├── -components/
│       ├── -domain/
│       ├── -app/
│       ├── -lib/
│       └── -locales/
```

### Abstract Class Organization Pattern

All services, repositories, and schemas use abstract classes as organizational containers:

**Domain Service Example:**
```typescript
// -domain/services.ts
export abstract class FeatureService {
  private constructor() {} // Prevent instantiation

  static validateBusinessRule(input: Data): ValidationResult {
    // Pure business logic
    return { valid: true }
  }
}

// Usage
const result = FeatureService.validateBusinessRule(data)
```

**Repository Example:**
```typescript
// -lib/feature-repository.ts
export abstract class FeatureRepository {
  private constructor() {}

  static async findById(db: DatabaseType, id: string) {
    return db.query.table.findFirst({ where: eq(table.id, id) })
  }

  static async create(db: DatabaseType, data: CreateInput) {
    return db.transaction(async (tx) => {
      const [item] = await tx.insert(table).values(data).returning()
      return this.findById(tx, item.id)
    })
  }
}

// Usage
const item = await FeatureRepository.findById(db, id)
```

**Schema Organization (4 Abstract Classes):**
```typescript
// -domain/schemas.ts
export abstract class FeatureBaseSchemas {
  private constructor() {}
  static readonly Status = z.enum(["active", "inactive"])
  static readonly Base = z.object({ id: z.string(), name: z.string() })
}

export abstract class FeatureInputSchemas {
  private constructor() {}
  static readonly Create = z.object({ name: z.string() })
  static readonly Update = z.object({ id: z.string(), name: z.string().optional() })
}

export abstract class FeatureOutputSchemas {
  private constructor() {}
  static readonly ListResponse = z.object({
    items: z.array(FeatureBaseSchemas.Base),
    total: z.number()
  })
}

export abstract class FeatureValidationSchemas {
  private constructor() {}
  static readonly CustomRule = z.object({ /* ... */ }).refine(/* ... */)
}

// Usage
const input = FeatureInputSchemas.Create.parse(data)
export type CreateInput = z.infer<typeof FeatureInputSchemas.Create>
```

**When to Break Down:**
- Start with one abstract class per layer
- Split when a class becomes too complex (>300 lines)
- Group by responsibility (e.g., `UserAuthService`, `UserProfileService`)

### Domain Layer Pattern (Pure Business Logic)

Domain services contain pure business logic with no external dependencies:

```typescript
// -domain/services.ts
export abstract class FeatureService {
  private constructor() {}

  /**
   * Status Transition Rules
   * Business rule: Valid status transitions
   */
  static readonly STATUS_TRANSITIONS: Record<Status, Status[]> = {
    draft: ["active", "cancelled"],
    active: ["completed", "cancelled"],
    completed: [],
    cancelled: ["draft"],
  }

  /**
   * Validate Status Transition
   * Pure function - testable without infrastructure
   */
  static validateStatusTransition(
    fromStatus: Status,
    toStatus: Status
  ): ValidationResult {
    const allowed = FeatureService.STATUS_TRANSITIONS[fromStatus] || []

    if (fromStatus === toStatus) {
      return {
        valid: false,
        allowedTransitions: allowed,
        reason: "Cannot transition to same status",
      }
    }

    const isValid = allowed.includes(toStatus)
    return {
      valid: isValid,
      allowedTransitions: allowed,
      reason: isValid
        ? undefined
        : `Cannot transition from ${fromStatus} to ${toStatus}`,
    }
  }

  /**
   * Validate Date Range
   * Business rule for date validation
   */
  static validateDateRange(
    startDate: Date,
    endDate: Date
  ): ValidationResult {
    if (startDate > endDate) {
      return {
        valid: false,
        reason: "End date must be after or same as start date",
      }
    }
    return { valid: true }
  }
}
```

### Application Layer Pattern (Orchestration)

Application handlers implement contracts and orchestrate between layers:

```typescript
// -app/create.ts
import { implement } from "@orpc/server"
import type { Context } from "@/lib/orpc/context"
import { SharedInfraService } from "@/routes/admin/-lib/shared-infra-service"
import { FeatureContracts } from "../-domain/contracts"
import { FeatureService } from "../-domain/services"
import { FeatureRepository } from "../-lib/feature-repository"

export const create = implement(FeatureContracts.create)
  .$context<Context>()
  .handler(async ({ input, context, errors }) => {
    // 1. Shared infrastructure validation (cross-feature)
    const access = await SharedInfraService.validate(
      context.db,
      input.parentId,
      input.parentType
    )

    if (!access.exists) {
      throw errors.PARENT_NOT_FOUND({
        data: {
          parentId: input.parentId,
          parentType: input.parentType,
        },
      })
    }

    if (!access.hasPermission) {
      throw errors.UNAUTHORIZED_ACCESS({
        data: {
          parentId: input.parentId,
          parentType: input.parentType,
        },
      })
    }

    // 2. Domain service validation (pure business logic)
    const dateValidation = FeatureService.validateDateRange(
      input.startDate,
      input.endDate
    )

    if (!dateValidation.valid) {
      throw errors.INVALID_DATE_RANGE({
        data: {
          reason: dateValidation.reason || "Invalid date range",
          startDate: input.startDate.toISOString(),
          endDate: input.endDate.toISOString(),
        },
      })
    }

    // 3. Repository operation (feature infrastructure)
    const item = await FeatureRepository.create(context.db, {
      name: input.name,
      status: "draft",
      startDate: input.startDate,
      endDate: input.endDate,
      parentId: input.parentId,
      parentType: input.parentType,
    })

    return {
      item,
      message: "Created successfully",
    }
  })
```

### Feature-First Colocation

Code organization follows a nested, progressive pattern:

**Level 1: Feature-Specific**
```
feature-a/
└── -lib/
    └── feature-a-helper.ts  # Only used by feature-a
```

**Level 2: Shared by Siblings**
```
parent/
├── feature-a/
│   └── uses shared-validator.ts
├── feature-b/
│   └── uses shared-validator.ts
└── -lib/
    └── shared-validator.ts  # Moved up when feature-b needed it
```

**Level 3: Shared Across Areas**
```
src/
├── lib/
│   └── global-utility.ts  # Used by admin, public, api areas
└── routes/
    ├── admin/
    │   └── feature/ uses global-utility
    └── public/
        └── feature/ uses global-utility
```

**Migration Pattern:**
1. Start: Code in feature directory
2. When 2nd feature needs it: Move to parent `-lib/`
3. When 3rd area needs it: Move to root `lib/`
4. Keep changes localized until proven need for sharing

### Frontend Component Organization Patterns

#### Component Structure Template
Standard component organization for consistency and maintainability:
```typescript
// 1. Imports and dependencies
import { useState, useEffect } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { orpc } from "@/lib/orpc/client";

// 2. Type definitions and interfaces
interface ComponentProps {
  data: DataType;
  onAction?: (id: string) => void;
}

// 3. Component implementation
const Component: React.FC<ComponentProps> = ({
  data,
  onAction
}) => {
  // Component logic and state
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Card className="w-full">
      {/* JSX structure */}
    </Card>
  );
};

// 4. Helper functions and utilities
const formatData = (input: Data): string => {
  // Formatting logic
};

// 5. Exports
export { Component };
export type { ComponentProps };
```

#### Route Component Pattern
Main page components with TanStack Start integration:
```typescript
// index.tsx - Route configuration and page component
export const Route = createFileRoute("/admin/feature/")({
  validateSearch: zodValidator(FeatureInputSchemas.PageSearch),
  loaderDeps: ({ search }) => ({ /* deps */ }),
  loader: ({ context, deps }) => { /* data pre-loading */ },
  errorComponent: FeatureErrorComponent,
  pendingComponent: FeaturePendingComponent,
  pendingMs: 200,
  component: FeaturePage,
});

function FeaturePage() {
  // Hook usage and state management
  const search = Route.useSearch();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Data fetching
  const { data, isLoading, error } = useQuery(
    orpc.feature.list.queryOptions({ input: deps })
  );

  // Component rendering
  return (
    <div className="min-h-screen space-y-6 pb-20 sm:pb-6">
      {/* Header, Filters, Content */}
    </div>
  );
}

// For components without direct Route access, use the from pattern
const FeatureCard: React.FC<{ data: FeatureData }> = ({ data }) => {
  const search = Route.useSearch({ from: "/admin/feature/" });
  const router = useRouter({ from: "/admin/feature/" });

  // Component logic using URL state
  return (
    <Card>
      {/* Component content */}
    </Card>
  );
};
```

#### Component Composition Patterns
Consistent patterns for building reusable components:

**Compound Component Pattern:**
```typescript
// Base card with composable actions
const BaseCard: React.FC<BaseCardProps> = ({
  children,
  className,
  actions
}) => (
  <Card className={cn("w-full", className)}>
    <div className="p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">{children}</div>
        {actions && (
          <div className="flex gap-1">{actions}</div>
        )}
      </div>
    </div>
  </Card>
);

// Usage in feature components
const FeatureCard: React.FC<FeatureCardProps> = ({ item }) => (
  <BaseCard
    actions={
      <>
        <Button size="sm" variant="outline">
          <Edit className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="outline">
          <Trash2 className="h-4 w-4" />
        </Button>
      </>
    }
  >
    <div className="space-y-2">
      <h3 className="font-semibold">{item.name}</h3>
      <p className="text-sm text-muted-foreground">{item.description}</p>
    </div>
  </BaseCard>
);
```

**Slot Pattern for Accessibility:**
```typescript
// Full card link with accessible overlay
<Card className="group relative">
  <CardHeader>
    <CardTitle>{item.name}</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
  {/* Full card link for accessibility */}
  <Link
    to={`/feature/${item.id}`}
    className="absolute inset-0 z-10"
    aria-label={`Edit ${item.name}`}
  >
    <span className="sr-only">Edit {item.name}</span>
  </Link>
</Card>
```

#### Composable State Management Patterns
Prefer composable patterns over custom hooks:

**State Management Hierarchy:**
```typescript
// 1. URL-First: Application state that needs to be shareable/bookmarkable
export const FeatureFilters: React.FC = () => {
  const search = Route.useSearch({ from: "/admin/feature/" });
  const router = useRouter({ from: "/admin/feature/" });

  // Direct URL state management - no local state needed
  const handleSearchChange = (value: string) => {
    router.navigate({
      to: ".",
      search: { ...search, search: value || undefined },
    });
  };

  return (
    <Card className="p-4">
      <Input
        placeholder="Search features..."
        value={search.search || ""}
        onChange={(e) => handleSearchChange(e.target.value)}
      />
    </Card>
  );
};

// 2. Jotai: Simple patterns for reusable component state (when not using URL)

// Basic counter atom
const countAtom = atom(0);

// Derived atom (read-only)
const doubledCountAtom = atom((get) => get(countAtom) * 2);

// Write-only atom for actions
const incrementAtom = atom(null, (_get, set) => {
  set(countAtom, (c) => c + 1);
});

// Read-write derived atom
const countWithControlsAtom = atom(
  (get) => get(countAtom),
  (_get, set, newCount) => {
    set(countAtom, newCount);
  }
);

// Async atom example
const userAtom = atom(async (get) => {
  const response = await fetch('/api/user');
  return response.json();
});

// Note: For dialogs and routing state, prefer URL-first patterns (see example above)

// 3. useState: Local component state that doesn't need to be shared
export const FeatureCard: React.FC<{ item: FeatureItem }> = ({ item }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader>{item.name}</CardHeader>
    </Card>
  );
};
```

**TanStack Form Composition:**
```typescript
// -lib/form-contexts.tsx
export const FeatureFormContext = createContext<FormContextValue<{
  name: string;
  type: FeatureType;
  description?: string;
}>>(null);

export const { useAppForm: useFeatureForm } = createFormHook({
  fieldContext: FeatureFormContext,
  formContext: FormContext,
  fieldComponents: {
    FeatureNameField,
    FeatureTypeField,
    FeatureDescriptionField,
  },
  formComponents: {
    SubmitButton,
  },
});
```

### Component Organization
1. Imports and dependencies
2. Type definitions and interfaces
3. Component implementation
4. Helper functions and utilities
5. Exports

### Function/Method Organization
- Input validation and error handling
- Core business logic
- State management
- Return statements with proper typing

## Code Organization Principles

1. **Clean Architecture**: Following Clean Architecture principles with clear layer separation
   - **Domain Layer**: Business entities, use cases, and domain logic (-domain/)
   - **Application Layer**: Application services and data access (-app/)
   - **Presentation Layer**: UI components and routes (-components/, index.tsx)
   - **Infrastructure Layer**: Infrastructure services, Jotai atoms, and external integrations (-lib/)

2. **Feature-Based Architecture**: Code organized by business features rather than technical layers
3. **Co-location**: Related files (components, domain logic, services) are grouped together in feature folders
4. **Service-Oriented**: Prefer service patterns over utility functions for better alignment with Clean Architecture
5. **Composability over Custom Hooks**: Prefer Jotai atoms and composable patterns over complex custom hooks
6. **Separation of Concerns**: Clear distinction between UI components, business logic, and data access
7. **Consistent Patterns**: All features follow the same folder structure, kebab-case file naming, and standard TypeScript code conventions
8. **Type Safety**: All components and functions have proper TypeScript typing
9. **Contract-First Development**: oRPC contracts define API surface before implementation
   - **Error Definitions**: Use `oc.errors()` from `@orpc/contract` in domain `errors.ts` to create reusable error bases with default message and typed data schemas
   - **Contract Organization**: Abstract class in `contracts.ts` with static readonly properties for each contract
   - **Contract Composition**: Chain `.input()` and `.output()` on error base - errors are inherited by all contracts using the base
   - **Error Reusability**: Multiple contracts can share the same error base, or add contract-specific errors via another `.errors()` call
   - **Implementation**: Application layer uses `implement(FeatureContracts.operation)` for type-safe handlers with automatic error inference
   - **Frontend Integration**: Frontend imports contracts and errors from domain for full type safety including error data structure
   - **Error Handling**: Type-safe client error handling with `isDefinedError()` helper for runtime error type checking
   - **Example Pattern**:
     ```typescript
     // -domain/errors.ts
     export const featureErrors = oc.errors({
       NOT_FOUND: {
         message: "Resource not found",
         data: z.object({ id: z.string() })
       }
     })

     // -domain/contracts.ts
     export abstract class FeatureContracts {
       private constructor() {}

       static readonly get = featureErrors
         .input(z.object({ id: z.string() }))
         .output(ResourceSchema)

       static readonly create = featureErrors
         .input(CreateInputSchema)
         .output(CreateResponseSchema)
     }

     // -app/get.ts
     export const get = implement(FeatureContracts.get).handler(({ errors }) => {
       throw errors.NOT_FOUND({ data: { id: "123" } })
     })
     ```

## Module Boundaries

### Feature Boundaries
- **Admin vs Public**: Clear separation between admin dashboard and public-facing features
- **Feature Independence**: Each feature (boards, majlis, etc.) operates independently with minimal coupling
- **Shared Resources**: Common UI components and utilities in shared locations

### Data Layer Boundaries (Clean Architecture)
- **Domain Layer**: Core business logic in feature `-domain/` folders (entities, use cases, domain services)
- **Application Layer**: Application services and data access in `-app/` folders
- **Presentation Layer**: UI components in `-components/` folders and route files
- **Infrastructure Layer**: Utilities, Jotai atoms, and external integrations in `-lib/` folders
- **Database Layer**: Database schemas in `/lib/db/schema/`

### Dependencies Direction (Clean Architecture)
- **Inward Dependencies**: Dependencies point inward toward the domain
- **Domain Layer**: No dependencies on other layers (pure business logic)
- **Application Layer**: Can depend on Domain Layer
- **Presentation Layer**: Can depend on Application and Domain Layers
- **Infrastructure Layer**: Can depend on all layers but not vice versa
- **Feature Independence**: Features can depend on shared utilities but not on each other
- **RPC Boundaries**: Server actions properly isolated for client component access

## Code Size Guidelines

### File Size Guidelines
- **Component files**: Maximum 300 lines for maintainability
- **Route files**: Maximum 200 lines, prefer component extraction
- **Domain files**: Maximum 200 lines (schemas, entities, use cases)
- **Schema files**: Maximum 200 lines
- **Application files**: Maximum 150 lines (services, API calls)
- **Infrastructure files**: Maximum 100 lines (infrastructure services, Jotai atoms)

### Function/Method Size
- **React components**: Maximum 150 lines
- **Domain entities**: Maximum 100 lines
- **Application services**: Maximum 80 lines
- **Infrastructure services**: Maximum 80 lines
- **Jotai atoms**: Maximum 50 lines (prefer composability over complex hooks)

### Complexity Limits
- **Cyclomatic complexity**: Maximum 10 per function
- **Nesting depth**: Maximum 4 levels
- **Parameter count**: Maximum 5 parameters (prefer object parameters)

## Dashboard Structure

### Admin Dashboard Organization
```
src/routes/admin/
├── index.tsx                     # Admin dashboard home
├── route.tsx                     # Admin route configuration
├── -components/                  # Shared admin UI components
│   ├── admin-layout.tsx         # Main admin layout wrapper
│   ├── admin-sidebar.tsx        # Navigation sidebar
│   └── nav-*.tsx                # Navigation components
├── -libs/                       # Admin-specific utilities
└── feature-modules/             # Individual admin features
    ├── boards/                  # Board management
    ├── majlis.tsx              # Majlis management
    └── maktab.tsx              # Maktab system
```

### Separation of Concerns
- **Layout**: Admin layout isolated from feature implementations
- **Navigation**: Separate navigation components for different admin sections
- **Features**: Each admin feature is self-contained with its own components and logic
- **Authentication**: Admin-specific authentication and authorization handling

## Documentation Standards

### Code Documentation
- All public APIs must have comprehensive JSDoc comments
- Complex business logic includes inline explanations
- Component props have clear TypeScript interfaces and documentation
- Database schemas include field descriptions and constraints

### README Standards
- Feature modules have README files explaining purpose and usage
- Complex components include usage examples
- API routes have endpoint documentation
- Shared utilities include function signatures and examples

### Internationalization Standards
- All user-facing text uses Lingui i18n keys
- Component files include `.po` files for translations
- Translation keys follow feature-based naming (e.g., `boards.form.title`)
- Fallback to English for missing translations
