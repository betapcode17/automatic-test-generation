'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';

const schema = z.object({ email: z.string().email(), password: z.string().min(8) });
type LoginForm = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const mutation = useMutation({
    mutationFn: api.login,
    onSuccess: (data) => {
      setSession(data.accessToken, data.user);
      router.push('/profile');
    }
  });
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({ resolver: zodResolver(schema) });
  return (
    <main className="container-page flex min-h-[calc(100vh-64px)] items-center justify-center py-8">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-3xl font-black">Đăng nhập</h1>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit((values) => mutation.mutate(values))}>
          <label className="space-y-2 block"><span className="text-sm font-bold">Email</span><Input {...register('email')} />{errors.email && <p className="text-xs text-danger">Email không hợp lệ</p>}</label>
          <label className="space-y-2 block"><span className="text-sm font-bold">Mật khẩu</span><Input type="password" {...register('password')} />{errors.password && <p className="text-xs text-danger">Tối thiểu 8 ký tự</p>}</label>
          <div className="flex justify-between text-sm"><Link className="text-primary" href="#">Quên mật khẩu?</Link><Link className="text-primary" href="/register">Tạo tài khoản</Link></div>
          <Button className="w-full" disabled={mutation.isPending}>{mutation.isPending ? 'Dang nhap...' : 'Đăng nhập'}</Button>
          {mutation.error && <p className="rounded-xl bg-red-50 p-3 text-sm font-bold text-danger">{mutation.error.message}</p>}
        </form>
      </Card>
    </main>
  );
}
