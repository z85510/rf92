# Infrastructure Layer

The **Infrastructure Layer** handles all external concerns and provides implementations for the interfaces defined in the domain layer. This layer is responsible for persistence, messaging, external APIs, and other technical concerns.

## 🎯 Purpose

- Implements repository interfaces defined in the domain layer
- Handles external communication (databases, message queues, APIs)
- Provides concrete implementations for abstract dependencies
- Manages technical concerns like caching, logging, and monitoring
- Bridges the gap between domain logic and external systems

## 📁 Structure

```
infrastructure/
├── messaging/                 # Event publishing and message handling
│   └── template.kafka-producer.ts
├── repositories/             # Repository implementations
│   └── prisma-template.repository.ts
└── websocket/               # Real-time communication
    └── template-websocket.gateway.ts
```

## 🔌 Adapter Pattern

This layer implements the **Adapter Pattern** to connect domain interfaces with external systems:

### Repository Implementation
```typescript
@Injectable()
export class PrismaTemplateRepository implements TemplateRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string, tenantId: string): Promise<Template | null> {
    // 1. Query database using Prisma
    const templateData = await this.prisma.template.findFirst({
      where: { id, tenantId },
    });

    if (!templateData) {
      return null;
    }

    // 2. Convert database model to domain entity
    return this.mapToDomain(templateData);
  }

  async save(template: Template): Promise<void> {
    // Convert domain entity to database model and save
    await this.prisma.template.upsert({
      where: { id: template.id },
      update: {
        name: template.name,
        description: template.description,
        // ... other fields
      },
      create: {
        id: template.id,
        name: template.name,
        // ... all fields for creation
      },
    });
  }

  private mapToDomain(templateData: any): Template {
    // Convert database record to domain entity
    const template = Object.create(Template.prototype);
    Object.assign(template, {
      id: templateData.id,
      name: templateData.name,
      // ... map all properties
    });
    return template;
  }
}
```

### Message Producer
```typescript
@Injectable()
export class TemplateKafkaProducer {
  constructor(private readonly kafkaService: KafkaService) {}

  async publishTemplateCreated(template: Template): Promise<void> {
    const message = {
      key: template.id,
      value: {
        eventType: 'template.created',
        templateId: template.id,
        tenantId: template.tenantId,
        name: template.name,
        createdBy: template.createdBy,
        timestamp: new Date().toISOString(),
      },
    };

    await this.kafkaService.publish('template-events', message);
  }
}
```

### WebSocket Gateway
```typescript
@Injectable()
@WebSocketGateway({
  namespace: '/templates',
  cors: { origin: '*' },
})
export class TemplateWebSocketGateway {
  @WebSocketServer()
  server: Server;

  notifyTemplateCreated(templateId: string, tenantId: string): void {
    this.server.to(`tenant:${tenantId}`).emit('template:created', {
      templateId,
      timestamp: new Date().toISOString(),
    });
  }
}
```

## 📝 Responsibilities

### ✅ What This Layer Does
- **Implements repository interfaces** from the domain layer
- **Handles database operations** using ORMs like Prisma
- **Publishes domain events** to message queues
- **Manages external API calls** and integrations
- **Provides caching mechanisms** for performance
- **Handles file storage** and blob operations
- **Implements real-time communication** via WebSockets
- **Manages configuration** and environment variables

