# API Specification

Base URL: `/api`

Swagger UI: `/docs`

## Auth APIs

| Method | Path | Description | Auth |
| --- | --- | --- | --- |
| POST | `/auth/register` | Create customer account | Public |
| POST | `/auth/login` | Login and return JWT | Public |
| POST | `/auth/logout` | Client-side logout contract | Public |
| POST | `/auth/forgot-password` | Start reset flow placeholder | Public |

## User APIs

| Method | Path | Description | Auth |
| --- | --- | --- | --- |
| GET | `/users/me` | Current profile | JWT |
| PATCH | `/users/me` | Update profile | JWT |

## Product APIs

| Method | Path | Description | Auth |
| --- | --- | --- | --- |
| GET | `/products` | List/search/filter products | Public |
| GET | `/products/:slug` | Product detail | Public |
| POST | `/products` | Create product | Admin/Manager |
| PATCH | `/products/:id` | Update product | Admin/Manager |
| DELETE | `/products/:id` | Soft delete product | Admin/Manager |

## Category APIs

| Method | Path | Description | Auth |
| --- | --- | --- | --- |
| GET | `/categories` | List categories | Public |
| POST | `/categories` | Create category | Admin/Manager |
| PATCH | `/categories/:id` | Update category | Admin/Manager |
| DELETE | `/categories/:id` | Soft delete category | Admin/Manager |

## Cart APIs

| Method | Path | Description | Auth |
| --- | --- | --- | --- |
| GET | `/cart` | Get current cart | JWT |
| POST | `/cart/items` | Add product to cart | JWT |
| PATCH | `/cart/items/:id` | Update quantity | JWT |
| DELETE | `/cart/items/:id` | Remove item | JWT |

## Order APIs

| Method | Path | Description | Auth |
| --- | --- | --- | --- |
| GET | `/orders` | Current user's orders | JWT |
| GET | `/orders/:id` | Order detail | JWT |
| POST | `/orders/checkout` | Create order from cart | JWT |

## Admin APIs

| Method | Path | Description | Auth |
| --- | --- | --- | --- |
| GET | `/admin/dashboard` | Revenue/order/user/product summary | Admin/Manager |
| GET | `/admin/users` | User management list | Admin/Manager |
| GET | `/admin/orders` | All order management list | Admin/Manager |
