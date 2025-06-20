import { ApiProperty } from '@nestjs/swagger';

export class TemplateResponseDto {
  @ApiProperty({
    description: 'Template unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Template name',
    example: 'Sample Template',
  })
  name: string;

  @ApiProperty({
    description: 'Template description',
    example: 'This is a sample template',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    description: 'Template tags',
    example: ['tag1', 'tag2'],
    isArray: true,
  })
  tags: string[];

  @ApiProperty({
    description: 'Template active status',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Tenant ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  tenantId: string;

  @ApiProperty({
    description: 'Template creation date',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Template last update date',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}

export class PaginatedTemplatesResponseDto {
  @ApiProperty({
    description: 'Array of templates',
    type: [TemplateResponseDto],
  })
  data: TemplateResponseDto[];

  @ApiProperty({
    description: 'Total number of templates',
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