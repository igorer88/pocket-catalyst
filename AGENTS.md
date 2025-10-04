# Pocket Catalyst

This document provides a comprehensive overview of the Pocket Catalyst project, intended to be used as a quick-start guide and instructional context for developers.

## Project Overview

Pocket Catalyst is a finance management application with a web interface. The project is a monorepo managed with pnpm workspaces, containing a NestJS backend and a React frontend.

### Key Technologies

- **Backend:**
  - Framework: NestJS
  - Language: TypeScript
  - Package Manager: pnpm
- **Frontend:**
  - Framework: React 19
  - Language: TypeScript 5
  - Build Tool: Vite 7
  - Styling: Tailwind CSS 4
  - UI Components: HeroUI, Heroicons
  - Routing: React Router 7
  - Internationalization: react-i18next 16
  - State Management: Zustand 5

### Architecture

The project is structured as a monorepo with two main packages:

- **`web/`**: The React frontend application.
- **`src/`**: The NestJS backend application.

The frontend follows a standard React application architecture:

- **`src/`**: The main directory containing all the application's source code.
- **`src/main.tsx`**: The entry point of the application.
- **`src/App.tsx`**: The root component of the application.
- **`src/components/`**: Contains reusable UI components.
- **`src/pages/`**: Contains the main pages of the application.
- **`src/router/`**: Defines the application's routes.
- **`src/stores/`**: Contains the Zustand state management stores.
- **`src/hooks/`**: Contains custom React hooks.
- **`src/layouts/`**: Contains different page layouts.
- **`src/config/`**: Contains application configuration, linter configurations, extra scripts, and database files (including Docker container initialization)
- **`src/i18n.ts`**: Configuration for react-i18next internationalization
- **`src/locales/`**: Contains translation files (en.json, es.json).

## Building and Running

### Prerequisites

- Node.js (v22 or higher)
- pnpm (v10 or higher)

### Development

To start the development servers for both the client and server, run the following command from the root directory:

```bash
pnpm run dev
```

This will start the NestJS backend in watch mode and the Vite development server for the React frontend.

### Building for Production

To build the application for production, run the following command from the root directory:

```bash
pnpm run build
```

This will create a `dist` directory in both the `web` and root directories with the optimized and minified production builds.

### Previewing the Production Build

To preview the production build locally, run the following command:

```bash
pnpm run preview
```

## Development Conventions

### Coding Style

The project uses the standard TypeScript, NestJS and React coding styles, enforced by ESLint and Prettier. It is recommended to use an IDE with ESLint and Prettier integration to ensure code quality and consistency.

#### Naming Conventions

**IMPORTANT**: Follow these naming conventions consistently throughout the codebase:

- **Variables and Object Properties**: Use `camelCase` for all JavaScript/TypeScript variables, object properties, and function names
- **Types and Interfaces**: Use `PascalCase` for TypeScript interfaces, types, and classes
- **Database Table Names**: Use `PascalCase` for database table names (e.g., `UserProfiles`, `TransactionCategories`)
- **Database Fields**: Use `snake_case` only for database field names (handled by ORM mapping)
- **Constants**: Use `UPPER_SNAKE_CASE` for module-level constants

**Examples:**

```typescript
// ✅ Correct: camelCase for variables and properties
interface ApiUser {
  firstName: string // camelCase property
  displayCurrency: string
  accountBalance: number
  createdAt: string
}

const userProfile = {
  userId: 123,
  firstName: 'John',
  lastLoginDate: new Date()
}

// ❌ Incorrect: snake_case in frontend code
const user_profile = {
  user_id: 123,
  first_name: 'John',
  last_login_date: new Date()
}

// ✅ Correct: Database conventions
// Table names: PascalCase
// Field names: snake_case (converted to camelCase by ORM)
/*
  Table: UserProfiles
  Fields: user_id, first_name, created_at

  TypeScript interface uses camelCase:
  interface UserProfile {
    userId: number
    firstName: string
    createdAt: string
  }
*/
```

**Database Field Mapping:**

The ORM handles the conversion between `snake_case` database fields and `camelCase` TypeScript properties. Always use camelCase in your TypeScript code, even when the underlying database field uses snake_case.

### Lint and Formatting Guidelines

**IMPORTANT**: Always run lint and formatting commands after making code changes to maintain code quality and consistency.

#### Required Commands After Code Changes

1. **Lint Check**: Always run linting to identify and fix code issues

   ```bash
   pnpm run lint
   ```

