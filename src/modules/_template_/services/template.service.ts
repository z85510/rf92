import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateTemplateDto } from '../dto/create-template.dto';
import { UpdateTemplateDto } from '../dto/update-template.dto';
import { TemplateResponseDto } from '../dto/template-response.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class TemplateService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createTemplateDto: CreateTemplateDto,
    tenantId: string,
    userId: string,
  ): Promise<TemplateResponseDto> {
    const template = await this.prisma.template.create({
      data: {
        ...createTemplateDto,
        tenantId,
        createdBy: userId,
      },
    });

    return this.mapToResponseDto(template);
  }

  async update(
    id: string,
    updateTemplateDto: UpdateTemplateDto,
    tenantId: string,
    userId: string,
  ): Promise<TemplateResponseDto> {
    const existingTemplate = await this.prisma.template.findFirst({
      where: { id, tenantId },
    });

    if (!existingTemplate) {
      throw new NotFoundException(`Template with ID ${id} not found`);
    }

    const updatedTemplate = await this.prisma.template.update({
      where: { id },
      data: {
        ...updateTemplateDto,
        updatedBy: userId,
      },
    });

    return this.mapToResponseDto(updatedTemplate);
  }

  async delete(id: string, tenantId: string, userId: string): Promise<void> {
    const existingTemplate = await this.prisma.template.findFirst({
      where: { id, tenantId },
    });

    if (!existingTemplate) {
      throw new NotFoundException(`Template with ID ${id} not found`);
    }

    await this.prisma.template.delete({
      where: { id },
    });
  }

  private mapToResponseDto(template: any): TemplateResponseDto {
    return {
      id: template.id,
      name: template.name,
      description: template.description,
      tags: template.tags || [],
      isActive: template.isActive,
      tenantId: template.tenantId,
      createdAt: template.createdAt,
      updatedAt: template.updatedAt,
    };
  }
}