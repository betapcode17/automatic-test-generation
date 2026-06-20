'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { api, mapProduct } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { useAuthStore } from '@/store/auth-store';
import { useCartStore } from '@/store/cart-store';

export default function CartPage() {
  const { items, updateQuantity, removeItem } = useCartStore();
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();
  const remoteCart = useQuery({ queryKey: ['cart'], queryFn: api.cart, enabled: Boolean(token) });
  const updateRemote = useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) => api.updateCartItem(id, quantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] })
  });
  const removeRemote = useMutation({
    mutationFn: api.removeCartItem,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] })
  });
  const displayItems = token
    ? remoteCart.data?.items.map((item) => ({ cartItemId: item.id, ...mapProduct(item.product), quantity: item.quantity })) ?? []
    : items;
  const subtotal = displayItems.reduce((sum, item) => sum + (item.salePrice ?? item.price) * item.quantity, 0);

  return (
    <main className="container-page grid gap-6 py-8 lg:grid-cols-[1fr_360px]">
      <section>
        <h1 className="mb-6 text-3xl font-black">Giỏ hàng</h1>
        <div className="space-y-4">
          {displayItems.map((item) => (
            <Card key={item.id} className="flex gap-4 p-4">
              <div className="relative h-24 w-24 overflow-hidden rounded-xl bg-slate-100">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <h2 className="font-bold">{item.name}</h2>
                  <p className="text-sm text-muted">{formatCurrency(item.salePrice ?? item.price)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    className="h-10 w-20 rounded-xl border border-border px-3"
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(event) => {
                      const quantity = Number(event.target.value);
                      if (token && 'cartItemId' in item) updateRemote.mutate({ id: item.cartItemId, quantity });
                      else updateQuantity(item.id, quantity);
                    }}
                  />
                  <button className="rounded-xl border border-border p-2 text-danger" onClick={() => {
                    if (token && 'cartItemId' in item) removeRemote.mutate(item.cartItemId);
                    else removeItem(item.id);
                  }}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
          {remoteCart.isLoading && <Card className="p-8 text-center text-muted">Dang tai gio hang...</Card>}
          {!displayItems.length && !remoteCart.isLoading && <Card className="p-8 text-center text-muted">Giỏ hàng đang trống.</Card>}
        </div>
      </section>
      <Card className="h-fit p-5">
        <h2 className="text-xl font-black">Tóm tắt đơn hàng</h2>
        <div className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between"><span>Tạm tính</span><b>{formatCurrency(subtotal)}</b></div>
          <div className="flex justify-between"><span>Vận chuyển</span><b>{subtotal > 500000 ? 'Miễn phí' : formatCurrency(30000)}</b></div>
          <div className="border-t border-border pt-3 text-lg font-black flex justify-between"><span>Tổng</span><span>{formatCurrency(subtotal ? subtotal + (subtotal > 500000 ? 0 : 30000) : 0)}</span></div>
        </div>
        <Link href={token ? '/checkout' : '/login'}>
          <Button className="mt-5 w-full" disabled={!displayItems.length}>{token ? 'Checkout' : 'Dang nhap de checkout'}</Button>
        </Link>
      </Card>
    </main>
  );
}
