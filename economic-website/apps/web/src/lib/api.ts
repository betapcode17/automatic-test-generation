import type { Product } from './products';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  role: 'CUSTOMER' | 'ADMIN' | 'MANAGER';
};

export type AuthResponse = {
  accessToken: string;
  user: AuthUser;
};

type ApiCategory = {
  id: string;
  name: string;
  slug: string;
};

type ApiProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: string | number;
  salePrice?: string | number | null;
  stock: number;
  rating: number;
  isFeatured?: boolean;
  category?: ApiCategory;
  images?: { url: string; alt?: string | null }[];
};

export type ApiCart = {
  id: string;
  items: {
    id: string;
    quantity: number;
    product: ApiProduct;
  }[];
};

export type ApiOrder = {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: string | number;
  createdAt: string;
  shippingName?: string;
  shippingPhone?: string;
  shippingAddr?: string;
  items?: {
    id: string;
    quantity: number;
    unitPrice: string | number;
    product: ApiProduct;
  }[];
};

export type AdminDashboard = {
  users: number;
  products: number;
  orders: number;
  revenue: string | number;
};

function getToken() {
  if (typeof window === 'undefined') return undefined;
  return localStorage.getItem('economic_token') ?? undefined;
}

export async function apiFetch<T>(path: string, options: RequestInit = {}) {
  const token = getToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(Array.isArray(payload.message) ? payload.message.join(', ') : payload.message ?? `Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function mapProduct(product: ApiProduct): Product {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    category: product.category?.name ?? 'San pham',
    categorySlug: product.category?.slug,
    price: Number(product.price),
    salePrice: product.salePrice == null ? undefined : Number(product.salePrice),
    rating: product.rating,
    stock: product.stock,
    image: product.images?.[0]?.url ?? 'https://placehold.co/900x675/e2e8f0/0f172a?text=Economic',
    badge: product.isFeatured ? 'Featured' : undefined,
    description: product.description
  };
}

export const api = {
  login: (body: { email: string; password: string }) =>
    apiFetch<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  register: (body: { fullName: string; email: string; password: string }) =>
    apiFetch<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  me: () => apiFetch<AuthUser & { phone?: string; address?: string; avatarUrl?: string }>('/users/me'),
  updateMe: (body: { fullName?: string; phone?: string; address?: string; avatarUrl?: string }) =>
    apiFetch('/users/me', { method: 'PATCH', body: JSON.stringify(body) }),
  products: async (query?: { q?: string; category?: string }) => {
    const params = new URLSearchParams();
    if (query?.q) params.set('q', query.q);
    if (query?.category && query.category !== 'all') params.set('category', query.category);
    const data = await apiFetch<ApiProduct[]>(`/products${params.size ? `?${params.toString()}` : ''}`);
    return data.map(mapProduct);
  },
  product: async (slug: string) => mapProduct(await apiFetch<ApiProduct>(`/products/${slug}`)),
  categories: () => apiFetch<(ApiCategory & { _count?: { products: number } })[]>('/categories'),
  cart: () => apiFetch<ApiCart>('/cart'),
  addCartItem: (productId: string, quantity = 1) =>
    apiFetch('/cart/items', { method: 'POST', body: JSON.stringify({ productId, quantity }) }),
  updateCartItem: (itemId: string, quantity: number) =>
    apiFetch(`/cart/items/${itemId}`, { method: 'PATCH', body: JSON.stringify({ quantity }) }),
  removeCartItem: (itemId: string) => apiFetch(`/cart/items/${itemId}`, { method: 'DELETE' }),
  checkout: (body: {
    paymentMethod: string;
    shippingName: string;
    shippingPhone: string;
    shippingEmail: string;
    shippingAddr: string;
    note?: string;
  }) => apiFetch('/orders/checkout', { method: 'POST', body: JSON.stringify(body) }),
  orders: () => apiFetch<ApiOrder[]>('/orders'),
  order: (id: string) => apiFetch<ApiOrder>(`/orders/${id}`),
  adminDashboard: () => apiFetch<AdminDashboard>('/admin/dashboard'),
  adminOrders: () => apiFetch<ApiOrder[]>('/admin/orders')
};
