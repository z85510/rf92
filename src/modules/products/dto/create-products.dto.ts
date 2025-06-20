import { ApiProperty } from '@nestjs/swagger';
import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsArray,
  ArrayMinSize 
} from 'class-validator';

export class CreateProductsDto {
  @ApiProperty({
    description: 'Products name',
    example: 'Sample Products',
  })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty({
    description: 'Products description',
    example: 'This is a sample products',
    required: false,
  })
  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Products tags',
    example: ['tag1', 'tag2'],
    isArray: true,
    required: false,
  })
  @IsArray({ message: 'Tags must be an array' })
  @IsString({ each: true, message: 'Each tag must be a string' })
  @IsOptional()
  tags?: string[];
}