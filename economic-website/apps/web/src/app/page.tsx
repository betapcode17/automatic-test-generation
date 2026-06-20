'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Headphones, ShieldCheck, Truck, Clock3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ProductCard } from '@/components/product/product-card';
import { api } from '@/lib/api';

const features = [
  { icon: Truck, title: 'Free Shipping', text: 'Miễn phí vận chuyển cho đơn từ 500K' },
  { icon: ShieldCheck, title: 'Secure Payment', text: 'Thanh toán an toàn, bảo mật' },
  { icon: Clock3, title: 'Fast Delivery', text: 'Giao nhanh nội thành 2 giờ' },
  { icon: Headphones, title: '24/7 Support', text: 'Hỗ trợ mọi lúc qua chat' }
];

export default function HomePage() {
  const { data: products = [], isLoading } = useQuery({ queryKey: ['products', 'home'], queryFn: () => api.products() });
  const featured = products[0];

  return (
    <main>
      <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 text-white">
        <div className="container-page grid min-h-[560px] items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">Flash Sale hôm nay</p>
            <h1 className="max-w-3xl text-4xl font-black leading-tight md:text-6xl">Sắm thông minh hơn với trải nghiệm mua hàng tối giản.</h1>
            <p className="mt-5 max-w-2xl text-lg text-blue-50">Khám phá sản phẩm công nghệ, phụ kiện và lifestyle được tuyển chọn với giá tốt, giao nhanh và thanh toán an toàn.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products">
                <Button variant="accent">Mua ngay</Button>
              </Link>
              <Link href="/products">
                <Button variant="outline" className="border-white/50 bg-white/10 text-white hover:bg-white hover:text-primary">
                  Xem sản phẩm
                </Button>
              </Link>
            </div>
          </div>
          {featured && (
            <Card className="bg-white/95 p-4 text-secondary">
              <ProductCard product={featured} />
            </Card>
          )}
        </div>
      </section>

      <section className="container-page grid gap-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <Card key={feature.title} className="p-5">
            <feature.icon className="h-8 w-8 text-primary" />
            <h3 className="mt-4 font-black">{feature.title}</h3>
            <p className="mt-1 text-sm text-muted">{feature.text}</p>
          </Card>
        ))}
      </section>

      <section className="container-page py-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-sm font-bold text-accent">New Products</p>
            <h2 className="text-3xl font-black">Sản phẩm nổi bật</h2>
          </div>
          <Link className="font-bold text-primary" href="/products">
            Xem tất cả
          </Link>
        </div>
        {isLoading && <Card className="p-8 text-center text-muted">Dang tai san pham...</Card>}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
