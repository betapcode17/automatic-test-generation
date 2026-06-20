'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { Search, ShoppingCart, UserRound } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { useAuthStore } from '@/store/auth-store';

const nav = [
  { href: '/products', label: 'Sản phẩm' },
  { href: '/orders', label: 'Đơn hàng' },
  { href: '/admin', label: 'Admin' }
];

export function Header() {
  const count = useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));
  const { user, hydrate, logout } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-white/80 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center gap-4">
        <Link href="/" className="text-xl font-black text-primary">
          Economic
        </Link>
        <div className="hidden flex-1 items-center rounded-2xl border border-border bg-white px-3 md:flex">
          <Search className="h-4 w-4 text-muted" />
          <input className="h-10 flex-1 bg-transparent px-3 text-sm outline-none" placeholder="Tìm kiếm sản phẩm, thương hiệu..." />
        </div>
        <nav className="ml-auto hidden items-center gap-5 text-sm font-semibold text-slate-600 md:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-primary">
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href="/cart" className="relative rounded-xl border border-border bg-white p-2 hover:border-primary">
          <ShoppingCart className="h-5 w-5" />
          {count > 0 && <span className="absolute -right-2 -top-2 rounded-full bg-accent px-1.5 text-xs font-bold text-white">{count}</span>}
        </Link>
        {user ? (
          <button onClick={logout} className="hidden rounded-xl border border-border bg-white px-3 py-2 text-sm font-bold hover:border-primary md:block">
            Dang xuat
          </button>
        ) : (
          <Link href="/login" className="hidden rounded-xl border border-border bg-white px-3 py-2 text-sm font-bold hover:border-primary md:block">
            Dang nhap
          </Link>
        )}
        <Link href="/profile" className="rounded-xl border border-border bg-white p-2 hover:border-primary">
          <UserRound className="h-5 w-5" />
        </Link>
      </div>
    </header>
  );
}
