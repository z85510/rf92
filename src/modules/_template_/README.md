# Template Module

This is a template module that follows **Clean Architecture** principles. Use this as a reference or starting point for creating new modules in the application.

## 🏗️ Clean Architecture Structure

This module is organized into the following layers, each with specific responsibilities:

```
_template_/
├── 📦 application/          # Application Layer - Use cases and business logic
│   ├── commands/           # Commands (write operations)
│   ├── handlers/           # Command and Query handlers
│   └── queries/            # Queries (read operations)
├── 🎯 domain/              # Domain Layer - Business entities and rules
│   ├── entities/           # Domain entities (business objects)
│   ├── repositories/       # Repository interfaces (contracts)
│   └── value-objects/      # Value objects for domain validation
├── 🔧 infrastructure/      # Infrastructure Layer - External concerns
│   ├── messaging/          # Event publishing (Kafka)
│   ├── repositories/       # Repository implementations (Prisma)
│   └── websocket/          # WebSocket gateways
├── 🎨 presentation/        # Presentation Layer - API controllers
│   └── controllers/        # HTTP controllers (read/write separated)
├── 📝 dto/                 # Data Transfer Objects
└── template.module.ts      # NestJS module configuration
```

## � Architecture Principles

### 1. **Dependency Inversion**
- High-level modules don't depend on low-level modules
- Both depend on abstractions (interfaces)
- Repository pattern with dependency injection

### 2. **Separation of Concerns**
- Each layer has a single responsibility
- Clear boundaries between layers
- Controllers handle HTTP, handlers handle business logic

### 3. **CQRS (Command Query Responsibility Segregation)**
- Commands for write operations (create, update, delete)
- Queries for read operations (get, list)
- Separate handlers for each operation

### 4. **Domain-Driven Design**
- Rich domain entities with business logic
- Value objects for validation
- Repository interfaces define contracts

## 🚀 Usage

### Creating a New Module

Use the generation script to create a new module based on this template:

```bash
npm run generate:module your-module-name
```

This will:
- Copy the entire clean architecture structure
- Replace all template references with your module name
- Set up all necessary files and dependencies

### Manual Steps After Generation

1. **Add to App Module**:
```typescript
import { YourModuleModule } from './modules/your-module/your-module.module';

@Module({
  imports: [
    // ... other modules
    YourModuleModule,
  ],
})
export class AppModule {}
```

2. **Update Prisma Schema**:
Add your entity model to `prisma/schema.prisma`

3. **Generate Prisma Client**:
```bash
npx prisma generate && npx prisma db push
```

## 📚 Layer Documentation

Each layer has its own README with detailed information:

- [Application Layer](./application/README.md) - Commands, queries, and handlers
- [Domain Layer](./domain/README.md) - Entities, repositories, and value objects
- [Infrastructure Layer](./infrastructure/README.md) - External dependencies
- [Presentation Layer](./presentation/README.md) - HTTP controllers
- [DTOs](./dto/README.md) - Data transfer objects

## 🧪 Testing

Each layer should be tested independently:

- **Domain**: Unit tests for entities and value objects
- **Application**: Unit tests for handlers with mocked dependencies
- **Infrastructure**: Integration tests with real databases
- **Presentation**: E2E tests for HTTP endpoints

## 🔄 Data Flow

```
HTTP Request → Controller → Command/Query → Handler → Repository → Database
                ↓             ↓             ↓           ↓
            Validation    Business Logic  Domain     Data Access
```

## 📖 Best Practices

1. **Keep entities rich** - Put business logic in domain entities
2. **Use value objects** - For validation and type safety
3. **Thin controllers** - Only handle HTTP concerns
4. **Single responsibility** - Each handler does one thing
5. **Interface segregation** - Small, focused interfaces
6. **Dependency injection** - Use IoC container for dependencies

## 🔗 Related Documentation

- [Clean Architecture Overview](../../../docs/ARCHITECTURE.md)
- [Project Testing Guidelines](../../../docs/TESTING.md)
- [API Documentation](../../../docs/API.md)