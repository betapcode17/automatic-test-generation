import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async getCart(userId: string) {
    const cart = await this.prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId }
    });
    return this.prisma.cart.findUnique({
      where: { id: cart.id },
      include: { items: { include: { product: { include: { images: true } } } } }
    });
  }

  async addItem(userId: string, productId: string, quantity = 1) {
    const cart = await this.prisma.cart.upsert({ where: { userId }, update: {}, create: { userId } });
    return this.prisma.cartItem.upsert({
      where: { cartId_productId: { cartId: cart.id, productId } },
      update: { quantity: { increment: quantity } },
      create: { cartId: cart.id, productId, quantity }
    });
  }

  updateItem(itemId: string, quantity: number) {
    return this.prisma.cartItem.update({ where: { id: itemId }, data: { quantity } });
  }

  removeItem(itemId: string) {
    return this.prisma.cartItem.delete({ where: { id: itemId } });
  }
}
