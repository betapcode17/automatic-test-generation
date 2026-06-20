import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CategoryDto } from './dto/category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.category.findMany({ where: { isActive: true }, include: { _count: { select: { products: true } } } });
  }

  create(dto: CategoryDto) {
    return this.prisma.category.create({ data: dto });
  }

  update(id: string, dto: Partial<CategoryDto>) {
    return this.prisma.category.update({ where: { id }, data: dto });
  }

  remove(id: string) {
    return this.prisma.category.update({ where: { id }, data: { isActive: false } });
  }
}
