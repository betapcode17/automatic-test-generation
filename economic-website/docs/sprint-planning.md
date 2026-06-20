# Sprint Planning

## Sprint 1: Foundation

- Initialize monorepo, Docker Compose, Nginx, environment strategy
- Create Prisma schema and database migrations
- Build NestJS module structure and Swagger setup
- Build Next.js theme, layout, navigation, product fixtures

## Sprint 2: Commerce MVP

- Implement auth APIs and frontend login/register forms
- Implement product listing, search, filtering, detail pages
- Implement cart state and cart API integration
- Implement checkout and order history

## Sprint 3: Admin MVP

- Add RBAC roles and admin guards
- Build admin dashboard metrics
- Build product/category/order/user management APIs
- Build admin product and order management screens

## Sprint 4: Production Hardening

- Replace fixture data with React Query API calls
- Add refresh tokens or httpOnly cookie session strategy
- Add seed data, upload pipeline, and image storage
- Add unit, integration, and Playwright smoke tests
- Add CI/CD, observability, backups, and rate limiting

## MVP Acceptance Criteria

- Customers can register, login, browse products, add cart items, checkout, and view order history.
- Admins can access dashboard and manage products, categories, orders, and users.
- API is documented in Swagger.
- App can run locally with Docker Compose.
