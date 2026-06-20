import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.replace('Bearer ', '');
    if (!token) throw new UnauthorizedException('Missing access token');

    try {
      const payload = await this.jwt.verifyAsync(token);
      request.user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        include: { role: true }
      });
      if (!request.user) throw new UnauthorizedException('Invalid user');
      return true;
    } catch {
      throw new UnauthorizedException('Invalid access token');
    }
  }
}
