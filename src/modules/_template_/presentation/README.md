# Presentation Layer

The **Presentation Layer** handles HTTP requests and responses, providing the interface between external clients and the application. This layer is responsible for API endpoints, request validation, and response formatting.

## 🎯 Purpose

- Exposes HTTP endpoints for client applications
- Handles request validation and transformation
- Formats responses for API consumption
- Implements security concerns (authentication, authorization)
- Provides API documentation through Swagger/OpenAPI
- Manages HTTP-specific concerns (status codes, headers)

## 📁 Structure

```
presentation/
└── controllers/
    ├── template-read.controller.ts    # Query operations (GET)
    └── template-write.controller.ts   # Command operations (POST, PUT, DELETE)
```

## 🔄 CQRS in Controllers

This layer separates **read** and **write** operations into different controllers following CQRS principles:

### Write Controller (Commands)
Handles operations that modify state:

```typescript
@ApiTags('templates')
@ApiBearerAuth('access-token')
@Controller('templates')
export class TemplateWriteController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @ApiOperation({ summary: 'Create a new template' })
  @ApiResponse({ 
    status: 201, 
    description: 'Template created successfully',
    type: TemplateResponseDto 
  })
  @Roles('user', 'admin')
  async create(
    @Body() createTemplateDto: CreateTemplateDto,
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<TemplateResponseDto> {
    return this.commandBus.execute(
      new CreateTemplateCommand(createTemplateDto, tenantId, user.sub)
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update template' })
  @Roles('user', 'admin')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTemplateDto: UpdateTemplateDto,
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<TemplateResponseDto> {
    return this.commandBus.execute(
      new UpdateTemplateCommand(id, updateTemplateDto, tenantId, user.sub)
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete template' })
  @Roles('admin')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<void> {
    return this.commandBus.execute(
      new DeleteTemplateCommand(id, tenantId, user.sub)
    );
  }
}
```

### Read Controller (Queries)
Handles operations that retrieve data:

```typescript
@ApiTags('templates')
@ApiBearerAuth('access-token')
@Controller('templates')
export class TemplateReadController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @ApiOperation({ summary: 'Get all templates' })
  @ApiResponse({ 
    status: 200, 
    description: 'Templates retrieved successfully',
    type: [TemplateResponseDto] 
  })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiQuery({ name: 'tags', required: false, type: [String] })
  @Roles('user', 'admin')
  async findAll(
    @CurrentTenant() tenantId: string,
    @Query('isActive') isActive?: boolean,
    @Query('tags') tags?: string[],
  ): Promise<TemplateResponseDto[]> {
    return this.queryBus.execute(
      new GetTemplatesQuery(tenantId, isActive, tags)
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get template by ID' })
  @Roles('user', 'admin')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentTenant() tenantId: string,
  ): Promise<TemplateResponseDto> {
    return this.queryBus.execute(
      new GetTemplateQuery(id, tenantId)
    );
  }
}
```

## 📝 Responsibilities

### ✅ What This Layer Does
- **HTTP request handling** - Process incoming HTTP requests
- **Input validation** - Validate request parameters and body
- **Authentication/Authorization** - Verify user permissions
- **Response formatting** - Format data for API responses
- **Error handling** - Convert exceptions to HTTP error responses
- **API documentation** - Provide Swagger/OpenAPI documentation
- **Tenant isolation** - Ensure multi-tenant security
- **Parameter parsing** - Extract and validate URL parameters

### ❌ What This Layer Doesn't Do
- **Business logic** - Delegates to application layer
- **Data persistence** - Uses application layer for data operations
- **Domain rules** - Enforced in domain entities
- **External API calls** - Handled by infrastructure layer

## 🛡️ Security Features

### Authentication
```typescript
@ApiBearerAuth('access-token')  // Requires JWT token
@Controller('templates')
export class TemplateController {
  // All endpoints require authentication
}
```

### Authorization
```typescript
@Roles('user', 'admin')  // Role-based access control
async create(@CurrentUser() user: JwtPayload) {
  // Only users with 'user' or 'admin' roles can access
}

@Roles('admin')  // Admin-only endpoint
async delete() {
  // Only admin users can delete
}
```

### Multi-Tenancy
```typescript
async findAll(@CurrentTenant() tenantId: string) {
  // Automatic tenant isolation
  // User can only see data from their tenant
}
```

## 🔄 Request/Response Flow

```
HTTP Request → Validation → Authentication → Authorization → Command/Query → Response
     ↓             ↓              ↓              ↓              ↓            ↓
  Raw Data    DTO Validation   JWT Check    Role Check    Business Logic  Format Data
```

## 📊 API Documentation

### Swagger Decorators
```typescript
@ApiTags('templates')                    // Groups endpoints in documentation
@ApiOperation({ summary: 'Create template' })  // Endpoint description
@ApiResponse({                           // Response documentation
  status: 201,
  description: 'Template created successfully',
  type: TemplateResponseDto
})
@ApiParam({                              // Parameter documentation
  name: 'id',
  description: 'Template ID',
  type: 'string'
})
@ApiQuery({                              // Query parameter documentation
  name: 'isActive',
  required: false,
  type: Boolean
})
```

### Example API Documentation Output
```yaml
/templates:
  get:
    tags:
      - templates
    summary: Get all templates
    parameters:
      - name: isActive
        in: query
        required: false
        schema:
          type: boolean
    responses:
      200:
        description: Templates retrieved successfully
        content:
          application/json:
            schema:
              type: array
              items:
                $ref: '#/components/schemas/TemplateResponseDto'
```

