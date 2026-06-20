import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ProductQueryDto, UpsertProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(query: ProductQueryDto) {
    return this.prisma.product.findMany({
      where: {
        isActive: true,
        name: query.q ? { contains: query.q, mode: 'insensitive' } : undefined,
        category: query.category ? { slug: query.category } : undefined
      },
      include: { category: true, images: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: { category: true, images: true, reviews: { include: { user: true } } }
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  create(dto: UpsertProductDto) {
    return this.prisma.product.create({ data: dto, include: { category: true } });
  }

  update(id: string, dto: Partial<UpsertProductDto>) {
    return this.prisma.product.update({ where: { id }, data: dto, include: { category: true } });
  }

  remove(id: string) {
    return this.prisma.product.update({ where: { id }, data: { isActive: false } });
  }
}
