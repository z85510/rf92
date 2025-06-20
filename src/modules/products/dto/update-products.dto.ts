import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsBoolean } from 'class-validator';
import { CreateProductsDto } from './create-products.dto';

export class UpdateProductsDto extends PartialType(CreateProductsDto) {
  @ApiPropertyOptional({
    description: 'Products name',
    example: 'Updated Products',
  })
  @IsString({ message: 'Name must be a string' })
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Products description',
    example: 'Updated description',
  })
  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Products tags',
    example: ['tag1', 'tag2'],
    isArray: true,
  })
  @IsArray({ message: 'Tags must be an array' })
  @IsString({ each: true, message: 'Each tag must be a string' })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Products active status',
    example: true,
  })
  @IsBoolean({ message: 'isActive must be a boolean' })
  @IsOptional()
  isActive?: boolean;
}