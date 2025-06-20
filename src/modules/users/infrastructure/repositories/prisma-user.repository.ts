import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';
import { UserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const rec = await this.prisma.user.findUnique({ where: { id } });
    return rec ? User.create(rec.id, rec.email, rec.passwordHash) : null;
  }

  async findByEmail(email: string) {
    const rec = await this.prisma.user.findUnique({ where: { email } });
    return rec ? User.create(rec.id, rec.email, rec.passwordHash) : null;
  }

  async save(user: User) {
    await this.prisma.user.upsert({
      where: { id: user.id },
      update: { email: user.email, passwordHash: (user as any).passwordHash },
      create: {
        id: user.id,
        email: user.email,
        passwordHash: (user as any).passwordHash,
      },
    });
  }
}