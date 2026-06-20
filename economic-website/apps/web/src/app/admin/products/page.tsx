'use client';

import { useQuery } from '@tanstack/react-query';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

export default function ProductManagementPage() {
  const { data: products = [], isLoading, error } = useQuery({ queryKey: ['admin-products'], queryFn: () => api.products() });

  return (
    <main className="container-page py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-black">Quản lý sản phẩm</h1>
        <Button><Plus className="h-4 w-4" /> Thêm sản phẩm</Button>
      </div>
      {isLoading && <Card className="mb-4 p-5 text-muted">Dang tai san pham...</Card>}
      {error && <Card className="mb-4 p-5 text-danger">Khong tai duoc danh sach san pham.</Card>}
      <Card className="overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-muted">
            <tr><th className="p-4">Tên</th><th>Danh mục</th><th>Giá</th><th>Kho</th><th className="text-right pr-4">Thao tác</th></tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-border">
                <td className="p-4 font-bold">{product.name}</td>
                <td>{product.category}</td>
                <td>{formatCurrency(product.salePrice ?? product.price)}</td>
                <td>{product.stock}</td>
                <td className="pr-4 text-right"><button className="p-2 text-primary"><Edit className="h-4 w-4" /></button><button className="p-2 text-danger"><Trash2 className="h-4 w-4" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </main>
  );
}
