# Deployment Guide

## Local Docker

```bash
cp .env.example .env
docker compose up --build
```

Services:

- Web: `http://localhost:3000`
- API: `http://localhost:4000/api`
- Swagger: `http://localhost:4000/docs`
- Nginx: `http://localhost`
- PostgreSQL: `localhost:5432`

## Database Migration

```bash
npm install
npm run db:generate
npm run db:migrate
```

For production, use:

```bash
npm --workspace apps/api exec prisma migrate deploy
```

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: strong random secret
- `NEXT_PUBLIC_API_URL`: public API endpoint used by frontend
- `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`: local Docker database values

## Production Checklist

- Use managed PostgreSQL and private networking
- Store secrets in the platform secret manager
- Run Prisma migrations before API rollout
- Enable HTTPS at load balancer or Nginx
- Configure image CDN/object storage
- Add health checks for web and API containers
- Add centralized logs, metrics, and error reporting
