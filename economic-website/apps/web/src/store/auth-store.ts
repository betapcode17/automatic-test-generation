'use client';

import { create } from 'zustand';
import type { AuthUser } from '@/lib/api';

type AuthStore = {
  token?: string;
  user?: AuthUser;
  hydrate: () => void;
  setSession: (token: string, user: AuthUser) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  hydrate: () => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('economic_token') ?? undefined;
    const userRaw = localStorage.getItem('economic_user');
    set({ token, user: userRaw ? JSON.parse(userRaw) : undefined });
  },
  setSession: (token, user) => {
    localStorage.setItem('economic_token', token);
    localStorage.setItem('economic_user', JSON.stringify(user));
    set({ token, user });
  },
  logout: () => {
    localStorage.removeItem('economic_token');
    localStorage.removeItem('economic_user');
    set({ token: undefined, user: undefined });
  }
}));
