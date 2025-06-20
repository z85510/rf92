# NestJS Modular Architecture Project

A complete NestJS project implementing a modular architecture with CQRS pattern, following best practices for scalable and maintainable applications.

## 🏗️ Architecture Overview

This project follows a feature-based modular architecture where each module contains:

- **Domain Layer**: Entities, value objects, and repository interfaces
- **Application Layer**: CQRS commands, queries, handlers, and DTOs
- **Infrastructure Layer**: Database adapters, messaging, external services
- **Presentation Layer**: Controllers, GraphQL resolvers, and consumers

## 📁 Project Structure

```
src/
├── config/                    # Environment validation + ConfigModule
├── common/                    # Cross-cutting concerns (pipes, filters, interceptors)
├── infrastructure/            # Service-wide infrastructure (logger, database, kafka)
├── modules/                   # Feature modules
│   └── users/                 # Example: Users module
│       ├── application/       # CQRS handlers, DTOs
│       ├── domain/            # Entities, value objects, repository interfaces
│       ├── infrastructure/    # Database adapters, messaging
│       └── presentation/      # Controllers
├── app.module.ts
└── main.ts
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- PostgreSQL
- Kafka (optional, for messaging)

### Installation

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd nestjs-modular-project
npm install
```

2. **Start infrastructure services:**
```bash
docker-compose up -d
```

3. **Set up the database:**
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# Optional: Seed the database
npx prisma db seed
```

4. **Start the application:**
```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

## 🔧 Environment Configuration

Copy `.env.example` to `.env` and configure:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://postgres:password@localhost:5432/nestjs_db?schema=public"
KAFKA_BROKERS="localhost:9092"
KAFKA_CLIENT_ID="nestjs-app"
JWT_SECRET="your-secret-key"
```

## 📚 API Endpoints

### Users Module

- `POST /users` - Create a new user
- `GET /users/:id` - Get user by ID

### Example API Calls

```bash
# Create a user
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'

# Get a user
curl http://localhost:3000/users/{user-id}
```

## 🏛️ Key Features

- **CQRS Pattern**: Separate read and write operations
- **Clean Architecture**: Domain-driven design with clear boundaries
- **Dependency Injection**: Proper IoC with NestJS
- **Database Integration**: Prisma ORM with PostgreSQL
- **Message Queuing**: Kafka integration for event-driven architecture
- **Validation**: Zod schemas for runtime validation
- **Logging**: Structured JSON logging
- **Error Handling**: Global exception filters
- **Type Safety**: Full TypeScript support

## 🔄 Adding New Modules

To add a new feature module (e.g., `products`):

1. Copy the `modules/users` structure
2. Replace `User` with `Product` in all files
3. Update imports and exports
4. Add the new module to `app.module.ts`

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📦 Scripts

- `npm run start:dev` - Start in development mode
- `npm run build` - Build the application
- `npm run start:prod` - Start in production mode
- `npm run lint` - Lint the codebase
- `npm run format` - Format code with Prettier

## 🛠️ Development Tools

- **NestJS CLI**: For generating modules, controllers, services
- **Prisma Studio**: Database GUI (`npx prisma studio`)
- **Docker Compose**: Local development environment
- **ESLint + Prettier**: Code formatting and linting

## 📖 Documentation

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [CQRS Pattern](https://docs.nestjs.com/recipes/cqrs)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
