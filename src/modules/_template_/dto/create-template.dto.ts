import { ApiProperty } from '@nestjs/swagger';
import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsArray,
  ArrayMinSize 
} from 'class-validator';

export class CreateTemplateDto {
  @ApiProperty({
    description: 'Template name',
    example: 'Sample Template',
  })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty({
    description: 'Template description',
    example: 'This is a sample template',
    required: false,
  })
  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Template tags',
    example: ['tag1', 'tag2'],
    isArray: true,
    required: false,
  })
  @IsArray({ message: 'Tags must be an array' })
  @IsString({ each: true, message: 'Each tag must be a string' })
  @IsOptional()
  tags?: string[];
}