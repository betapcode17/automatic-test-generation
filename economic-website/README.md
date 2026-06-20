# Economic Website

Modern e-commerce MVP built as a production-ready monorepo.

## Stack

- Frontend: Next.js 15, TypeScript, Tailwind CSS, shadcn/ui-style components, React Query, Zustand, React Hook Form, Zod
- Backend: NestJS, PostgreSQL, Prisma ORM, JWT Auth, Swagger
- Infrastructure: Docker, Docker Compose, Nginx

## Quick Start

```bash
cp .env.example .env
npm install
npm run db:generate
npm --workspace apps/api run prisma:seed
npm run dev
```

Web: http://localhost:3000

API: http://localhost:4000/api

Swagger: http://localhost:4000/docs

PostgreSQL Docker from host: `localhost:55432`

Default admin:

- Email: `admin@economic.local`
- Password: `Admin123!`

## Docker

```bash
cp .env.example .env
docker compose up --build
```

Open http://localhost through Nginx.

## Documentation

- [System Architecture](docs/system-architecture.md)
- [Database Design](docs/database-design.md)
- [API Specification](docs/api-specification.md)
- [Folder Structure](docs/folder-structure.md)
- [UI/UX Design](docs/ui-ux-design.md)
- [Sprint Planning](docs/sprint-planning.md)
- [Deployment Guide](docs/deployment-guide.md)
