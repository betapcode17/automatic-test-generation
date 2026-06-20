import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async dashboard() {
    const [users, products, orders, revenue] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.product.count(),
      this.prisma.order.count(),
      this.prisma.order.aggregate({ _sum: { total: true } })
    ]);
    return { users, products, orders, revenue: revenue._sum.total ?? 0 };
  }

  users() {
    return this.prisma.user.findMany({ include: { role: true }, orderBy: { createdAt: 'desc' } });
  }

  orders() {
    return this.prisma.order.findMany({ include: { user: true, items: true }, orderBy: { createdAt: 'desc' } });
  }
}
