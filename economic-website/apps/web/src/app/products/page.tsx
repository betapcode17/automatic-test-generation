'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SlidersHorizontal } from 'lucide-react';
import { ProductCard } from '@/components/product/product-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { api } from '@/lib/api';

export default function ProductsPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const { data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: api.categories });
  const { data: remoteProducts = [], isLoading, error } = useQuery({
    queryKey: ['products', query, category],
    queryFn: () => api.products({ q: query, category })
  });
  const filtered = useMemo(() => remoteProducts, [remoteProducts]);

  return (
    <main className="container-page py-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold text-accent">Product Listing</p>
          <h1 className="text-3xl font-black">Danh sách sản phẩm</h1>
        </div>
        <div className="flex gap-3">
          <Input placeholder="Tìm sản phẩm..." value={query} onChange={(event) => setQuery(event.target.value)} />
          <Button variant="outline">
            <SlidersHorizontal className="h-4 w-4" /> Lọc
          </Button>
        </div>
      </div>
      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        {[{ id: 'all', name: 'Tat ca', slug: 'all' }, ...categories].map((item) => (
          <button
            key={item.slug}
            onClick={() => setCategory(item.slug)}
            className={`whitespace-nowrap rounded-xl border px-4 py-2 text-sm font-bold ${category === item.slug ? 'border-primary bg-primary text-white' : 'border-border bg-white text-secondary'}`}
          >
            {item.name}
          </button>
        ))}
      </div>
      {isLoading && <Card className="p-8 text-center text-muted">Dang tai san pham...</Card>}
      {error && <Card className="p-8 text-center text-danger">Khong ket noi duoc API san pham.</Card>}
      {!isLoading && filtered.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : !isLoading && !error ? (
        <Card className="p-8 text-center text-muted">Không tìm thấy sản phẩm phù hợp.</Card>
      ) : null}
    </main>
  );
}
