import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../../infrastructure/database/prisma.service";
import { UserRepository } from "../../domain/repositories/user.repository";
import { User } from "../../domain/entities/user.entity";

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const rec = await this.prisma.user.findUnique({
      where: { id },
      include: { tenant: true },
    });
    return rec ? User.create(rec.id, rec.email, rec.passwordHash) : null;
  }

  async findByEmail(email: string) {
    // Since email is not unique globally (only per tenant), we need tenant context
    // For now, we'll use findFirst which requires tenant context
    const rec = await this.prisma.user.findFirst({
      where: { email },
      include: { tenant: true },
    });
    return rec ? User.create(rec.id, rec.email, rec.passwordHash) : null;
  }

  async save(user: User) {
    // For now, we'll need tenant context to save properly
    // This is a simplified version - in real app, you'd get tenant from context
    await this.prisma.user.upsert({
      where: { id: user.id },
      update: {
        email: user.email,
        passwordHash: (user as any).passwordHash,
      },
      create: {
        id: user.id,
        email: user.email,
        passwordHash: (user as any).passwordHash,
        tenantId: "default-tenant-id", // This should come from tenant context
      },
    });
  }
}
