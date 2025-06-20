import { ApiProperty } from '@nestjs/swagger';
import { 
  IsEmail, 
  IsString, 
  IsNotEmpty, 
  MinLength, 
  IsOptional, 
  IsArray,
  ArrayMinSize 
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
    format: 'email',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'StrongPassword123!',
    minLength: 6,
  })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
    required: false,
  })
  @IsString({ message: 'First name must be a string' })
  @IsOptional()
  firstName?: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
    required: false,
  })
  @IsString({ message: 'Last name must be a string' })
  @IsOptional()
  lastName?: string;

  @ApiProperty({
    description: 'User roles',
    example: ['user'],
    default: ['user'],
    isArray: true,
    required: false,
  })
  @IsArray({ message: 'Roles must be an array' })
  @ArrayMinSize(1, { message: 'At least one role is required' })
  @IsString({ each: true, message: 'Each role must be a string' })
  @IsOptional()
  roles?: string[];
}