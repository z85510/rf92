# Data Transfer Objects (DTOs)

The **DTO layer** contains classes that define the structure and validation rules for data flowing in and out of the API. DTOs serve as contracts between the presentation layer and external clients, ensuring type safety and data validation.

## 🎯 Purpose

- Define API request and response structures
- Validate incoming data with decorators
- Provide type safety for API contracts
- Generate OpenAPI/Swagger documentation
- Separate internal domain models from external representations
- Transform data between different representations

## 📁 Structure

```
dto/
├── create-template.dto.ts     # Input DTO for creation
├── update-template.dto.ts     # Input DTO for updates
└── template-response.dto.ts   # Output DTO for responses
```

## 📥 Input DTOs

### Create DTO
Defines the structure for creating new resources:

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { 
  IsString, 
  IsNotEmpty, 
  IsOptional, 
  IsArray, 
  MaxLength,
  ArrayMaxSize 
} from 'class-validator';

export class CreateTemplateDto {
  @ApiProperty({
    description: 'Template name',
    example: 'My Template',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Template description',
    example: 'A detailed description of the template',
    required: false,
    maxLength: 500,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @ApiProperty({
    description: 'Template tags for categorization',
    example: ['category1', 'category2'],
    required: false,
    type: [String],
    maxItems: 10,
  })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @ArrayMaxSize(10)
  tags?: string[];
}
```

### Update DTO
Extends Partial to make all fields optional:

```typescript
import { PartialType } from '@nestjs/swagger';
import { CreateTemplateDto } from './create-template.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateTemplateDto extends PartialType(CreateTemplateDto) {
  @ApiProperty({
    description: 'Whether the template is active',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
```

## 📤 Output DTOs

### Response DTO
Defines the structure of API responses:

```typescript
import { ApiProperty } from '@nestjs/swagger';

export class TemplateResponseDto {
  @ApiProperty({
    description: 'Unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Template name',
    example: 'My Template',
  })
  name: string;

  @ApiProperty({
    description: 'Template description',
    example: 'A detailed description',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    description: 'Template tags',
    example: ['category1', 'category2'],
    type: [String],
  })
  tags: string[];

  @ApiProperty({
    description: 'Whether the template is active',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Tenant identifier',
    example: 'tenant-123',
  })
  tenantId: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2023-12-01T10:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2023-12-01T10:00:00.000Z',
  })
  updatedAt: Date;
}
```

## 🛡️ Validation

### Common Validation Decorators

#### String Validation
```typescript
@IsString()              // Must be a string
@IsNotEmpty()           // Cannot be empty
@IsOptional()           // Field is optional
@MaxLength(100)         // Maximum length
@MinLength(3)           // Minimum length
@Matches(/^[a-zA-Z]+$/) // Regex pattern
```

#### Number Validation
```typescript
@IsNumber()             // Must be a number
@IsInt()               // Must be an integer
@Min(0)                // Minimum value
@Max(100)              // Maximum value
@IsPositive()          // Must be positive
```

#### Array Validation
```typescript
@IsArray()             // Must be an array
@ArrayMinSize(1)       // Minimum array size
@ArrayMaxSize(10)      // Maximum array size
@IsString({ each: true }) // Each element must be string
```

#### Date Validation
```typescript
@IsDate()              // Must be a date
@IsISO8601()          // Must be ISO 8601 format
```

#### Boolean Validation
```typescript
@IsBoolean()           // Must be boolean
```

#### Custom Validation
```typescript
@IsUUID()              // Must be valid UUID
@IsEmail()             // Must be valid email
@IsUrl()               // Must be valid URL
@IsEnum(StatusEnum)    // Must be enum value
```

### Complex Validation Examples

#### Conditional Validation
```typescript
export class CreateTemplateDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @ValidateIf(o => o.type === 'advanced')
  @IsObject()
  @IsNotEmpty()
  advancedConfig?: AdvancedConfigDto;
}
```

#### Custom Validator
```typescript
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'isUniqueTemplateName', async: true })
export class IsUniqueTemplateNameConstraint implements ValidatorConstraintInterface {
  async validate(name: string, args: ValidationArguments) {
    // Check if template name is unique
    // Return false if name already exists
    return !await this.templateService.existsByName(name);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Template name already exists';
  }
}

// Usage
export class CreateTemplateDto {
  @IsString()
  @Validate(IsUniqueTemplateNameConstraint)
  name: string;
}
```

#### Nested Object Validation
```typescript
export class TemplateConfigDto {
  @IsString()
  @IsNotEmpty()
  theme: string;

  @IsObject()
  @ValidateNested()
  @Type(() => SettingsDto)
  settings: SettingsDto;
}

export class CreateTemplateDto {
  @IsString()
  name: string;