2. **Format Code**: Always run formatting to ensure consistent code style

   ```bash
   pnpm run format
   ```

3. **Fix Lint Issues**: Address all ESLint warnings and errors before committing:
   - **Missing return types**: Add explicit return types to functions
   - **Import sorting**: Use simple-import-sort for consistent imports
   - **React rules**: Follow React hooks and component best practices
   - **TypeScript rules**: Address type safety warnings

#### Common Lint Issues and Solutions

**Missing Function Return Types:**

```typescript
// ❌ Warning: Missing return type
function myFunction() {
  return 'hello'
}

// ✅ Fixed: Explicit return type
function myFunction(): string {
  return 'hello'
}
```

**React Component Return Types:**

```typescript
// ❌ Warning: Missing return type
export default function MyComponent() {
  return <div>Hello</div>
}

// ✅ Fixed: JSX.Element return type
export default function MyComponent(): JSX.Element {
  return <div>Hello</div>
}
```

**Import Organization:**

```typescript
// ❌ Inconsistent imports
import { useState } from 'react'
import axios from 'axios'
import { Button } from '@heroui/react'
import { MyComponent } from './components'

// ✅ Organized imports (simple-import-sort)
import axios from 'axios'
import { useState } from 'react'

import { Button } from '@heroui/react'

import { MyComponent } from './components'
```

#### Pre-Commit Workflow

Always execute this sequence before committing:

```bash
# 1. Run linting and fix issues
pnpm run lint

# 2. Format code
pnpm run format

# 3. Build to ensure no compilation errors
pnpm run build

# 4. Commit changes
git add .
git commit -m "type: description"
```

### Commits

Commit messages should follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.

### Internationalization (i18n)

The project uses `react-i18next` for internationalization (i18n). All user-facing strings must be managed through localization files to support multiple languages.

#### Configuration

The i18n system is configured in `web/src/i18n.ts` and automatically:

- Detects the browser's language preference
- Falls back to English if the detected language isn't supported
- Supports nested JSON structures natively

#### Workflow for Adding New Text

1. **Add New Keys to `en.json`**: All new user-facing text must be added to `web/src/locales/en.json`. Follow the existing nested key structure (e.g., `pages.home.title`, `navigation.overview`).

2. **Translate to Spanish**: After adding keys to `en.json`, you must provide the corresponding Spanish translations in `web/src/locales/es.json`.

3. **Implement in Components**: Use the `useTranslation` hook and `t()` function from `react-i18next` to display text in the UI. **Do not use hardcoded strings.**

#### Usage Examples

```typescript
import { useTranslation } from 'react-i18next'

function MyComponent(): JSX.Element {
  const { t } = useTranslation()

  return (
    <div>
      <h1>{t('pages.home.title')}</h1>
      <p>{t('pages.home.description')}</p>
      <button>{t('common.buttons.save')}</button>
    </div>
  )
}
```

#### Navigation Translation

Navigation links are handled through the `getNavigationLinks(t)` function in `web/src/router/NavigationLinks.ts`:

```typescript
export const getNavigationLinks = (t: TFunction): NavigationLink[] => [
  {
    name: t('navigation.overview'),
    href: '/dashboard'
    // ... other properties
  }
]
```

**Important Notes:**

- **URLs remain in English** (e.g., `/dashboard/transactions`) - only display names are translated
- **Route paths are not translated** to maintain consistency and SEO optimization
- **All user-facing text** must go through the translation system

#### Verification

Before committing any changes involving UI text, ensure that:

- No hardcoded user-facing strings exist in the components
- Both `en.json` and `es.json` are up-to-date with the new keys and translations
- All translation keys follow the nested structure pattern
- The application displays translations correctly in both languages

This process ensures a consistent and translatable user experience across the application.

## API Documentation (Swagger)

The backend includes automatic API documentation using Swagger/OpenAPI.

### Accessing Swagger Documentation

When the backend server is running, Swagger documentation is available at:

- **Swagger UI**: http://localhost:3000/docs
- **OpenAPI JSON**: http://localhost:3000/docs-json

### Swagger Configuration

The Swagger setup is configured in `src/setup.ts`:

- Automatically generates documentation from decorators
- Uses package.json metadata for API info
- Available in all environments for development and testing

### Adding API Documentation

Use NestJS/Swagger decorators in your controllers:

