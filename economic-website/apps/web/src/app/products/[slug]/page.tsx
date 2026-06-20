'use client';

import Image from 'next/image';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ShieldCheck, Star, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { useAuthStore } from '@/store/auth-store';
import { useCartStore } from '@/store/cart-store';

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const addItem = useCartStore((state) => state.addItem);
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();
  const { data: product, isLoading, error } = useQuery({ queryKey: ['product', params.slug], queryFn: () => api.product(params.slug) });
  const addRemoteItem = useMutation({
    mutationFn: () => api.addCartItem(product!.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] })
  });
  if (isLoading) return <main className="container-page py-8"><Card className="p-8 text-center text-muted">Dang tai chi tiet san pham...</Card></main>;
  if (error) notFound();
  if (!product) notFound();

  return (
    <main className="container-page py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="relative aspect-square overflow-hidden">
          <Image src={product.image} alt={product.name} fill className="object-cover" />
        </Card>
        <section className="space-y-5">
          <p className="text-sm font-bold text-primary">{product.category}</p>
          <h1 className="text-4xl font-black">{product.name}</h1>
          <div className="flex items-center gap-2 text-warning">
            <Star className="h-5 w-5 fill-warning" /> {product.rating}
            <span className="text-muted">| {product.stock} sản phẩm còn hàng</span>
          </div>
          <p className="text-muted">{product.description}</p>
          <div>
            <p className="text-4xl font-black text-primary">{formatCurrency(product.salePrice ?? product.price)}</p>
            {product.salePrice && <p className="text-muted line-through">{formatCurrency(product.price)}</p>}
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="accent" disabled={addRemoteItem.isPending} onClick={() => token ? addRemoteItem.mutate() : addItem(product)}>
              Thêm vào giỏ
            </Button>
            <Link href="/checkout">
              <Button>Mua ngay</Button>
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Card className="flex gap-3 p-4"><Truck className="text-success" /> Giao nhanh toàn quốc</Card>
            <Card className="flex gap-3 p-4"><ShieldCheck className="text-primary" /> Bảo hành chính hãng</Card>
          </div>
        </section>
      </div>
    </main>
  );
}
