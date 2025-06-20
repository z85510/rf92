# NestJS Modular Architecture Project

A complete NestJS project implementing a modular architecture with CQRS pattern, multi-tenancy, and automatic module generation. Perfect for scalable enterprise applications.

## 🏗️ Architecture Overview

This project follows a feature-based modular architecture with:

- **CQRS Pattern**: Separate read/write controllers and handlers
- **Multi-Tenancy**: Built-in tenant isolation and validation
- **Module Generation**: Automatic creation of new modules from templates
- **Security**: JWT authentication, role-based access control
- **Documentation**: Comprehensive Swagger API documentation
- **Database**: PostgreSQL with Prisma ORM
- **Validation**: Input validation with class-validator and Zod

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
npm run db:generate

# Push database schema
npm run db:push

# Optional: Open Prisma Studio
npm run db:studio
```

4. **Start the application:**
```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

5. **Access the application:**
- **API**: http://localhost:3000
- **Swagger Docs**: http://localhost:3000/api/docs
- **Health Check**: http://localhost:3000/health

## � Module Generation

### Generate New Modules Instantly

Create new feature modules with a single command:

```bash
# Generate a products module
npm run generate:module products

# Generate an orders module  
npm run generate:module orders

# Generate any module
npm run generate:module <module-name>
```

### What Gets Generated

Each module includes:

✅ **Separate Read/Write Controllers** (CQRS pattern)  
✅ **CQRS Commands & Queries** with handlers  
✅ **Service Layer** with business logic  
✅ **DTOs** with validation and Swagger docs  
✅ **Multi-tenant support** built-in  
✅ **Role-based access control**  
✅ **Error handling** and logging  
✅ **Complete TypeScript types**

### Example: Generated Module Structure

```
src/modules/products/
├── controllers/
│   ├── products-read.controller.ts    # GET operations
│   └── products-write.controller.ts   # POST/PUT/DELETE operations
├── dto/
│   ├── create-product.dto.ts
│   ├── update-product.dto.ts
│   └── product-response.dto.ts
├── services/
│   ├── products.service.ts
│   └── products-query.service.ts
├── handlers/                          # CQRS handlers
├── commands/                          # Command definitions
├── queries/                           # Query definitions
└── products.module.ts
```

## 📁 Project Structure

```
src/
├── config/                    # Environment validation
├── common/                    # Shared utilities (guards, pipes, filters)
│   ├── decorators/           # Custom decorators (@CurrentUser, @CurrentTenant)
│   ├── guards/               # Authentication & authorization
│   ├── services/             # Logger, Tenant service
│   └── filters/              # Global exception handling
├── database/                  # Database configuration (Prisma)
├── modules/                   # Feature modules
│   ├── _template_/           # 🎯 Template for new modules
│   ├── users/                # Example: Users module  
│   └── <your-modules>/       # Generated modules go here
├── app.module.ts
└── main.ts
```

## � Authentication & Security

### Multi-Tenancy

The project includes built-in multi-tenancy support:

- **Tenant Isolation**: Data is automatically isolated by tenant
- **Tenant Validation**: Automatic validation of tenant access
- **Flexible Tenant Resolution**: Support for subdomain or header-based tenant identification

```typescript
// Example: Using tenant context in your code
@Get()
async getProducts(@CurrentTenant() tenantId: string) {
  return this.productsService.findByTenant(tenantId);
}
```

### Authentication

- **JWT-based authentication**
- **Role-based access control**
- **Public routes** with `@Public()` decorator
- **Role restrictions** with `@Roles('admin', 'user')`

```typescript
// Example: Protected endpoint with roles
@Get('admin-only')
@Roles('admin')
async getAdminData(@CurrentUser() user: JwtPayload) {
  return this.adminService.getSensitiveData();
}
```

## 📚 API Documentation

### Automatic Swagger Documentation

Every generated module includes comprehensive Swagger documentation:

- **Interactive API Explorer**: http://localhost:3000/api/docs
- **Request/Response Examples**
- **Authentication Setup**
- **Error Response Documentation**

### Example API Endpoints

After generating a `products` module:

```bash
# Products API
GET    /products           # List products (paginated)
GET    /products/:id       # Get single product
POST   /products           # Create new product
PATCH  /products/:id       # Update product
DELETE /products/:id       # Delete product

# Users API (included)
GET    /users              # List users
GET    /users/:id          # Get single user
POST   /users              # Create new user
PATCH  /users/:id          # Update user
DELETE /users/:id          # Delete user
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
DEFAULT_TENANT_ID="1"
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:3001"
```

## �️ Development Commands

```bash
# Development
npm run start:dev          # Start with hot reload
npm run start:debug        # Start with debugger

# Building
npm run build              # Build for production
npm run start:prod         # Start production build

# Database
npm run db:generate        # Generate Prisma client
npm run db:push           # Push schema changes
npm run db:studio         # Open Prisma Studio
npm run db:seed           # Seed database (if configured)

# Module Generation
npm run generate:module <name>  # Generate new module

# Code Quality
npm run lint              # Lint code
npm run format            # Format code
npm run test              # Run tests
npm run test:e2e          # Run E2E tests
npm run test:cov          # Test coverage
```

## � Key Features

### CQRS Architecture
- **Command/Query Separation**: Clear separation of read and write operations
- **Scalable**: Different optimization strategies for reads vs writes
- **Maintainable**: Clear responsibility boundaries

### Built-in Best Practices
- **Input Validation**: Automatic validation with detailed error messages
- **Error Handling**: Global exception filters with proper HTTP status codes
- **Logging**: Structured logging with tenant and user context
- **Security**: JWT authentication with role-based authorization
- **Documentation**: Auto-generated API documentation

### Enterprise Ready
- **Multi-Tenancy**: Built-in tenant isolation
- **Scalability**: Modular architecture for team development
- **Maintainability**: Consistent patterns across all modules
- **Testing**: Foundation for unit, integration, and E2E tests

## 🚢 Deployment

### Docker Support

```bash
# Build Docker image
docker build -t nestjs-modular-app .

# Run with Docker Compose
docker-compose -f docker-compose.prod.yml up
```

### Environment Variables

Ensure these are set in production:
- `DATABASE_URL`: Production database connection
- `JWT_SECRET`: Strong secret for JWT signing
- `NODE_ENV=production`
- `ALLOWED_ORIGINS`: Your frontend URLs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Generate a new module to test: `npm run generate:module testmodule`
5. Add tests and ensure they pass: `npm run test`
6. Commit your changes: `git commit -m 'Add amazing feature'`
7. Push to the branch: `git push origin feature/amazing-feature`
8. Submit a pull request

## 📖 Documentation

- [Module Template System](src/modules/_template_/README.md)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [CQRS Pattern](https://docs.nestjs.com/recipes/cqrs)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

🎉 **Ready to build amazing applications?** Start by generating your first module:

```bash
npm run generate:module products
```

Happy coding! 🚀
