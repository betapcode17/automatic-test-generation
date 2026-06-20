import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findMe(id: string) {
    return this.prisma.user.findUnique({ where: { id }, include: { role: true, orders: true } });
  }

  updateMe(id: string, data: { fullName?: string; phone?: string; address?: string; avatarUrl?: string }) {
    return this.prisma.user.update({ where: { id }, data, include: { role: true } });
  }
}
