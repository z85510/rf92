import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { 
  IsEmail, 
  IsString, 
  IsOptional, 
  IsArray,
  ArrayMinSize,
  IsBoolean 
} from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({
    description: 'User email address',
    example: 'john.doe@example.com',
    format: 'email',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'User first name',
    example: 'John',
  })
  @IsString({ message: 'First name must be a string' })
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional({
    description: 'User last name',
    example: 'Doe',
  })
  @IsString({ message: 'Last name must be a string' })
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional({
    description: 'User roles',
    example: ['user', 'admin'],
    isArray: true,
  })
  @IsArray({ message: 'Roles must be an array' })
  @ArrayMinSize(1, { message: 'At least one role is required' })
  @IsString({ each: true, message: 'Each role must be a string' })
  @IsOptional()
  roles?: string[];

  @ApiPropertyOptional({
    description: 'User active status',
    example: true,
  })
  @IsBoolean({ message: 'isActive must be a boolean' })
  @IsOptional()
  isActive?: boolean;
}