'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const { data: order, isLoading, error } = useQuery({ queryKey: ['order', params.id], queryFn: () => api.order(params.id) });
  const items = order?.items ?? [];
  const total = Number(order?.total ?? 0);

  if (isLoading) return <main className="container-page py-8"><Card className="p-8 text-center text-muted">Dang tai chi tiet don hang...</Card></main>;
  if (error || !order) return <main className="container-page py-8"><Card className="p-8 text-center text-danger">Khong tai duoc don hang.</Card></main>;

  return (
    <main className="container-page py-8">
      <h1 className="text-3xl font-black">Chi tiết đơn hàng {order.orderNumber}</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card className="p-5">
          <h2 className="text-xl font-black">Sản phẩm</h2>
          <div className="mt-4 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between border-b border-border pb-4">
                <div>
                  <p className="font-bold">{item.product.name}</p>
                  <p className="text-sm text-muted">Số lượng: {item.quantity}</p>
                </div>
                <b>{formatCurrency(Number(item.unitPrice) * item.quantity)}</b>
              </div>
            ))}
          </div>
        </Card>
        <Card className="h-fit p-5">
          <h2 className="text-xl font-black">Thông tin giao hàng</h2>
          <p className="mt-3 text-sm text-muted">{order.shippingName}, {order.shippingPhone}</p>
          <p className="text-sm text-muted">{order.shippingAddr}</p>
          <div className="mt-5 flex justify-between border-t border-border pt-4 text-lg font-black">
            <span>Tổng</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </Card>
      </div>
    </main>
  );
}
