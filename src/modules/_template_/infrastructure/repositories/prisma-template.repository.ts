import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/database/prisma.service';
import { TemplateRepository } from '../../domain/repositories/template.repository';
import { Template } from '../../domain/entities/template.entity';

@Injectable()
export class PrismaTemplateRepository implements TemplateRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string, tenantId: string): Promise<Template | null> {
    const templateData = await this.prisma.template.findFirst({
      where: { id, tenantId },
    });

    if (!templateData) {
      return null;
    }

    return this.mapToDomain(templateData);
  }

  async findByName(name: string, tenantId: string): Promise<Template | null> {
    const templateData = await this.prisma.template.findFirst({
      where: { name, tenantId },
    });

    if (!templateData) {
      return null;
    }

    return this.mapToDomain(templateData);
  }

  async findAll(tenantId: string, isActive?: boolean): Promise<Template[]> {
    const where: any = { tenantId };
    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const templatesData = await this.prisma.template.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return templatesData.map(template => this.mapToDomain(template));
  }

  async findByTags(tags: string[], tenantId: string): Promise<Template[]> {
    const templatesData = await this.prisma.template.findMany({
      where: {
        tenantId,
        tags: {
          hasSome: tags,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return templatesData.map(template => this.mapToDomain(template));
  }

  async save(template: Template): Promise<void> {
    await this.prisma.template.upsert({
      where: { id: template.id },
      update: {
        name: template.name,
        description: template.description,
        tags: template.tags,
        isActive: template.isActive,
        updatedAt: template.updatedAt,
        updatedBy: template.updatedBy,
      },
      create: {
        id: template.id,
        name: template.name,
        description: template.description,
        tags: template.tags,
        isActive: template.isActive,
        tenantId: template.tenantId,
        createdBy: template.createdBy,
        createdAt: template.createdAt,
        updatedAt: template.updatedAt,
        updatedBy: template.updatedBy,
      },
    });
  }

  async delete(id: string, tenantId: string): Promise<void> {
    await this.prisma.template.delete({
      where: { id },
    });
  }

  async exists(id: string, tenantId: string): Promise<boolean> {
    const count = await this.prisma.template.count({
      where: { id, tenantId },
    });
    return count > 0;
  }

  private mapToDomain(templateData: any): Template {
    // Using Object.create to bypass the private constructor
    const template = Object.create(Template.prototype);
    Object.assign(template, {
      id: templateData.id,
      name: templateData.name,
      description: templateData.description,
      tags: templateData.tags || [],
      isActive: templateData.isActive,
      tenantId: templateData.tenantId,
      createdBy: templateData.createdBy,
      createdAt: templateData.createdAt,
      updatedAt: templateData.updatedAt,
      updatedBy: templateData.updatedBy,
    });
    return template;
  }
}