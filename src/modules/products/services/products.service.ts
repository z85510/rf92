import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateProductsDto } from '../dto/create-products.dto';
import { UpdateProductsDto } from '../dto/update-products.dto';
import { ProductsResponseDto } from '../dto/products-response.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createProductsDto: CreateProductsDto,
    tenantId: string,
    userId: string,
  ): Promise<ProductsResponseDto> {
    const products = await this.prisma.products.create({
      data: {
        ...createProductsDto,
        tenantId,
        createdBy: userId,
      },
    });

    return this.mapToResponseDto(products);
  }

  async update(
    id: string,
    updateProductsDto: UpdateProductsDto,
    tenantId: string,
    userId: string,
  ): Promise<ProductsResponseDto> {
    const existingProducts = await this.prisma.products.findFirst({
      where: { id, tenantId },
    });

    if (!existingProducts) {
      throw new NotFoundException(`Products with ID ${id} not found`);
    }

    const updatedProducts = await this.prisma.products.update({
      where: { id },
      data: {
        ...updateProductsDto,
        updatedBy: userId,
      },
    });

    return this.mapToResponseDto(updatedProducts);
  }

  async delete(id: string, tenantId: string, userId: string): Promise<void> {
    const existingProducts = await this.prisma.products.findFirst({
      where: { id, tenantId },
    });

    if (!existingProducts) {
      throw new NotFoundException(`Products with ID ${id} not found`);
    }

    await this.prisma.products.delete({
      where: { id },
    });
  }

  private mapToResponseDto(products: any): ProductsResponseDto {
    return {
      id: products.id,
      name: products.name,
      description: products.description,
      tags: products.tags || [],
      isActive: products.isActive,
      tenantId: products.tenantId,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
    };
  }
}