### ❌ What This Layer Doesn't Do
- **Contains business logic** (that belongs in domain/application)
- **Makes business decisions** (delegates to domain entities)
- **Handles HTTP requests** (that's presentation layer)
- **Defines domain rules** (that's domain layer)

## 🗄️ Data Mapping

### Database to Domain Mapping
```typescript
private mapToDomain(templateData: any): Template {
  // Handle the private constructor by using Object.create
  const template = Object.create(Template.prototype);
  
  // Map database fields to domain properties
  Object.assign(template, {
    id: templateData.id,
    name: templateData.name,
    description: templateData.description,
    tags: templateData.tags || [],
    isActive: templateData.isActive,
    tenantId: templateData.tenantId,
    createdBy: templateData.createdBy,
    createdAt: templateData.createdAt,
    updatedAt: templateData.updatedAt,
    updatedBy: templateData.updatedBy,
  });
  
  return template;
}
```

### Domain to Database Mapping
```typescript
private mapToDatabase(template: Template) {
  return {
    id: template.id,
    name: template.name,
    description: template.description,
    tags: template.tags,
    isActive: template.isActive,
    tenantId: template.tenantId,
    createdBy: template.createdBy,
    createdAt: template.createdAt,
    updatedAt: template.updatedAt,
    updatedBy: template.updatedBy,
  };
}
```

## 🔄 Event Publishing

### Domain Event Handling
```typescript
@Injectable()
export class TemplateEventHandler {
  constructor(private readonly producer: TemplateKafkaProducer) {}

  async handleTemplateCreated(template: Template): Promise<void> {
    // Publish to multiple channels if needed
    await Promise.all([
      this.producer.publishTemplateCreated(template),
      this.notifyAnalytics(template),
      this.updateSearchIndex(template),
    ]);
  }

  private async notifyAnalytics(template: Template): Promise<void> {
    // Send analytics event
  }

  private async updateSearchIndex(template: Template): Promise<void> {
    // Update search engine index
  }
}
```

## 🧪 Testing

### Repository Testing
```typescript
describe('PrismaTemplateRepository', () => {
  let repository: PrismaTemplateRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PrismaTemplateRepository,
        {
          provide: PrismaService,
          useValue: createMock<PrismaService>(),
        },
      ],
    }).compile();

    repository = module.get<PrismaTemplateRepository>(PrismaTemplateRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('findById', () => {
    it('should return template when found', async () => {
      // Arrange
      const templateData = {
        id: 'test-id',
        name: 'Test Template',
        // ... other fields
      };
      
      jest.spyOn(prismaService.template, 'findFirst')
        .mockResolvedValue(templateData as any);

      // Act
      const result = await repository.findById('test-id', 'tenant-1');

      // Assert
      expect(result).toBeInstanceOf(Template);
      expect(result?.id).toBe('test-id');
    });

    it('should return null when not found', async () => {
      // Arrange
      jest.spyOn(prismaService.template, 'findFirst')
        .mockResolvedValue(null);

      // Act
      const result = await repository.findById('test-id', 'tenant-1');

      // Assert
      expect(result).toBeNull();
    });
  });
});
```

### Integration Testing
```typescript
describe('Template Repository Integration', () => {
  let repository: PrismaTemplateRepository;
  let prisma: PrismaService;

  beforeAll(async () => {
    // Set up test database
    prisma = new PrismaService();
    await prisma.$connect();
    repository = new PrismaTemplateRepository(prisma);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Clean database before each test
    await prisma.template.deleteMany();
  });

  it('should save and retrieve template', async () => {
    // Arrange
    const template = Template.create(
      'test-id',
      'Test Template',
      'Description',
      ['tag1'],
      'tenant-1',
      'user-1'
    );

    // Act
    await repository.save(template);
    const retrieved = await repository.findById('test-id', 'tenant-1');

    // Assert
    expect(retrieved).toBeDefined();
    expect(retrieved?.name).toBe('Test Template');
  });
});
```

## 🔗 Dependencies

### Inward Dependencies (From)
- **Application Layer**: Handlers use repository implementations
- **Domain Layer**: Implements repository interfaces

### Outward Dependencies (To)
- **External databases** (PostgreSQL via Prisma)
- **Message queues** (Kafka)
- **External APIs** (third-party services)
- **File storage** (AWS S3, local filesystem)
- **Caching systems** (Redis)

## 📋 Best Practices

1. **Implement interfaces faithfully** - Don't add extra behavior
2. **Handle errors gracefully** - Convert technical errors to domain exceptions
3. **Use dependency injection** - Make dependencies explicit
4. **Separate concerns** - Keep persistence separate from business logic
5. **Map data carefully** - Ensure proper conversion between layers
6. **Handle transactions** - Use database transactions for consistency
7. **Test thoroughly** - Both unit and integration tests
8. **Log appropriately** - Log technical concerns, not business logic

## 🚀 Adding New Infrastructure

### Adding a New Repository Method
```typescript
// 1. Add to domain interface
export interface TemplateRepository {
  // ... existing methods
  findByCustomCriteria(criteria: CustomCriteria): Promise<Template[]>;
}

// 2. Implement in infrastructure
async findByCustomCriteria(criteria: CustomCriteria): Promise<Template[]> {
  const templates = await this.prisma.template.findMany({
    where: {
      // Convert criteria to Prisma query
    },
  });

  return templates.map(t => this.mapToDomain(t));
}
```

### Adding a New Event Publisher
```typescript
@Injectable()
export class NewEventPublisher {
  constructor(private readonly kafkaService: KafkaService) {}

  async publishNewEvent(data: EventData): Promise<void> {
    const message = {
      key: data.id,
      value: {
        eventType: 'new.event',
        data,
        timestamp: new Date().toISOString(),
      },
    };

    await this.kafkaService.publish('new-events', message);
  }
}
```

### Adding External API Integration
```typescript
@Injectable()
export class ExternalApiService {
  constructor(private readonly httpService: HttpService) {}

  async callExternalApi(data: ApiRequest): Promise<ApiResponse> {
    try {
      const response = await this.httpService
        .post('/api/external', data)
        .toPromise();
      
      return response.data;
    } catch (error) {
      // Convert technical error to domain exception
      throw new DomainException('External API call failed');
    }
  }
}
```

## 🔧 Configuration

### Environment Variables
```typescript
@Injectable()
export class InfrastructureConfig {
  @IsString()
  @IsNotEmpty()
  DATABASE_URL: string;

  @IsString()
  @IsNotEmpty()
  KAFKA_BROKERS: string;

  @IsString()
  @IsOptional()
  REDIS_URL?: string;
}
```

### Database Configuration
```typescript
@Module({
  imports: [
    PrismaModule,
    KafkaModule.forRoot({
      brokers: [process.env.KAFKA_BROKERS],
    }),
    RedisModule.forRoot({
      url: process.env.REDIS_URL,
    }),
  ],
  providers: [
    PrismaTemplateRepository,
    TemplateKafkaProducer,
    TemplateWebSocketGateway,
  ],
  exports: [
    PrismaTemplateRepository,
    TemplateKafkaProducer,
  ],
})
export class TemplateInfrastructureModule {}
```

## 🔄 Performance Considerations

### Caching Strategy
```typescript
@Injectable()
export class CachedTemplateRepository implements TemplateRepository {
  constructor(
    private readonly baseRepository: PrismaTemplateRepository,
    private readonly cacheService: CacheService,
  ) {}

  async findById(id: string, tenantId: string): Promise<Template | null> {
    const cacheKey = `template:${tenantId}:${id}`;
    
    // Check cache first
    const cached = await this.cacheService.get(cacheKey);
    if (cached) {
      return this.deserializeFromCache(cached);
    }

    // Fallback to database
    const template = await this.baseRepository.findById(id, tenantId);
    
    if (template) {
      await this.cacheService.set(cacheKey, this.serializeForCache(template));
    }

    return template;
  }
}
```

### Batch Operations
```typescript
async saveMany(templates: Template[]): Promise<void> {
  // Use database transaction for batch operations
  await this.prisma.$transaction(
    templates.map(template => 
      this.prisma.template.upsert({
        where: { id: template.id },
        update: this.mapToDatabase(template),
        create: this.mapToDatabase(template),
      })
    )
  );
}
```

This infrastructure layer provides the foundation for all external interactions while keeping the domain and application layers clean and focused on business logic.