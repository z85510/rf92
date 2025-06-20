# 🚀 Enterprise NestJS Application

A production-ready, enterprise-grade **NestJS application** built with **Clean Architecture**, **CQRS pattern**, **Multi-tenancy**, and comprehensive **testing** and **documentation**.

## � Key Features

- ✅ **Clean Architecture** with Domain-Driven Design (DDD)
- ✅ **CQRS Pattern** with separate read/write operations
- ✅ **Multi-tenancy** with automatic tenant isolation
- ✅ **JWT Authentication** & Role-based authorization
- ✅ **Event-driven Architecture** with Kafka
- ✅ **Real-time Communication** with WebSockets
- ✅ **Comprehensive Testing** (Unit, Integration, E2E)
- ✅ **API Documentation** with Swagger
- ✅ **Database Management** with Prisma ORM
- ✅ **Structured Logging** with context
- ✅ **Docker Support** for easy deployment
- ✅ **Module Generation** for rapid development

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Architecture](#-architecture)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Development Guide](#-development-guide)
- [Deployment](#-deployment)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Docker & Docker Compose
- PostgreSQL (via Docker)

### 1. Environment Setup

```bash
# Clone the repository
git clone <repository-url>
cd nestjs-enterprise-app

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

### 2. Start Infrastructure

```bash
# Start PostgreSQL and Kafka
docker-compose up -d

# Wait for services to be ready (about 30 seconds)
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Apply database schema
npm run db:push

# (Optional) Open Prisma Studio
npm run db:studio
```

### 4. Start Application

```bash
# Development mode with hot reload
npm run start:dev

# Production mode
npm run start:prod
```

The application will be available at:
- **API**: http://localhost:3000
- **Swagger Docs**: http://localhost:3000/api/docs
- **WebSocket Test**: Open `websocket-test.html` in browser

## 🏗️ Project Structure

```
src/
├── common/                     # Shared utilities & infrastructure
│   ├── decorators/            # @CurrentUser, @CurrentTenant, @Roles, @Public
│   ├── guards/                # JWT authentication & tenant guards
│   ├── interceptors/          # Logging, transformation interceptors
│   ├── filters/               # Global exception filters
│   ├── pipes/                 # Validation pipes
│   └── services/              # Logger, tenant services
├── config/                     # Environment configuration
├── infrastructure/            # External services & adapters
│   ├── database/              # Prisma configuration
│   ├── kafka/                 # Event messaging
│   ├── logger/                # Structured logging
│   └── websocket/             # Real-time communication
├── modules/                    # Feature modules
│   ├── users/                 # User management (example)
│   │   ├── application/       # CQRS handlers & commands
│   │   ├── domain/            # Entities, repositories, value objects
│   │   ├── infrastructure/    # Prisma repos, Kafka producers
│   │   ├── presentation/      # Controllers & DTOs
│   │   └── dto/               # Data transfer objects
│   ├── products/              # Product management
│   └── _template_/            # Module template for generation
├── app.module.ts              # Main application module
└── main.ts                    # Application bootstrap
```

## 🎯 Architecture

This application follows **Clean Architecture** principles with clear separation of concerns:

### 📐 Architectural Layers

1. **Presentation Layer** (`presentation/`)
   - Controllers (API endpoints)
   - DTOs (Data validation)
   - WebSocket gateways

2. **Application Layer** (`application/`)
   - CQRS Commands & Queries
   - Command & Query Handlers
   - Application services

3. **Domain Layer** (`domain/`)
   - Business entities
   - Domain repositories (interfaces)
   - Value objects
   - Business logic

4. **Infrastructure Layer** (`infrastructure/`)
   - Database repositories (Prisma)
   - External service integrations
   - Event publishers (Kafka)

### 🔄 CQRS Pattern

Commands and Queries are separated for better scalability:

```typescript
// Command Example (Write Operation)
@Post()
async createUser(@Body() dto: CreateUserDto) {
  return this.commandBus.execute(new CreateUserCommand(dto));
}

// Query Example (Read Operation) 
@Get(':id')
async getUser(@Param('id') id: string) {
  return this.queryBus.execute(new GetUserQuery(id));
}
```

### 🏢 Multi-tenancy

Automatic tenant isolation in all operations:

```typescript
@Get()
async getUsers(@CurrentTenant() tenantId: string) {
  return this.queryBus.execute(new GetUsersQuery(tenantId));
}
```

## 📚 API Documentation

### Authentication

```bash
# All protected endpoints require JWT token
Authorization: Bearer <your-jwt-token>
```

### Core Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Welcome message | ❌ |
| GET | `/health` | Health check | ❌ |
| GET | `/api/docs` | Swagger documentation | ❌ |
| POST | `/users` | Create user | ✅ |
| GET | `/users/:id` | Get user by ID | ✅ |
| GET | `/products` | List products | ✅ |
| POST | `/products` | Create product | ✅ |

### Example API Usage

```bash
# Create a user
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "email": "john@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'

# Get user by ID
curl -X GET http://localhost:3000/users/123 \
  -H "Authorization: Bearer <token>"
```

## 🧪 Testing

We maintain **high test coverage** with multiple testing strategies:

### Running Tests

```bash
# Unit tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:cov

# E2E tests
npm run test:e2e

# Debug tests
npm run test:debug
```

### Test Structure

```
src/
├── **/*.spec.ts          # Unit tests
test/
├── **/*.e2e-spec.ts     # End-to-end tests
├── jest-e2e.json        # E2E test configuration
└── test-utils.ts        # Testing utilities
```

### Test Examples

**Unit Test:**
```typescript
describe('CreateUserHandler', () => {
  it('should create a user successfully', async () => {
    // Arrange
    const command = new CreateUserCommand(mockUserData);
    
    // Act
    const result = await handler.execute(command);
    
    // Assert
    expect(result).toEqual({ id: expect.any(String), email: mockUserData.email });
  });
});
```

**E2E Test:**
```typescript
it('/users (POST) - should create a new user', () => {
  return request(app.getHttpServer())
    .post('/users')
    .send(createUserDto)
    .expect(201)
    .expect((res) => {
      expect(res.body).toHaveProperty('id');
    });
});
```

## 👨‍💻 Development Guide

### Adding New Features

1. **Generate Module** (Recommended):
```bash
npm run generate:module orders
```

2. **Manual Module Creation**:
```bash
# Create module structure
mkdir -p src/modules/orders/{application,domain,infrastructure,presentation}

# Follow the existing patterns in users module
```

### Module Template

Each generated module includes:

- ✅ **Controllers** - Separate read/write endpoints
- ✅ **DTOs** - Input/output validation
- ✅ **CQRS** - Commands, queries, and handlers
- ✅ **Domain** - Entities and repositories
- ✅ **Infrastructure** - Database and messaging
- ✅ **Tests** - Comprehensive test coverage

### Security Best Practices

**Authentication:**
```typescript
@UseGuards(JwtAuthGuard)
@Get('protected')
getProtectedData(@CurrentUser() user: JwtPayload) {
  return { user };
}
```

**Authorization:**
```typescript
@Roles('admin', 'manager')
@Delete(':id')
deleteItem(@Param('id') id: string) {
  // Only admins and managers can delete
}
```

**Public Routes:**
```typescript
@Public()
@Get('public-data')
getPublicData() {
  return { data: 'Available to everyone' };
}
```

### Database Operations

**Repository Pattern:**
```typescript
@Injectable()
export class PrismaUserRepository implements UserRepository {
  async save(user: User): Promise<void> {
    await this.prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        // ... other fields
      },
    });
  }
}
```

### Event-Driven Architecture

**Publishing Events:**
```typescript
@Injectable()
export class UserKafkaProducer {
  async publishUserCreated(user: User): Promise<void> {
    await this.producer.send({
      topic: 'user.created',
      messages: [{ value: JSON.stringify(user) }],
    });
  }
}
```

## � Deployment

### Docker Deployment

```bash
# Build application image
docker build -t nestjs-app .