## 🧪 Testing

### Controller Unit Testing
```typescript
describe('TemplateWriteController', () => {
  let controller: TemplateWriteController;
  let commandBus: CommandBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TemplateWriteController],
      providers: [
        {
          provide: CommandBus,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TemplateWriteController>(TemplateWriteController);
    commandBus = module.get<CommandBus>(CommandBus);
  });

  describe('create', () => {
    it('should create template', async () => {
      // Arrange
      const createDto: CreateTemplateDto = {
        name: 'Test Template',
        description: 'Test Description',
        tags: ['test'],
      };
      const user = { sub: 'user-1' } as JwtPayload;
      const tenantId = 'tenant-1';
      
      const expectedResult = { id: 'template-1', name: 'Test Template' };
      jest.spyOn(commandBus, 'execute').mockResolvedValue(expectedResult);

      // Act
      const result = await controller.create(createDto, tenantId, user);

      // Assert
      expect(commandBus.execute).toHaveBeenCalledWith(
        expect.any(CreateTemplateCommand)
      );
      expect(result).toEqual(expectedResult);
    });

    it('should handle validation errors', async () => {
      // Test validation error handling
    });
  });
});
```

### E2E Testing
```typescript
describe('Templates API (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    
    // Get authentication token
    authToken = await getAuthToken();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/templates (POST)', () => {
    it('should create template', () => {
      return request(app.getHttpServer())
        .post('/templates')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Template',
          description: 'Test Description',
          tags: ['test'],
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe('Test Template');
        });
    });

    it('should reject invalid data', () => {
      return request(app.getHttpServer())
        .post('/templates')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: '', // Invalid empty name
        })
        .expect(400);
    });

    it('should reject unauthorized requests', () => {
      return request(app.getHttpServer())
        .post('/templates')
        .send({
          name: 'Test Template',
        })
        .expect(401);
    });
  });
});
```

## 🔗 Dependencies

### Inward Dependencies (From)
- **External clients** - HTTP requests from frontend, mobile apps, other services

### Outward Dependencies (To)
- **Application Layer** - Commands and queries via CQRS buses
- **Common Layer** - Decorators, guards, pipes for cross-cutting concerns

## 📋 Best Practices

1. **Thin controllers** - Delegate business logic to application layer
2. **Use DTOs** - Validate input and format output
3. **Separate read/write** - Follow CQRS pattern
4. **Document APIs** - Use Swagger decorators
5. **Handle errors gracefully** - Use global exception filters
6. **Validate input** - Use class-validator decorators
7. **Secure endpoints** - Apply authentication and authorization
8. **Use proper HTTP status codes** - Follow REST conventions

## 🚀 Adding New Endpoints

### Adding a New Command Endpoint
```typescript
@Post('bulk')
@ApiOperation({ summary: 'Create multiple templates' })
@Roles('admin')
async createBulk(
  @Body() createBulkDto: CreateBulkTemplatesDto,
  @CurrentTenant() tenantId: string,
  @CurrentUser() user: JwtPayload,
): Promise<TemplateResponseDto[]> {
  return this.commandBus.execute(
    new CreateBulkTemplatesCommand(createBulkDto, tenantId, user.sub)
  );
}
```

### Adding a New Query Endpoint
```typescript
@Get('search')
@ApiOperation({ summary: 'Search templates' })
@ApiQuery({ name: 'q', description: 'Search query' })
@ApiQuery({ name: 'limit', required: false, type: Number })
@Roles('user', 'admin')
async search(
  @Query('q') query: string,
  @Query('limit') limit?: number,
  @CurrentTenant() tenantId: string,
): Promise<TemplateResponseDto[]> {
  return this.queryBus.execute(
    new SearchTemplatesQuery(query, tenantId, limit)
  );
}
```

## 🎯 HTTP Status Codes

### Standard Response Codes
- **200 OK** - Successful GET requests
- **201 Created** - Successful POST requests
- **204 No Content** - Successful DELETE requests
- **400 Bad Request** - Validation errors
- **401 Unauthorized** - Missing or invalid authentication
- **403 Forbidden** - Insufficient permissions
- **404 Not Found** - Resource not found
- **422 Unprocessable Entity** - Business rule violations
- **500 Internal Server Error** - Unexpected errors

### Custom Error Responses
```typescript
{
  "statusCode": 400,
  "message": [
    "name should not be empty",
    "tags must be an array"
  ],
  "error": "Bad Request",
  "timestamp": "2023-12-01T10:00:00.000Z",
  "path": "/templates"
}
```

## 🔄 Response Caching

### Cache Control Headers
```typescript
@Get(':id')
@Header('Cache-Control', 'public, max-age=300') // 5 minutes
async findOne(@Param('id') id: string) {
  // Implementation
}
```

### Conditional Requests
```typescript
@Get(':id')
async findOne(
  @Param('id') id: string,
  @Headers('if-none-match') etag?: string,
) {
  const template = await this.queryBus.execute(new GetTemplateQuery(id));
  
  // Set ETag header for caching
  const responseETag = generateETag(template);
  
  if (etag === responseETag) {
    throw new NotModifiedException();
  }
  
  return template;
}
```

This presentation layer provides a clean, secure, and well-documented API interface while keeping the controllers focused on HTTP concerns and delegating business logic to appropriate layers.