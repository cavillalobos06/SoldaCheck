# SoldaCheck

Welding-machine inspection platform. Technicians log daily safety checks and
machine status; administrators manage the machine catalog, inspections and users.

## Features

- Machine inventory with live search and status filters (operational / for review / maintenance)
- Daily inspection checklist per machine (cables, gas, torch, ventilation)
- JWT authentication with `admin` and `user` (technician) roles
- Admin panel: CRUD for machines, inspections and users
- Optimistic UI updates with backend sync and graceful offline fallback

## Tech Stack

**Frontend**
- React 19 + TanStack Start / Router / Query
- Vite 8, TypeScript
- Tailwind CSS 4 + shadcn/ui (Radix UI primitives)
- lucide-react icons, zod validation
- ESLint + Prettier, Vitest

**Backend**
- NestJS 12 + TypeORM
- PostgreSQL 16
- Passport JWT + bcryptjs
- oxlint + Prettier, Vitest

**Tooling / Infrastructure**
- Docker & Docker Compose
- npm workspaces (root = frontend, `backend/` = API)

## Project Structure

```
.
├── src/                    # Frontend (TanStack Start app)
│   ├── components/         # UI components (AppHeader, machine-ui, ui/*)
│   ├── lib/                # api.ts, auth-context.tsx, machines.ts, utils
│   └── routes/             # File-based routes (/, /login, /admin, /maquinas/$id)
├── backend/                # NestJS API
│   ├── src/
│   │   ├── auth/           # JWT auth, guards, strategies
│   │   ├── users/          # User entity + CRUD
│   │   └── machines/       # Machine + Inspection entities + CRUD
│   ├── Dockerfile
│   └── package.json
├── Dockerfile              # Frontend dev image
├── docker-compose.yml      # Postgres + backend + frontend
└── .env.example            # Environment template
```

## Prerequisites

- **Node.js 22+** and **npm 10+**
- **Docker** and **Docker Compose** (for the containerized setup)
- **PostgreSQL 16** (only if running the backend locally without Docker)

## Quick Start (Docker)

The fastest way to run the whole stack (database + API + frontend):

```sh
cp .env.example .env
docker compose up --build
```

Once ready:

| Service   | URL                     |
| --------- | ----------------------- |
| Frontend  | http://localhost:5173   |
| API       | http://localhost:3000   |
| Postgres  | localhost:5432          |

Stop the stack with `docker compose down` (add `-v` to also wipe the database volume).

## Local Setup (without Docker)

**1. Start PostgreSQL** and create the database (defaults: db `pixel_perfect_db`, user `postgres`).

**2. Backend**

```sh
cd backend
cp ../.env.example .env      # then set DB_HOST=localhost
npm install
npm run start:dev
```

The API runs on http://localhost:3000.

**3. Frontend** (from the repository root)

```sh
npm install
npm run dev
```

The frontend runs on http://localhost:5173 and talks to the API via `VITE_API_URL`.

## Environment Variables

Copy `.env.example` to `.env` and adjust as needed:

| Variable          | Default                          | Description                          |
| ----------------- | -------------------------------- | ------------------------------------ |
| `POSTGRES_DB`     | `pixel_perfect_db`               | Database name                        |
| `POSTGRES_USER`   | `postgres`                       | Database user                        |
| `POSTGRES_PASSWORD` | `postgres_secure_pass_2026`    | Database password                    |
| `POSTGRES_PORT`   | `5432`                           | Host port for Postgres               |
| `BACKEND_PORT`    | `3000`                           | Host port for the API                |
| `NODE_ENV`        | `development`                    | Node environment                     |
| `DB_HOST`         | `db` (`localhost` when local)    | Database host                        |
| `DB_PORT`         | `5432`                           | Database port                        |
| `DB_USER`         | `postgres`                       | Database user (backend)              |
| `DB_PASSWORD`     | `postgres_secure_pass_2026`      | Database password (backend)          |
| `DB_NAME`         | `pixel_perfect_db`               | Database name (backend)              |
| `DB_LOGGING`      | `false`                          | Enable TypeORM query logging         |
| `FRONTEND_PORT`   | `5173`                           | Host port for the frontend           |
| `VITE_API_URL`    | `http://localhost:3000`          | API base URL used by the frontend    |

The backend also accepts an optional `JWT_SECRET` (falls back to a development
value) — set a strong secret in production.

## Default Credentials

On first boot the backend seeds two users and a demo machine catalog:

| Role       | Email                | Password       |
| ---------- | -------------------- | -------------- |
| Admin      | `admin@example.com`  | `Password123!` |
| Technician | `user@example.com`   | `Password123!` |

> Change these credentials and the seeded data before any production deployment.

## API Endpoints

Base URL: `http://localhost:3000`

**Auth**

| Method | Path          | Description                    |
| ------ | ------------- | ------------------------------ |
| `POST` | `/auth/login` | Obtain a JWT token             |
| `GET`  | `/auth/me`    | Current user profile (bearer)  |

**Machines**

| Method   | Path                       | Description                    |
| -------- | -------------------------- | ------------------------------ |
| `GET`    | `/machines`                | List machines (`?status=`)     |
| `GET`    | `/machines/:id`            | Machine detail                 |
| `POST`   | `/machines`                | Create machine                 |
| `PATCH`  | `/machines/:id`            | Update machine                 |
| `DELETE` | `/machines/:id`            | Delete machine                 |
| `GET`    | `/machines/:id/inspections`| List inspections for a machine |
| `POST`   | `/machines/:id/inspections`| Register an inspection         |

**Users**

| Method   | Path          | Description      |
| -------- | ------------- | ---------------- |
| `GET`    | `/users`      | List users       |
| `GET`    | `/users/:id`  | User detail      |
| `POST`   | `/users`      | Create user      |
| `PATCH`  | `/users/:id`  | Update user      |
| `DELETE` | `/users/:id`  | Delete user      |

## Available Scripts

**Frontend** (repository root)

| Command             | Description               |
| ------------------- | ------------------------- |
| `npm run dev`       | Start Vite dev server     |
| `npm run build`     | Production build          |
| `npm run preview`   | Preview the build         |
| `npm run lint`      | Run ESLint                |
| `npm run format`    | Format with Prettier      |
| `npm run test`      | Run Vitest                |

**Backend** (`backend/`)

| Command              | Description               |
| -------------------- | ------------------------- |
| `npm run start:dev`  | Start in watch mode       |
| `npm run build`      | Compile with Nest         |
| `npm run start:prod` | Run the compiled server   |
| `npm run lint`       | Run oxlint                |
| `npm run test`       | Run unit tests            |
| `npm run test:e2e`   | Run end-to-end tests      |

## Testing & Linting

```sh
# Frontend
npm run lint
npm run test

# Backend
cd backend
npm run lint
npm run test
```

## Production Notes

- TypeORM `synchronize` is enabled outside production and disabled when `NODE_ENV=production`; use migrations for schema changes there.
- CORS is currently open (`origin: '*'`) — restrict allowed origins for production.
- Always set a strong `JWT_SECRET` and replace the seeded credentials.

## Built with Lovable

This project is connected to [Lovable](https://lovable.dev). Changes pushed to
`main` sync back into the [Lovable editor](https://lovable.dev/projects/82d5dd94-b2c2-4376-ac7c-41f7835a37e0).