# Run with docker-compose
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Variables

```env
# Application
NODE_ENV=production
PORT=3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/db

# JWT
JWT_SECRET=your-super-secret-key

# Kafka
KAFKA_BROKERS=localhost:9092
KAFKA_CLIENT_ID=nestjs-app
```

## 🔧 Monitoring & Observability

### Health Checks

- **Application Health**: `GET /health`
- **Database Health**: Included in health endpoint
- **Kafka Health**: Connection monitoring

### Logging

Structured logging with correlation IDs:

```typescript
logger.log('User created', { 
  userId: user.id, 
  tenantId: user.tenantId,
  correlationId: req.correlationId 
});
```

### Metrics

- Request/response times
- Error rates
- Database query performance
- Kafka message processing

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch
3. **Add tests** for new functionality  
4. **Ensure** all tests pass
5. **Submit** a pull request

### Code Standards

- **TypeScript** strict mode
- **ESLint** + **Prettier** formatting
- **Jest** for testing
- **Conventional commits**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## � Next Steps

- [ ] Add authentication endpoints
- [ ] Implement rate limiting
- [ ] Add monitoring dashboard
- [ ] Set up CI/CD pipeline
- [ ] Add more example modules

---

**🚀 Ready to build amazing applications?** Start by exploring the API documentation at http://localhost:3000/api/docs!
