# Pocket Catalyst

Pocket Catalyst is a web-based application for managing personal finances. It features a React frontend and a NestJS backend, organized together in a single repository.

## Key Technologies

- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Backend**: [NestJS](https://nestjs.com/) (Node.js framework)
- **Frontend**: [React 19](https://react.dev/) with [Vite](https://vitejs.dev/)
- **Routing**: [React Router 7](https://reactrouter.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)

## Environment Variables

To configure the application, copy the `.env.example` file to `.env` and fill in the necessary values. Ensure you set a strong secret key for security.

```bash
cp .env.example .env
```

- `NODE_ENV`: Set to `development` for local development or `production` for production builds.
- `BUILD_STAGE`: Use `dev` for development builds or `prod` for production builds, especially when working with Docker Compose.
- `API_SECRET_KEY`: A secret key used for various security purposes (e.g., JWT signing). **Required**.

### Database Configuration

The application supports both PostgreSQL and SQLite databases. You can select the database driver using the `DB_DRIVER` environment variable.

- `DB_DRIVER`: Specifies the database driver to use. Set to `postgres` for PostgreSQL or `sqlite` for SQLite. Defaults to `sqlite`.

#### SQLite Configuration (Default)

When `DB_DRIVER=sqlite`:

- `DB_SQLITE_PATH`: The path to the SQLite database file (e.g., `./db/pc.sqlite3`). Defaults to `./config/db/pc.sqlite3`.

#### PostgreSQL Configuration (Recommended for Production)

When `DB_DRIVER=postgres`:

- `DB_HOST`: The hostname or IP address of the PostgreSQL server.
- `DB_PORT`: The port of the PostgreSQL server (default: `5432`).
- `DB_NAME`: The name of the PostgreSQL database.
- `DB_USER`: The username for connecting to the PostgreSQL database.
- `DB_PASSWORD`: The password for connecting to the PostgreSQL database.

### Frontend Configuration

The frontend uses the following environment variables for configuration:

- `VITE_APP_LOCALE`: Application locale (default: "en-US")
- `VITE_APP_CURRENCY`: Default currency (default: "USD")
- `VITE_API_BASE_URL`: Base URL for API communication including /api path (default: "<http://localhost:3000/api>")

## Production Environment

This project is configured to run with Docker. By default, it uses a **SQLite** database, which is suitable for demos and local testing. For production environments, it is recommended to configure a **PostgreSQL** database.

### Building and Running with Docker

To build and run the production container:

```bash
# Build the production image
docker build --target prod -t pocket-catalyst:prod .

# Run the production container
docker run -p 3000:3000 pocket-catalyst:prod
```

### Building and Running with Docker Compose

You can also use Docker Compose to manage the application and database services together:

```bash
# Build and start with the production target
BUILD_STAGE=prod docker-compose up --build
```

## Development Environment

### Project Structure

The project is a monorepo with two main parts:

- `src/`: Contains the source code for the NestJS backend.
- `web/`: Contains the source code for the React frontend.

### Docker Commands

To build and run the development container:

```bash
# Build the development image
docker build --target dev -t pocket-catalyst:dev .

# Run the development container
docker run -p 3000:3000 pocket-catalyst:dev
```

### Docker Compose for Development

```bash
# Build and start with the development target
BUILD_STAGE=dev docker-compose up --build
```

### Local Development

#### Prerequisites

- Node.js (v22 or higher)
- pnpm (v10 or higher)

#### 1. Installation

First, install the project dependencies using pnpm:

```bash
pnpm install
```

#### 2. Running the Application

To start both the frontend and backend servers for development, run:

```bash
pnpm run dev
```

- The **React frontend** will be available at `http://localhost:5173`.
- The **NestJS backend** will be running at `http://localhost:3000`.

#### Available Commands

- `pnpm run dev`: Starts both frontend and backend in development mode.
- `pnpm run dev:client`: Starts only the frontend in development mode.
- `pnpm run dev:server`: Starts only the backend in development mode.
- `pnpm run build`: Creates a production-ready build for both applications.
- `pnpm run build:client`: Builds the frontend for production.
- `pnpm run build:server`: Builds the backend for production.
- `pnpm run start`: Starts the NestJS backend application.
- `pnpm run start:dev`: Starts the NestJS backend in watch mode.
- `pnpm run start:debug`: Starts the NestJS backend in debug mode with watch.
- `pnpm run start:prod`: Starts the NestJS backend in production mode.
- `pnpm run lint`: Lints the codebase and fixes issues.
- `pnpm run format`: Formats the codebase.
- `pnpm run test`: Runs unit tests.
- `pnpm run test:watch`: Runs unit tests in watch mode.
- `pnpm run test:cov`: Runs unit tests and generates coverage report.
- `pnpm run test:e2e`: Runs end-to-end tests.
- `pnpm run migration:generate`: Generates a new TypeORM migration.
- `pnpm run migration:run`: Runs pending TypeORM migrations.
- `pnpm run migration:revert`: Reverts the last TypeORM migration.

## License

This project is [MIT licensed](./LICENSE).
