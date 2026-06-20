import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  findMine(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  findOne(id: string) {
    return this.prisma.order.findUnique({ where: { id }, include: { items: { include: { product: true } }, user: true } });
  }

  async checkout(userId: string, body: { paymentMethod: string; shippingName: string; shippingPhone: string; shippingEmail: string; shippingAddr: string; note?: string }) {
    const cart = await this.prisma.cart.findUnique({ where: { userId }, include: { items: { include: { product: true } } } });
    const items = cart?.items ?? [];
    const subtotal = items.reduce((sum, item) => sum + Number(item.product.salePrice ?? item.product.price) * item.quantity, 0);
    const shippingFee = subtotal > 500000 ? 0 : 30000;
    const total = subtotal + shippingFee;

    const order = await this.prisma.order.create({
      data: {
        userId,
        orderNumber: `ECO-${Date.now()}`,
        subtotal,
        shippingFee,
        discount: 0,
        total,
        paymentMethod: body.paymentMethod,
        shippingName: body.shippingName,
        shippingPhone: body.shippingPhone,
        shippingEmail: body.shippingEmail,
        shippingAddr: body.shippingAddr,
        note: body.note,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.product.salePrice ?? item.product.price
          }))
        }
      },
      include: { items: true }
    });
    if (cart) await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    return order;
  }
}
