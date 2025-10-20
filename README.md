# 🚀 Betterz Stack Template

> **Production-ready full-stack TypeScript template** with unified oRPC architecture, Clean Architecture principles, and modern development tooling.

A modern, type-safe, and scalable foundation for building full-stack applications. Clone, configure, and ship your next project in minutes.

## ✨ What's Included

### 🏗️ **Unified oRPC Architecture**
- **End-to-end Type Safety** - From database to UI with zero runtime errors
- **Single API Pattern** - All data fetching through unified oRPC layer
- **Better Auth Integration** - Seamless authentication with Better Auth conventions
- **TanStack Query Integration** - Optimized caching and state management

### 🔐 **Authentication System**
- **Email & Password** - Built-in authentication with Better Auth
- **OAuth Ready** - GitHub, Google, and other providers pre-configured
- **Protected Routes** - Context-based auth guards with TanStack Router
- **Session Management** - Secure, persistent sessions with automatic refresh

### 🎨 **Modern UI/UX**
- **shadcn/ui Components** - Beautiful, accessible, and customizable
- **Tailwind CSS** - Utility-first styling with dark mode support
- **Responsive Design** - Mobile-first approach with smooth animations
- **Type-safe Forms** - TanStack Form with validation

### 🗄️ **Database & ORM**
- **PostgreSQL** - Robust, scalable database with Docker setup
- **Drizzle ORM** - Type-safe database operations with migrations
- **Database Studio** - Visual database management interface
- **Schema Management** - Version-controlled database evolution

### 🏛️ **Clean Architecture**
- **Feature-based Organization** - Domain-driven folder structure
- **Separation of Concerns** - Clear layers and dependencies
- **Testable Code** - Easy unit and integration testing
- **Scalable Patterns** - From MVP to enterprise-scale applications

### 🌐 **Internationalization (i18n)**
- **Lingui Integration** - Type-safe, feature-first translations
- **Feature-Prefixed Files** - Self-documenting translation structure
- **Auto-Discovery** - Parallel catalog loading with zero configuration
- **Built-in Language Switcher** - URL parameter persistence and smooth switching

### 🛠️ **Developer Experience**
- **Turborepo Monorepo** - Optimized build system and caching
- **TypeScript** - Full type safety across the entire stack
- **Biome** - Ultra-fast linting and formatting
- **Hot Reload** - Instant feedback during development
- **Git Hooks** - Automated code quality checks

## 🚀 Quick Start

### Prerequisites

