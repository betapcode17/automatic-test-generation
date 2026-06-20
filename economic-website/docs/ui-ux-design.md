# UI/UX Design

## Visual Direction

- Modern minimalist e-commerce inspired by Amazon, Shopee, Tiki, and Lazada
- Mobile-first responsive layouts
- Premium feel with soft shadows, 12px-20px radius, smooth hover transitions
- Light glassmorphism header with sticky navigation
- Clear product cards optimized for scanning

## Color System

| Token | Hex |
| --- | --- |
| Primary | `#2563EB` |
| Secondary | `#0F172A` |
| Accent | `#F97316` |
| Success | `#22C55E` |
| Warning | `#EAB308` |
| Danger | `#EF4444` |
| Background | `#F8FAFC` |
| Card | `#FFFFFF` |
| Text | `#0F172A` |
| Text Secondary | `#64748B` |
| Border | `#E2E8F0` |

## Key Screens

- Landing: gradient hero, CTA, featured product, trust features, product sections
- Product Listing: search, category filters, product grid
- Product Detail: gallery, rating, stock, pricing, purchase actions
- Cart: quantity update, remove item, order summary
- Checkout: validated shipping/payment form
- Auth: focused login/register forms
- Profile: editable account information
- Orders: history and detail views
- Admin: dashboard metrics, product management, order management

## Interaction Notes

- Cart is optimistic and local via Zustand for MVP speed.
- Forms use React Hook Form + Zod to prepare for backend validation parity.
- React Query provider is installed for replacing fixtures with API calls in Sprint 4.
