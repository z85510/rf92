import { ApiProperty } from '@nestjs/swagger';

export class ProductsResponseDto {
  @ApiProperty({
    description: 'Products unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Products name',
    example: 'Sample Products',
  })
  name: string;

  @ApiProperty({
    description: 'Products description',
    example: 'This is a sample products',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    description: 'Products tags',
    example: ['tag1', 'tag2'],
    isArray: true,
  })
  tags: string[];

  @ApiProperty({
    description: 'Products active status',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Tenant ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  tenantId: string;

  @ApiProperty({
    description: 'Products creation date',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Products last update date',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}

export class PaginatedProductssResponseDto {
  @ApiProperty({
    description: 'Array of productss',
    type: [ProductsResponseDto],
  })
  data: ProductsResponseDto[];

  @ApiProperty({
    description: 'Total number of productss',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 10,
  })
  totalPages: number;
}