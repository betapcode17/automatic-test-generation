'use client';

import { create } from 'zustand';
import type { Product } from '@/lib/products';

type CartItem = Product & { quantity: number };

type CartStore = {
  items: CartItem[];
  addItem: (product: Product) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
};

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  addItem: (product) =>
    set((state) => {
      const exists = state.items.find((item) => item.id === product.id);
      if (exists) {
        return { items: state.items.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)) };
      }
      return { items: [...state.items, { ...product, quantity: 1 }] };
    }),
  updateQuantity: (id, quantity) =>
    set((state) => ({ items: state.items.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item)) })),
  removeItem: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
  clear: () => set({ items: [] })
}));
