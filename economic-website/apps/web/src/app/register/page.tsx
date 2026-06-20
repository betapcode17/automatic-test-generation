'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';

const schema = z.object({ fullName: z.string().min(2), email: z.string().email(), password: z.string().min(8) });
type RegisterForm = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const mutation = useMutation({
    mutationFn: api.register,
    onSuccess: (data) => {
      setSession(data.accessToken, data.user);
      router.push('/profile');
    }
  });
  const { register, handleSubmit } = useForm<RegisterForm>({ resolver: zodResolver(schema) });
  return (
    <main className="container-page flex min-h-[calc(100vh-64px)] items-center justify-center py-8">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-3xl font-black">Đăng ký</h1>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit((values) => mutation.mutate(values))}>
          <label className="space-y-2 block"><span className="text-sm font-bold">Họ tên</span><Input {...register('fullName')} /></label>
          <label className="space-y-2 block"><span className="text-sm font-bold">Email</span><Input {...register('email')} /></label>
          <label className="space-y-2 block"><span className="text-sm font-bold">Mật khẩu</span><Input type="password" {...register('password')} /></label>
          <Button className="w-full" disabled={mutation.isPending}>{mutation.isPending ? 'Dang tao...' : 'Tạo tài khoản'}</Button>
          {mutation.error && <p className="rounded-xl bg-red-50 p-3 text-sm font-bold text-danger">{mutation.error.message}</p>}
        </form>
      </Card>
    </main>
  );
}
