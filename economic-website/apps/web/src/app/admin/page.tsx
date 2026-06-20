'use client';

import { useQuery } from '@tanstack/react-query';
import { Package, ShoppingBag, Users, Wallet } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

export default function AdminDashboardPage() {
  const { data, isLoading, error } = useQuery({ queryKey: ['admin-dashboard'], queryFn: api.adminDashboard });
  const stats = [
    { label: 'Revenue', value: formatCurrency(Number(data?.revenue ?? 0)), icon: Wallet },
    { label: 'Orders', value: String(data?.orders ?? 0), icon: ShoppingBag },
    { label: 'Products', value: String(data?.products ?? 0), icon: Package },
    { label: 'Users', value: String(data?.users ?? 0), icon: Users }
  ];

  return (
    <main className="container-page py-8">
      <h1 className="text-3xl font-black">Admin Dashboard</h1>
      {isLoading && <Card className="mt-6 p-5 text-muted">Dang tai dashboard...</Card>}
      {error && <Card className="mt-6 p-5 text-danger">Can tai khoan ADMIN/MANAGER de xem dashboard.</Card>}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-5">
            <stat.icon className="h-7 w-7 text-primary" />
            <p className="mt-4 text-sm font-bold text-muted">{stat.label}</p>
            <p className="text-2xl font-black">{stat.value}</p>
          </Card>
        ))}
      </div>
      <Card className="mt-6 overflow-hidden">
        <div className="border-b border-border p-5">
          <h2 className="text-xl font-black">Recent Orders</h2>
        </div>
        <table className="w-full text-left text-sm">
          <tbody>
            {['ECO-10021', 'ECO-10020', 'ECO-10019'].map((id) => (
              <tr key={id} className="border-b border-border">
                <td className="p-4 font-bold">{id}</td>
                <td className="p-4 text-muted">Nguyen Van A</td>
                <td className="p-4"><span className="rounded-full bg-orange-50 px-3 py-1 font-bold text-accent">Processing</span></td>
                <td className="p-4 text-right font-black">{formatCurrency(1890000)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </main>
  );
}
