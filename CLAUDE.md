<!-- vibe-rules Integration -->

<bts>
# Better-T-Stack Project Rules

This is a my-better-t-app-2 project created with Better-T-Stack CLI.

## Project Structure

This is a full-stack TanStack Start application with the following structure:

- **`apps/web/`** - Full-stack application (TanStack Start + oRPC)
- **`apps/fumadocs/`** - Documentation site (Fumadocs)


## Available Scripts

- `bun run dev` - Start the full-stack application in development mode
- `bun run dev:web` - Start only the web application
- `bun run dev:fumadocs` - Start only the documentation site

## Database Commands

All database operations should be run from the web workspace:

- `bun run db:push` - Push schema changes to database
- `bun run db:studio` - Open database studio
- `bun run db:generate` - Generate Drizzle files
- `bun run db:migrate` - Run database migrations

Database schema files are located in `apps/web/src/lib/db/schema/`

## API Structure

- oRPC procedures are in feature `-app/` folders (e.g., `apps/web/src/routes/auth/-app/`)
- oRPC router is in `apps/web/src/lib/orpc/router/index.ts`
- Client-side oRPC client is in `apps/web/src/lib/orpc/client.ts`

## Authentication

Authentication is enabled in this project:
- Auth configuration is in `apps/web/src/lib/auth/index.ts`
- Auth feature module is in `apps/web/src/routes/auth/`

## Architecture Guidelines

This project follows Clean Architecture principles with feature-based organization:

### Layer Definitions

- **`-app/`** - Application Layer (use cases, business operations)
- **`-domain/`** - Domain Layer (business rules, entities, validation)
- **`-components/`** - Presentation Layer (UI components with direct oRPC calls)
- **`lib/`** - Infrastructure Layer (external services, database)

### Folder Structure Rules

- **Root level**: No dashes (`lib/`, `components/`, `hooks/`, `routes/`)
- **Feature layers**: Dashes (`-app/`, `-domain/`, `-components/`)
- **Sub-features**: No dashes (`signin/`, `signout/`, `categories/`)
- **Sub-feature layers**: Dashes (`signin/-app/`, `signin/-components/`)

### Feature Organization Principles

1. **Start local**: Keep shared code within features first (`auth/-domain/`)
2. **Extract when needed**: Move to cross-feature only when actually shared (`routes/shared/`)
3. **High cohesion**: Related code that changes together stays together
4. **Clear dependencies**: Presentation → Application → Domain ← Infrastructure

### Example Structure

```
src/routes/
├── auth/
│   ├── -app/           # Login, signup, logout procedures
│   ├── -domain/        # Auth validation, user entity, password rules
│   ├── -components/    # login-form, signup-form components
│   ├── signin/         # Sub-feature
│   │   ├── -app/       # Social login procedures
│   │   └── -components/ # social-buttons component
│   └── signout/        # Sub-feature
│       ├── -app/       # Logout all sessions
│       └── -components/ # logout-button component
└── todos/
    ├── -app/           # CRUD procedures
    ├── -domain/        # Todo entity, validation
    └── -components/    # todo-list, todo-form (with direct oRPC calls)
```

### Import Patterns

```typescript
// Infrastructure layer
import { db } from '@/lib/db'
import { Button } from '@/components/ui/button'

// Cross-feature domain
import { checkPermissions } from '@/routes/shared/permissions'

// Feature layers
import { loginUser } from '@/routes/auth/-app/login'
import { validateEmail } from '@/routes/auth/-domain/validation'
import { LoginForm } from '@/routes/auth/-components/login-form'

// Sub-features
import { GoogleLogin } from '@/routes/auth/signin/-components/google-login'
```

## Adding More Features

You can add additional addons or deployment options to your project using:

```bash
bunx create-better-t-stack
add
```

Available addons you can add:
- **Documentation**: Starlight, Fumadocs
- **Linting**: Biome, Oxlint, Ultracite
- **Other**: vibe-rules, Turborepo, PWA, Tauri, Husky

You can also add web deployment configurations like Cloudflare Workers support.

## Project Configuration

This project includes a `bts.jsonc` configuration file that stores your Better-T-Stack settings:

- Contains your selected stack configuration (database, ORM, backend, frontend, etc.)
- Used by the CLI to understand your project structure
- Safe to delete if not needed
- Updated automatically when using the `add` command

## Key Points

- This is a Turborepo monorepo using bun workspaces
- Each app has its own `package.json` and dependencies
- Run commands from the root to execute across all workspaces
- Run workspace-specific commands with `bun run command-name`
- Turborepo handles build caching and parallel execution
- Use `bunx
create-better-t-stack add` to add more features later
</bts>

<!-- /vibe-rules Integration -->
