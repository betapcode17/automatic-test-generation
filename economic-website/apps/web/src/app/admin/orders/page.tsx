'use client';

import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

export default function OrderManagementPage() {
  const { data: orders = [], isLoading, error } = useQuery({ queryKey: ['admin-orders'], queryFn: api.adminOrders });

  return (
    <main className="container-page py-8">
      <h1 className="mb-6 text-3xl font-black">Quản lý đơn hàng</h1>
      {isLoading && <Card className="mb-4 p-5 text-muted">Dang tai don hang...</Card>}
      {error && <Card className="mb-4 p-5 text-danger">Can quyen ADMIN/MANAGER.</Card>}
      <Card className="overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-muted">
            <tr><th className="p-4">Mã đơn</th><th>Khách hàng</th><th>Trạng thái</th><th>Thanh toán</th><th className="text-right pr-4">Tổng</th></tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order.id} className="border-t border-border">
                <td className="p-4 font-bold text-primary">{order.orderNumber}</td>
                <td>Customer {index + 1}</td>
                <td><span className="rounded-full bg-blue-50 px-3 py-1 font-bold text-primary">SHIPPING</span></td>
                <td><span className="rounded-full bg-green-50 px-3 py-1 font-bold text-success">{order.paymentStatus}</span></td>
                <td className="pr-4 text-right font-black">{formatCurrency(Number(order.total))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </main>
  );
}