```typescript
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'

@ApiTags('users')
@Controller('users')
export class UsersController {
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully'
  })
  @Get('profile')
  getProfile(): Promise<UserProfile> {
    // Implementation
  }
}
```

## HeroUI + TailwindCSS 4 Configuration

### ⚠️ Critical HeroUI Setup Requirements

This project uses HeroUI with TailwindCSS 4, which requires specific configuration to generate utility classes properly. **If HeroUI classes like `bg-primary` are not working, follow this exact configuration:**

#### Required Package Versions

```json
{
  "dependencies": {
    "@heroui/react": "2.8.4",
    "@heroui/theme": "2.4.22",
    "react": "19.1.1",
    "react-dom": "19.1.1"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.1.13",
    "tailwindcss": "4.1.5",
    "vite": "^7.1.7",
    "typescript": "~5.7.2"
  }
}
```

#### tailwind.config.js - Optimized Configuration

```javascript
import { heroui } from '@heroui/react'

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    // Only @heroui/theme is needed - contains all CSS classes
    './node_modules/@heroui/theme/dist/**/*.{js,mjs,ts,jsx,tsx}'
  ],
  theme: {
    extend: {}
  },
  darkMode: 'class',
  plugins: [
    heroui({
      // Your theme configuration
    })
  ]
}
```

#### src/index.css - Optimized Sources

```css
@config "../tailwind.config.js";
@import 'tailwindcss';
@source "../node_modules/@heroui/theme/**/*.{js,mjs,ts,jsx,tsx}";

/* Your custom CSS here */
```

#### Verification Commands

After setup, verify HeroUI is working:

```bash
# Build and check CSS file size (should be 200KB+)
pnpm run build
wc -c dist/assets/index-*.css

# Count classes (should be 600+)
grep -o '\.[a-zA-Z][a-zA-Z0-9_-]*{' dist/assets/index-*.css | wc -l

# Verify HeroUI classes are generated
grep -o -E '\.bg-primary\{[^}]*\}' dist/assets/index-*.css
```

**Success indicators:**

- CSS file size: ~235KB (vs ~36KB when broken)
- Class count: ~623+ classes (vs ~175 when broken)
- HeroUI classes like `.bg-primary{background-color:hsl(var(--heroui-primary)/1)}` are present

## Docker Configuration

### Building and Testing Docker Images

The project includes a multi-stage Dockerfile optimized for both development and production environments:

#### Development Image

```bash
# Build development image
docker build --target dev -t pocket-catalyst:dev .

# Run development container
docker run -p 3000:3000 pocket-catalyst:dev
```

#### Production Image

```bash
# Build production image
docker build --target prod -t pocket-catalyst:prod .

# Run production container
docker run -p 3000:3000 pocket-catalyst:prod
```

#### Docker Compose

```bash
# Start all services (app + database)
docker-compose up

# Build and start with specific target
BUILD_STAGE=dev docker-compose up --build
BUILD_STAGE=prod docker-compose up --build
```

#### Verification Commands

After building, verify Docker images work correctly:

```bash
# Verify images are created
docker images pocket-catalyst

# Test development image
docker build --target dev -t pocket-catalyst:dev .
docker run --rm --entrypoint="" pocket-catalyst:dev pnpm --version

# Test production image
docker build --target prod -t pocket-catalyst:prod .
docker run --rm --entrypoint="" pocket-catalyst:prod ls -la /app/dist/

# Verify build artifacts are present
docker run --rm --entrypoint="" pocket-catalyst:prod find /app/dist -name "*.js" -o -name "*.css" | head -5
```

**Success indicators:**

- ✅ **Development image**: Builds successfully (~688MB)
- ✅ **Production image**: Builds successfully (~691MB)
- ✅ **Build artifacts**: `/app/dist/` contains compiled server and client files
- ✅ **Dependencies**: Only production dependencies in final image
- ✅ **Security**: Runs as non-root user (system:system)
- ✅ **Docker Compose**: Configuration validates successfully

### Configuration Notes

**Important:** The configuration above is optimized and removes redundant paths:

- ✅ **`@heroui/theme`** contains ALL CSS classes and is the only path needed
- ❌ **`@heroui/react`** only contains React components, not CSS classes
- ❌ **Wildcard paths** like `@heroui/*/dist/**` are redundant when `@heroui/theme` is specified

**Key Dependencies:**

- `@heroui/react`: Provides React components and plugin functionality
- `@heroui/theme`: Contains all CSS class definitions (required for styling)

Both packages must be installed for HeroUI to work properly.
