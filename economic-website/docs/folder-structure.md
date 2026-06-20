# Folder Structure

```text
economic-website/
  apps/
    api/
      prisma/
        schema.prisma
      src/
        common/
          decorators/
          guards/
          prisma/
        modules/
          admin/
          auth/
          cart/
          categories/
          orders/
          products/
          users/
    web/
      src/
        app/
          admin/
          cart/
          checkout/
          login/
          orders/
          products/
          profile/
          register/
        components/
          layout/
          product/
          ui/
        lib/
        store/
  docs/
  infra/
    nginx/
```

## Responsibility Boundaries

- `apps/web`: presentation, client state, forms, API consumption
- `apps/api`: domain modules, persistence, auth, REST contracts
- `infra`: local/proxy infrastructure
- `docs`: architecture and delivery documentation
