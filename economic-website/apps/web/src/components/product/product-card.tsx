'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import type { Product } from '@/lib/products';
import { useAuthStore } from '@/store/auth-store';
import { useCartStore } from '@/store/cart-store';

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();
  const addRemoteItem = useMutation({
    mutationFn: () => api.addCartItem(product.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] })
  });
  const price = product.salePrice ?? product.price;

  const handleAdd = () => {
    if (token) addRemoteItem.mutate();
    else addItem(product);
  };

  return (
    <Card className="group overflow-hidden">
      <Link href={`/products/${product.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-slate-100">
        <Image src={product.image} alt={product.name} fill className="object-cover transition duration-500 group-hover:scale-105" />
        {product.badge && <span className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-bold text-white">{product.badge}</span>}
      </Link>
      <div className="space-y-3 p-4">
        <div>
          <p className="text-xs font-semibold text-muted">{product.category}</p>
          <Link href={`/products/${product.slug}`} className="mt-1 line-clamp-2 min-h-10 font-bold hover:text-primary">
            {product.name}
          </Link>
        </div>
        <div className="flex items-center gap-1 text-sm text-warning">
          <Star className="h-4 w-4 fill-warning" /> {product.rating}
          <span className="text-muted">({product.stock} còn hàng)</span>
        </div>
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-lg font-black text-primary">{formatCurrency(price)}</p>
            {product.salePrice && <p className="text-xs text-muted line-through">{formatCurrency(product.price)}</p>}
          </div>
          <Button variant="accent" className="px-3" onClick={handleAdd} disabled={addRemoteItem.isPending}>
            Them
          </Button>
        </div>
      </div>
    </Card>
  );
}
