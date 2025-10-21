# Luar Sekolah LMS

**Learning Management System for Indonesian Schools**

> 📚 **Note**: This project is forked from the [betterz-stack](https://github.com/masrurimz/betterz-stack) template and customized for educational purposes.

Built with modern web technologies to provide a comprehensive learning platform for Indonesian schools.

## 🚀 Tech Stack

- **Framework**: TanStack Start
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS
- **Authentication**: Better Auth
- **UI Components**: Radix UI + Shadcn
- **Language**: TypeScript
- **Package Manager**: Bun
- **Deployment**: Cloudflare Workers (optional)

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+ or Bun
- PostgreSQL database
- Docker (optional, for local database)

### 1. Install Dependencies

```bash
bun install
```

### 2. Database Setup

#### Option A: Docker (Recommended)

```bash
# Start PostgreSQL container
bun run db:start

# Run migrations
bun run db:push

# (Optional) Open database studio
bun run db:studio
```

#### Option B: Local PostgreSQL

Update your `.env` file with your PostgreSQL credentials:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/luar_sekolah_lms"
```

Then run migrations:

```bash
bun run db:push
```

### 3. Environment Configuration

Copy the environment file and update the values:

```bash
cp .env.example .env
```

Key environment variables:

```env
# Database
DATABASE_URL="postgresql://luar_sekolah:luar123456@localhost:5432/luar_sekolah_lms"

# Auth
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="http://localhost:3000"

# OAuth (Optional)
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

### 4. Start Development Server

```bash
bun run dev
```

Visit `http://localhost:3000` to see the application.

## 📚 Available Scripts

```bash
# Development
bun run dev              # Start development server
bun run db:start         # Start PostgreSQL with Docker
bun run db:stop          # Stop PostgreSQL container
bun run db:studio        # Open Drizzle Studio

# Database
bun run db:push          # Push schema changes
bun run db:generate      # Generate migrations
bun run db:migrate       # Run migrations
bun run db:down          # Stop and remove database

# Building
bun run build            # Build for production
bun run preview          # Preview production build

# Code Quality
bun run lint             # Lint code
bun run format           # Format code
bun run check            # Check and auto-fix issues
bun run check-types      # Type checking

# Testing
bun run test             # Run tests

# Internationalization
bun run lingui:extract   # Extract translatable strings
bun run lingui:compile   # Compile translations
```

## 🌍 Internationalization

This project supports Indonesian and English languages.

### Adding Translations

1. Use translatable strings in components:
   ```tsx
   import { Trans } from '@lingui/react/macro';

   <Trans>Selamat datang di Luar Sekolah LMS</Trans>
   ```

2. Extract new strings:
   ```bash
   bun run lingui:extract
   ```

3. Add translations in `src/locales/id/messages.po`

4. Compile translations:
   ```bash
   bun run lingui:compile
   ```

## 🎨 UI Components

Add new components using Shadcn:

```bash
bun run ui button
bun run ui card
bun run ui input
```

## 🔐 Authentication

The app uses Better Auth for authentication. Supported providers:

- Email/Password
- GitHub OAuth
- Google OAuth

Configure OAuth providers in your `.env` file.

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── lib/                # Utilities and configurations
│   ├── db/            # Database schema and client
│   └── auth/          # Authentication configuration
├── locales/           # Translation files
├── routes/            # File-based routing
└── app/              # Main app components
```

## 🚀 Deployment

### Cloudflare Workers

1. Build the application:
   ```bash
   bun run build
   ```

2. Deploy to Cloudflare:
   ```bash
   bun run deploy
   ```

### Other Platforms

The application can be deployed to any platform that supports Node.js applications.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the documentation
- Join our community discussions

---

**Luar Sekolah LMS** - Membangun masa depan pendidikan Indonesia 🇮🇩