Make sure you have the following installed:
- **Node.js** 18+ ([Download](https://nodejs.org))
- **Bun** 1.2+ ([Install](https://bun.sh))
- **Docker** ([Install](https://docker.com)) 
- **Git** ([Install](https://git-scm.com))

### 1. Clone & Install

```bash
git clone https://github.com/masrurimz/betterz-stack-template.git
cd betterz-stack-template
bun install
```

### 2. Environment Setup

```bash
# Copy environment template
cp apps/web/.env.example apps/web/.env

# Edit with your configuration
nano apps/web/.env
```

**Required Environment Variables:**
```bash
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/my_better_t_app"

# Auth (generate a 32-character secret)
BETTER_AUTH_SECRET="your-32-character-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"
```

### 3. Start Database

```bash
# Start PostgreSQL with Docker
bun db:start

# Push database schema
bun db:push
```

### 4. Run Development Server

```bash
bun dev
```

🎉 **Open [http://localhost:3000](http://localhost:3000)** - You should see the landing page with working authentication!

## 🏗️ Architecture Overview

### Unified oRPC Pattern

This template uses a **unified oRPC architecture** where all API calls go through a single, type-safe layer:

```typescript
// ✅ Unified pattern - all data fetching through oRPC
const { data: session } = useQuery(orpc.auth.getSession.queryOptions({}));
const { data: todos } = useQuery(orpc.todo.getAll.queryOptions({}));

// ❌ Old pattern - mixed createServerFn and oRPC
const user = await getUser(); // createServerFn
const todos = await orpc.todo.getAll.fetch({}); // oRPC
```

### Clean Architecture Structure

```
apps/web/src/
├── routes/                 # 🏛️ Feature modules (Clean Architecture) & TanStack Router
│   ├── auth/
│   │   ├── -app/          # Application layer (use cases)
│   │   ├── -domain/       # Domain layer (business rules)
│   │   ├── -components/   # Presentation layer (UI)
│   │   └── signin/        # Sub-features
│   └── todos/
│       ├── -app/          # CRUD operations
│       ├── -domain/       # Todo validation & entities
│       └── -components/   # Todo UI components
├── lib/                   # 🔧 Infrastructure layer
│   ├── auth/             # Better Auth configuration
│   ├── db/               # Database connection & schema
│   └── orpc/             # oRPC router & client
├── components/           # 🎨 Shared UI components
├── routes/               # 🛣️ TanStack Router file-based routing
└── styles/              # 💅 Global styles & Tailwind config
```

### Layer Dependencies

```
Presentation (-components) 
    ↓ 
Application (-app) 
    ↓ 
Domain (-domain) 
    ↑ 
Infrastructure (lib/)
```

## 🔐 Authentication System

### How It Works

1. **Better Auth Integration** - Handles authentication logic and session management
2. **oRPC Endpoint** - `orpc.auth.getSession` provides type-safe session access
3. **Context Loading** - User session loaded at root level for all routes
4. **Protected Routes** - `beforeLoad` guards check authentication status

### Usage Examples

```typescript
// Get current user in components
const { data: session } = useQuery(orpc.auth.getSession.queryOptions({}));
const user = session?.user;

// Protect routes
export const Route = createFileRoute('/dashboard')({
  beforeLoad: ({ context }) => {
    if (!context.user) {
      throw redirect({ to: '/auth/signin' });
    }
  },
});

// Protected API endpoints
export const getPrivateData = protectedProcedure.handler(({ context }) => {
  // context.session.user is guaranteed to exist
  return { userId: context.session.user.id };
});
```

### Adding OAuth Providers

```bash
# Add to apps/web/.env
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

```typescript
// Update apps/web/src/lib/auth/index.ts
export const auth = betterAuth({
  // ... existing config
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
});
```

## 🗄️ Database Management

### Available Commands

```bash
# Development
bun db:start      # Start PostgreSQL container
bun db:push       # Push schema changes
bun db:studio     # Open Drizzle Studio (database GUI)
bun db:generate   # Generate migration files
bun db:migrate    # Run migrations

# Container management
bun db:watch      # Start with logs
bun db:stop       # Stop container
bun db:down       # Remove container & data
```

### Schema Changes

1. **Edit schema** in `apps/web/src/lib/db/schema/`
2. **Push changes** with `bun db:push` (development)
3. **Generate migration** with `bun db:generate` (production)

```typescript
// apps/web/src/lib/db/schema/posts.ts
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { user } from './auth';
import { generateUUID } from './utils';

export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().$defaultFn(generateUUID),
  title: text('title').notNull(),
  content: text('content'),
  userId: uuid('user_id').references(() => user.id).notNull(),
  createdAt: timestamp('created_at').$defaultFn(() => new Date()).notNull(),
  updatedAt: timestamp('updated_at').$defaultFn(() => new Date()).notNull(),
});
```

## 📦 Available Scripts

### Root Level Commands
```bash
bun dev           # Start development server
bun build         # Build for production
bun check-types   # TypeScript type checking
bun check         # Lint and format with Biome
bun clean         # Clean all build artifacts
```

### Database Commands
```bash
bun db:start      # Start PostgreSQL container
bun db:push       # Push schema to database
bun db:studio     # Open database GUI
bun db:generate   # Generate migration files
bun db:migrate    # Run database migrations
```

### Web App Commands (from apps/web/)
```bash
bun dev           # Start with Vite dev server
bun build         # Build for production
bun serve         # Preview production build
bun test          # Run Vitest tests
bun lint          # Lint with Biome
bun format        # Format with Biome
```

### Translation Commands (from apps/web/)
```bash
bun lingui:extract    # Extract translatable strings from code
bun lingui:compile    # Compile translations for production
bun lingui:dev        # Extract and compile (development)
```

## 🛠️ Development Workflow

### Adding a New Feature

1. **Create feature module** following Clean Architecture:
```bash
mkdir -p apps/web/src/routes/posts/{-app,-domain,-components,-locales}
```

2. **Define domain entities** in `-domain/`:
```typescript
// apps/web/src/routes/posts/-domain/post.ts
export interface Post {
  id: string;
  title: string;
  content: string;
  userId: string;
}
```

3. **Create API endpoints** in `-app/`:
```typescript
// apps/web/src/routes/posts/-app/get-posts.ts
export const getPosts = publicProcedure.handler(async ({ context }) => {
  return await context.db.select().from(posts);
});
```

4. **Add to oRPC router**:
```typescript
// apps/web/src/lib/orpc/router/index.ts
export default {
  // ... existing endpoints
  posts: {
    getAll: getPosts,
  },
};
```

5. **Set up feature translations**:
```bash
# Update Lingui configuration
# Add posts catalog to lingui.config.ts catalogs array:
{
  path: '<rootDir>/src/routes/posts/-locales/posts-{locale}',
  include: ['src/routes/posts/**'],
  exclude: ['**/node_modules/**'],
}

# Update import paths in src/lib/lingui/i18n.ts:
() => import('../../routes/posts/-locales/posts-${locale}.po')

# Extract translations to generate files
bun run lingui:extract
```

6. **Create UI components** in `-components/`:
```typescript
// apps/web/src/routes/posts/-components/post-list.tsx
import { useLingui } from '@lingui/react/macro';

export function PostList() {
  const { t } = useLingui();
  const { data: posts } = useQuery(orpc.posts.getAll.queryOptions({}));
  
  if (!posts?.length) {
    return <p>{t`No posts found`}</p>;
  }
  
  return (
    <div>
      <h2>{t`Posts`}</h2>
      {/* ... component implementation */}
    </div>
  );
}
```

### Code Style & Conventions

- **TypeScript**: Strict mode enabled, no `any` types
- **Imports**: Use `@/` alias for absolute imports
- **Components**: PascalCase for components, kebab-case for files
- **API**: camelCase for oRPC procedures
- **Database**: snake_case for table/column names

## 🚀 Deployment

### Production Build

```bash
# Build the application
bun run build

# Start production server
bun run start
```

### Environment Variables

Set these in your production environment:

```bash
# Required
DATABASE_URL="your-production-postgres-url"
BETTER_AUTH_SECRET="your-production-secret"
BETTER_AUTH_URL="https://yourdomain.com"

# Optional OAuth
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

### Platform-Specific Guides

#### Vercel
1. Connect your GitHub repository
2. Set environment variables in Vercel dashboard
3. Deploy automatically on git push

#### Railway
1. Connect repository
2. Add PostgreSQL service
3. Set `DATABASE_URL` environment variable
4. Deploy

#### Docker
```dockerfile
FROM oven/bun:1
WORKDIR /app
COPY . .
RUN bun install
RUN bun run build
EXPOSE 3000
CMD ["bun", "start"]
```

## 🎨 Customization

### 🌐 Internationalization (i18n)

Built with **Lingui** for type-safe, feature-first internationalization that scales with your application.

**Feature-Prefixed Translation Structure:**
```
src/
├── locales/                # Global translations
│   ├── global-en.po        # Global English translations
│   └── global-id.po        # Global Indonesian translations
└── routes/
    ├── auth/-locales/      # Auth feature translations
    │   ├── auth-en.po      # Auth English translations
    │   └── auth-id.po      # Auth Indonesian translations
    └── todos/-locales/     # Todos feature translations
        ├── todos-en.po     # Todos English translations
        └── todos-id.po     # Todos Indonesian translations
```

**Key Benefits:**
- **Self-documenting**: File names immediately show feature and locale
- **No naming conflicts**: Impossible collisions between features
- **Scalable**: Easy to add new features with predictable naming
- **Auto-discovery**: Automatically loads all catalogs in parallel

**Translation Commands:**
```bash
# Extract translatable strings from code
bun run lingui:extract

# Compile translations for production  
bun run lingui:compile

# Extract and compile in one command
bun run lingui:dev
```

**File Types:**
- **`.po` files** - Source translations (committed to git)
- **`.js/.mjs` files** - Compiled translations (ignored by git, auto-generated)

**Using Translations in Components:**
```typescript
// Import translation macro
import { useLingui } from '@lingui/react/macro';

export function LoginForm() {
  const { t } = useLingui();
  
  return (
    <button>{t`Login`}</button>  // ✅ Correct usage
  );
}
```

**Language Switching:**
- Built-in language switcher in header navigation
- URL parameter persistence (`?locale=en` or `?locale=id`)
- Automatic translation loading and router invalidation

**Supported Locales:**
- **`en`** - English (default/source locale)
- **`id`** - Indonesian

**Adding New Features:**
1. Create `-locales/` folder in your feature directory
2. Add feature-prefixed translation files (e.g., `posts-en.po`, `posts-id.po`)
3. Update `lingui.config.ts` catalog paths
4. Update `src/lib/lingui/i18n.ts` import paths
5. Run `bun run lingui:extract` to generate translation files

### UI Theme & Styling

```bash
# Customize Tailwind config
nano apps/web/tailwind.config.ts

# Add shadcn/ui components
bunx shadcn@latest add button card input
```

### Adding New Pages

```bash
# File-based routing with TanStack Router
touch apps/web/src/routes/about.tsx
```

```typescript
// apps/web/src/routes/about.tsx
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/about')({
  component: About,
});

function About() {
  return <div>About Page</div>;
}
```

### Custom Components

```typescript
// apps/web/src/components/ui/custom-button.tsx
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function CustomButton({ className, ...props }) {
  return (
    <Button 
      className={cn('bg-gradient-to-r from-blue-500 to-purple-600', className)} 
      {...props} 
    />
  );
}
```

## 🔧 Troubleshooting

### Common Issues

#### Database Connection Failed
```bash
# Check if PostgreSQL is running
docker ps

# Restart database container
bun db:stop && bun db:start

# Verify connection string in .env
echo $DATABASE_URL
```

#### Authentication Not Working
```bash
# Check auth secret length (must be 32+ characters)
echo $BETTER_AUTH_SECRET | wc -c

# Verify auth URL matches your domain
echo $BETTER_AUTH_URL
```

#### Build Errors
```bash
# Clean all caches and node_modules
bun clean

# Reinstall dependencies
rm -rf node_modules bun.lock
bun install

# Type check
bun check-types
```

#### Port Already in Use
```bash
# Find process using port 3000
lsof -ti:3000

# Kill process
kill -9 $(lsof -ti:3000)
```

### Getting Help

- **Issues**: [GitHub Issues](https://github.com/masrurimz/betterz-stack-template/issues)
- **Discussions**: [GitHub Discussions](https://github.com/masrurimz/betterz-stack-template/discussions)
- **Documentation**: Check individual tool docs linked in each section

## 📚 Learn More

- [TanStack Start](https://tanstack.com/start) - Full-stack React framework
- [oRPC](https://orpc.dev) - Type-safe APIs with OpenAPI
- [Better Auth](https://better-auth.com) - Authentication library
- [Drizzle ORM](https://drizzle.dev) - TypeScript ORM
- [shadcn/ui](https://ui.shadcn.com) - UI component library
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) - Architecture principles

## 📄 License

MIT © [Muhammad Zahid Masruri](https://github.com/masrurimz)

---

<div align="center">

**⭐ Star this repo if it helped you build something awesome!**

[Report Bug](https://github.com/masrurimz/betterz-stack-template/issues) · [Request Feature](https://github.com/masrurimz/betterz-stack-template/issues) · [Contribute](https://github.com/masrurimz/betterz-stack-template/pulls)

</div>