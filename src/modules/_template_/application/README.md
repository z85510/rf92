# Application Layer

The **Application Layer** contains the use cases and business logic of the template module. This layer orchestrates the domain objects to fulfill business requirements.

## 🎯 Purpose

- Implements use cases and application-specific business rules
- Coordinates domain entities to fulfill requests
- Handles cross-cutting concerns like transactions and events
- Provides the interface between presentation and domain layers

## 📁 Structure

```
application/
├── commands/               # Write operations (CUD - Create, Update, Delete)
│   ├── create-template.command.ts
│   ├── update-template.command.ts
│   └── delete-template.command.ts
├── queries/               # Read operations (R - Read)
│   └── get-template.query.ts
└── handlers/              # Business logic implementations
    ├── create-template.handler.ts
    ├── update-template.handler.ts
    ├── delete-template.handler.ts
    └── get-template.handler.ts
```

## 🔄 CQRS Pattern

This layer implements the **Command Query Responsibility Segregation (CQRS)** pattern:

### Commands (Write Operations)
Commands represent intentions to change state:

```typescript
export class CreateTemplateCommand {
  constructor(
    public readonly data: CreateTemplateDto,
    public readonly tenantId: string,
    public readonly userId: string,
  ) {}
}
```

**Characteristics:**
- Immutable data structures
- Express intent (what should happen)
- Contain all necessary data for the operation
- No return values (except success/failure)

### Queries (Read Operations)
Queries represent requests for data:

```typescript
export class GetTemplateQuery {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
  ) {}
}
```

**Characteristics:**
- Immutable data structures
- Express information needs
- Can have parameters for filtering/pagination
- Return data without side effects

## 🛠️ Handlers

Handlers implement the actual business logic:

### Command Handlers
```typescript
@CommandHandler(CreateTemplateCommand)
export class CreateTemplateHandler implements ICommandHandler<CreateTemplateCommand> {
  constructor(
    @Inject(TEMPLATE_REPOSITORY) private repo: TemplateRepository,
    private producer: TemplateKafkaProducer,
  ) {}

  async execute(cmd: CreateTemplateCommand) {
    // 1. Create domain entity
    const template = Template.create(/*...*/);
    
    // 2. Persist to repository
    await this.repo.save(template);
    
    // 3. Publish domain events
    await this.producer.publishTemplateCreated(template);
    
    // 4. Return response
    return /* response DTO */;
  }
}
```

### Query Handlers
```typescript
@QueryHandler(GetTemplateQuery)
export class GetTemplateHandler implements IQueryHandler<GetTemplateQuery> {
  constructor(
    @Inject(TEMPLATE_REPOSITORY) private repo: TemplateRepository,
  ) {}

  async execute(query: GetTemplateQuery) {
    // 1. Fetch from repository
    const template = await this.repo.findById(query.id, query.tenantId);
    
    // 2. Handle not found
    if (!template) {
      throw new NotFoundException(/*...*/);
    }
    
    // 3. Return response DTO
    return /* response DTO */;
  }
}
```

## 📝 Responsibilities

### ✅ What This Layer Does
- **Orchestrates domain objects** to fulfill use cases
- **Validates business rules** and invariants
- **Handles transactions** and data consistency
- **Publishes domain events** for integration
- **Converts between DTOs and domain objects**
- **Implements cross-cutting concerns** (logging, security)

### ❌ What This Layer Doesn't Do
- **Direct database access** (uses repository interfaces)
- **HTTP request/response handling** (controllers do this)
- **Domain logic** (entities contain this)
- **Infrastructure concerns** (messaging, external APIs)

## 🔄 Data Flow

```
Controller → Command/Query → Handler → Repository → Domain Entity
    ↓             ↓            ↓           ↓            ↓
Validation   Intent       Business    Data Access   Business
             Expression   Logic       Layer         Rules
```

## 🧪 Testing

### Unit Testing Handlers
```typescript
describe('CreateTemplateHandler', () => {
  let handler: CreateTemplateHandler;
  let mockRepository: jest.Mocked<TemplateRepository>;
  let mockProducer: jest.Mocked<TemplateKafkaProducer>;

  beforeEach(() => {
    mockRepository = createMock<TemplateRepository>();
    mockProducer = createMock<TemplateKafkaProducer>();
    handler = new CreateTemplateHandler(mockRepository, mockProducer);
  });

  it('should create and save template', async () => {
    // Arrange
    const command = new CreateTemplateCommand(/*...*/);
    
    // Act
    const result = await handler.execute(command);
    
    // Assert
    expect(mockRepository.save).toHaveBeenCalledWith(expect.any(Template));
    expect(mockProducer.publishTemplateCreated).toHaveBeenCalled();
    expect(result).toEqual(expect.objectContaining({/*...*/}));
  });
});
```

## 🔗 Dependencies

### Inward Dependencies (From)
- **Presentation Layer**: Controllers send commands/queries
- **Infrastructure Layer**: Called via dependency injection

### Outward Dependencies (To)
- **Domain Layer**: Uses entities, repositories, value objects
- **Infrastructure Layer**: Repository implementations, messaging

## 📋 Best Practices

1. **Keep handlers focused** - One responsibility per handler
2. **Use dependency injection** - Don't create dependencies directly
3. **Handle errors appropriately** - Domain exceptions vs. application exceptions
4. **Publish events** - For integration with other bounded contexts
5. **Return DTOs** - Don't expose domain entities to controllers
6. **Validate commands** - Use DTOs with validation decorators
7. **Use transactions** - For operations that span multiple aggregates

## 🚀 Adding New Operations

To add a new operation:

1. **Create Command/Query**:
```typescript
export class NewOperationCommand {
  constructor(public readonly data: SomeDto) {}
}
```

2. **Create Handler**:
```typescript
@CommandHandler(NewOperationCommand)
export class NewOperationHandler implements ICommandHandler<NewOperationCommand> {
  // Implementation
}
```

3. **Register in Module**:
```typescript
@Module({
  providers: [
    // ... existing handlers
    NewOperationHandler,
  ],
})
export class TemplateModule {}
```

4. **Use in Controller**:
```typescript
@Post('new-operation')
async newOperation(@Body() dto: SomeDto) {
  return this.commandBus.execute(new NewOperationCommand(dto));
}
```