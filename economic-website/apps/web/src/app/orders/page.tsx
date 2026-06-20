'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

export default function OrdersPage() {
  const { data: orders = [], isLoading, error } = useQuery({ queryKey: ['orders'], queryFn: api.orders });

  return (
    <main className="container-page py-8">
      <h1 className="mb-6 text-3xl font-black">Lịch sử đơn hàng</h1>
      {isLoading && <Card className="p-8 text-center text-muted">Dang tai don hang...</Card>}
      {error && <Card className="p-8 text-center text-danger">Vui long dang nhap de xem don hang.</Card>}
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <Link href={`/orders/${order.id}`} className="font-black text-primary">{order.orderNumber}</Link>
              <p className="text-sm text-muted">Ngày tạo: {new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
            </div>
            <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-primary">{order.status}</span>
            <b>{formatCurrency(Number(order.total))}</b>
          </Card>
        ))}
      </div>
    </main>
  );
}
