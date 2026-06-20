'use client';

import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { api, mapProduct } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { useAuthStore } from '@/store/auth-store';

const checkoutSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(9),
  email: z.string().email(),
  address: z.string().min(8),
  paymentMethod: z.string().min(1)
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const token = useAuthStore((state) => state.token);
  const cart = useQuery({ queryKey: ['cart'], queryFn: api.cart, enabled: Boolean(token) });
  const items = cart.data?.items.map((item) => ({ ...mapProduct(item.product), quantity: item.quantity })) ?? [];
  const checkout = useMutation({
    mutationFn: (values: CheckoutForm) =>
      api.checkout({
        paymentMethod: values.paymentMethod,
        shippingName: values.fullName,
        shippingPhone: values.phone,
        shippingEmail: values.email,
        shippingAddr: values.address
      })
  });
  const { register, handleSubmit, formState: { errors, isSubmitSuccessful } } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { paymentMethod: 'COD' }
  });
  const subtotal = items.reduce((sum, item) => sum + (item.salePrice ?? item.price) * item.quantity, 0);

  if (!token) {
    return <main className="container-page py-8"><Card className="p-8 text-center text-muted">Vui long dang nhap de checkout voi backend.</Card></main>;
  }

  return (
    <main className="container-page grid gap-6 py-8 lg:grid-cols-[1fr_380px]">
      <Card className="p-6">
        <h1 className="text-3xl font-black">Checkout</h1>
        <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit((values) => checkout.mutate(values))}>
          <label className="space-y-2"><span className="text-sm font-bold">Họ tên</span><Input {...register('fullName')} />{errors.fullName && <p className="text-xs text-danger">Nhập họ tên hợp lệ</p>}</label>
          <label className="space-y-2"><span className="text-sm font-bold">Số điện thoại</span><Input {...register('phone')} />{errors.phone && <p className="text-xs text-danger">Nhập số điện thoại</p>}</label>
          <label className="space-y-2"><span className="text-sm font-bold">Email</span><Input {...register('email')} />{errors.email && <p className="text-xs text-danger">Email không hợp lệ</p>}</label>
          <label className="space-y-2"><span className="text-sm font-bold">Thanh toán</span><select className="h-11 w-full rounded-xl border border-border px-4" {...register('paymentMethod')}><option>COD</option><option>VNPay</option><option>Momo</option></select></label>
          <label className="space-y-2 sm:col-span-2"><span className="text-sm font-bold">Địa chỉ</span><Input {...register('address')} />{errors.address && <p className="text-xs text-danger">Nhập địa chỉ giao hàng</p>}</label>
          <Button className="sm:col-span-2" disabled={!items.length || checkout.isPending}>{checkout.isPending ? 'Dang dat hang...' : 'Đặt hàng'}</Button>
          {(isSubmitSuccessful && checkout.isSuccess) && <p className="sm:col-span-2 rounded-xl bg-green-50 p-3 text-sm font-bold text-success">Đơn hàng đã được tạo trên backend.</p>}
          {checkout.error && <p className="sm:col-span-2 rounded-xl bg-red-50 p-3 text-sm font-bold text-danger">{checkout.error.message}</p>}
        </form>
      </Card>
      <Card className="h-fit p-6">
        <h2 className="text-xl font-black">Đơn hàng</h2>
        <div className="mt-4 space-y-3">
          {items.map((item) => <div key={item.id} className="flex justify-between text-sm"><span>{item.name} x{item.quantity}</span><b>{formatCurrency((item.salePrice ?? item.price) * item.quantity)}</b></div>)}
          <div className="border-t border-border pt-3 text-lg font-black flex justify-between"><span>Tổng</span><span>{formatCurrency(subtotal)}</span></div>
        </div>
      </Card>
    </main>
  );
}
