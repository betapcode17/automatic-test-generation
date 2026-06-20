'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';

export default function ProfilePage() {
  const { token, hydrate } = useAuthStore();
  const { data: user, isLoading, error } = useQuery({ queryKey: ['me', token], queryFn: api.me, enabled: Boolean(token) });

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!token) {
    return <main className="container-page py-8"><Card className="p-8 text-center text-muted">Vui long dang nhap de xem trang ca nhan.</Card></main>;
  }

  return (
    <main className="container-page grid gap-6 py-8 lg:grid-cols-[280px_1fr]">
      <Card className="h-fit p-5">
        <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-accent" />
        <h1 className="mt-4 text-2xl font-black">{user?.fullName ?? 'Dang tai...'}</h1>
        <p className="text-sm text-muted">{user?.email}</p>
      </Card>
      <Card className="p-6">
        <h2 className="text-2xl font-black">Trang cá nhân</h2>
        {isLoading && <p className="mt-4 text-sm text-muted">Dang tai ho so...</p>}
        {error && <p className="mt-4 text-sm text-danger">Khong tai duoc ho so.</p>}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="space-y-2"><span className="text-sm font-bold">Họ tên</span><Input defaultValue={user?.fullName} /></label>
          <label className="space-y-2"><span className="text-sm font-bold">Số điện thoại</span><Input defaultValue={user?.phone} /></label>
          <label className="space-y-2 sm:col-span-2"><span className="text-sm font-bold">Địa chỉ</span><Input defaultValue={user?.address} /></label>
          <Button className="w-fit">Lưu thay đổi</Button>
        </div>
      </Card>
    </main>
  );
}