  @IsObject()
  @ValidateNested()
  @Type(() => TemplateConfigDto)
  config: TemplateConfigDto;
}
```

## 📚 Swagger Documentation

### Property Documentation
```typescript
@ApiProperty({
  description: 'Human-readable description',
  example: 'Example value',
  required: false,          // Optional field
  nullable: true,           // Can be null
  type: String,             // Explicit type
  enum: ['option1', 'option2'], // Enum values
  minimum: 0,               // For numbers
  maximum: 100,             // For numbers
  minLength: 3,             // For strings
  maxLength: 100,           // For strings
  format: 'email',          // String format
  pattern: '^[a-zA-Z]+$',   // Regex pattern
})
propertyName: string;
```

### Array Documentation
```typescript
@ApiProperty({
  description: 'Array of strings',
  type: [String],           // Array type
  example: ['item1', 'item2'],
  maxItems: 10,             // Maximum array size
  uniqueItems: true,        // No duplicates
})
tags: string[];
```

### Object Documentation
```typescript
@ApiProperty({
  description: 'Nested object',
  type: NestedDto,          // Reference to another DTO
})
nested: NestedDto;
```

## 🔄 Transformation

### Class Transformer
```typescript
import { Transform, Type } from 'class-transformer';

export class CreateTemplateDto {
  @Transform(({ value }) => value?.trim())
  @IsString()
  name: string;

  @Transform(({ value }) => value?.toLowerCase())
  @IsString()
  category: string;

  @Type(() => Date)
  @IsDate()
  scheduledDate: Date;
}
```

### Custom Transformation
```typescript
export class TemplateResponseDto {
  @Transform(({ value }) => value.toUpperCase())
  name: string;

  @Transform(({ value }) => value ? 'Active' : 'Inactive')
  status: string;
}
```

## 🧪 Testing

### DTO Validation Testing
```typescript
describe('CreateTemplateDto', () => {
  let dto: CreateTemplateDto;

  beforeEach(() => {
    dto = new CreateTemplateDto();
  });

  it('should validate successfully with valid data', async () => {
    // Arrange
    dto.name = 'Valid Template Name';
    dto.description = 'Valid description';
    dto.tags = ['tag1', 'tag2'];

    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors).toHaveLength(0);
  });

  it('should fail validation with empty name', async () => {
    // Arrange
    dto.name = '';
    
    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('name');
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should fail validation with too long name', async () => {
    // Arrange
    dto.name = 'a'.repeat(101); // Exceeds max length
    
    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints).toHaveProperty('maxLength');
  });

  it('should allow optional description', async () => {
    // Arrange
    dto.name = 'Valid Name';
    // description is not set (optional)
    
    // Act
    const errors = await validate(dto);

    // Assert
    expect(errors).toHaveLength(0);
  });
});
```

## 📋 Best Practices

1. **Use descriptive names** - Make DTO names clear and meaningful
2. **Validate all inputs** - Never trust external data
3. **Provide examples** - Help API consumers with Swagger examples
4. **Use proper types** - Leverage TypeScript for type safety
5. **Separate concerns** - Different DTOs for different operations
6. **Document everything** - Use ApiProperty for all fields
7. **Transform data** - Clean and format input data
8. **Handle optional fields** - Use @IsOptional() appropriately

## 🚀 Adding New DTOs

### Creating Input DTO
```typescript
export class CreateNewResourceDto {
  @ApiProperty({
    description: 'Resource name',
    example: 'My Resource',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  // Add more properties with validation
}
```

### Creating Response DTO
```typescript
export class NewResourceResponseDto {
  @ApiProperty({
    description: 'Unique identifier',
    example: 'uuid-string',
  })
  id: string;

  @ApiProperty({
    description: 'Resource name',
    example: 'My Resource',
  })
  name: string;

  // Add more response properties
}
```

### Creating Query DTO
```typescript
export class GetResourcesQueryDto {
  @ApiProperty({
    description: 'Page number',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({
    description: 'Items per page',
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number = 10;

  @ApiProperty({
    description: 'Search term',
    example: 'search query',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;
}
```

## 🔗 Integration with Other Layers

### Controllers
```typescript
@Post()
async create(
  @Body() createDto: CreateTemplateDto, // Input DTO
): Promise<TemplateResponseDto> {       // Output DTO
  // Implementation
}
```

### Application Layer
```typescript
// Convert DTO to command
const command = new CreateTemplateCommand(
  createDto,  // DTO passed to command
  tenantId,
  userId
);

// Convert entity to response DTO
return {
  id: template.id,
  name: template.name,
  // ... map entity properties to DTO
} as TemplateResponseDto;
```

This DTO layer provides a clean contract for API communication while ensuring data validation and proper documentation.