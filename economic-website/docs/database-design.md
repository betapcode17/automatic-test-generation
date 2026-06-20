# Database Design

## ERD

```mermaid
erDiagram
  Role ||--o{ User : has
  User ||--o| Cart : owns
  User ||--o{ Order : places
  User ||--o{ Review : writes
  Category ||--o{ Product : contains
  Product ||--o{ ProductImage : has
  Product ||--o{ CartItem : appears_in
  Product ||--o{ OrderItem : appears_in
  Product ||--o{ Review : receives
  Cart ||--o{ CartItem : contains
  Order ||--o{ OrderItem : contains
```

## Main Tables

| Table | Purpose |
| --- | --- |
| `Role` | RBAC role catalog: customer, manager, admin |
| `User` | Account, profile, credentials, role |
| `Category` | Product grouping and storefront filters |
| `Product` | Sellable SKU, price, inventory, search fields |
| `ProductImage` | Product gallery |
| `Cart` | One active cart per user |
| `CartItem` | Product quantity inside cart |
| `Order` | Checkout snapshot, shipping, payment, status |
| `OrderItem` | Purchased product snapshot |
| `Review` | Product rating and feedback |

The full Prisma schema is in `apps/api/prisma/schema.prisma`.
