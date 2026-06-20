import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RoleName } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ForgotPasswordDto, LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) throw new BadRequestException('Email already registered');
    const role = await this.prisma.role.upsert({
      where: { name: RoleName.CUSTOMER },
      update: {},
      create: { name: RoleName.CUSTOMER }
    });
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        fullName: dto.fullName,
        passwordHash: await bcrypt.hash(dto.password, 10),
        roleId: role.id,
        cart: { create: {} }
      },
      include: { role: true }
    });
    return this.issueToken(user);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email }, include: { role: true } });
    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.issueToken(user);
  }

  forgotPassword(dto: ForgotPasswordDto) {
    return {
      message: `Password reset instructions will be sent to ${dto.email} when email service is configured.`
    };
  }

  private async issueToken(user: { id: string; email: string; fullName: string; role: { name: RoleName } }) {
    const accessToken = await this.jwt.signAsync({ sub: user.id, email: user.email, role: user.role.name });
    return {
      accessToken,
      user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role.name }
    };
  }
}
