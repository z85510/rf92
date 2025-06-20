# Module Products System

This `_products_` directory contains the boilerplate structure for creating new modules in this NestJS project. It provides a consistent architecture pattern that follows CQRS principles with separate read/write controllers.

## 🚀 Quick Module Generation

Generate a new module using the built-in script:

```bash
# Generate a new module (e.g., products)
npm run generate:module products

# Generate another module (e.g., orders)
npm run generate:module orders
```

## 📁 Products Structure

```
_products_/
├── controllers/
│   ├── products-read.controller.ts   # Query operations (GET)
│   └── products-write.controller.ts  # Command operations (POST, PUT, DELETE)
├── dto/
│   ├── create-products.dto.ts        # Input validation for creation
│   ├── update-products.dto.ts        # Input validation for updates
│   └── products-response.dto.ts      # Response format with Swagger docs
├── services/
│   ├── products.service.ts           # Business logic for commands
│   └── products-query.service.ts     # Business logic for queries
├── handlers/
│   ├── create-products.handler.ts    # CQRS command handlers
│   ├── update-products.handler.ts
│   ├── delete-products.handler.ts
│   ├── get-products.handler.ts       # CQRS query handlers
│   └── get-productss.handler.ts
├── commands/
│   ├── create-products.command.ts    # Command definitions
│   ├── update-products.command.ts
│   └── delete-products.command.ts
├── queries/
│   ├── get-products.query.ts         # Query definitions
│   └── get-productss.query.ts
└── products.module.ts                # Module configuration
```

## 🔧 What Gets Generated

When you run `npm run generate:module products`, the script will:

1. **Copy** the entire `_products_` directory to `src/modules/products/`
2. **Replace** all occurrences of:
   - `Products` → `Product` (PascalCase)
   - `products` → `product` (lowercase)
   - `productss` → `products` (plural for API endpoints)
3. **Rename** all files from `products-*` to `product-*`
4. **Generate** a complete module with:
   - ✅ Read controller (`/products` GET endpoints)
   - ✅ Write controller (`/products` POST/PUT/DELETE endpoints)
   - ✅ CQRS commands and queries
   - ✅ Service layer with business logic
   - ✅ DTOs with validation and Swagger documentation
   - ✅ Multi-tenant support
   - ✅ Role-based access control

## 📋 Next Steps After Generation

1. **Add the module to `app.module.ts`:**
   ```typescript
   import { ProductsModule } from './modules/products/products.module';
   
   @Module({
     imports: [
       // ... other modules
       ProductsModule,
     ],
   })
   ```

2. **Update Prisma schema** (if needed):
   ```prisma
   model Product {
     id          String   @id @default(uuid())
     name        String
     description String?
     price       Decimal?
     tenantId    String
     tenant      Tenant   @relation(fields: [tenantId], references: [id])
     createdAt   DateTime @default(now())
     updatedAt   DateTime @updatedAt
     
     @@map("products")
   }
   ```

3. **Run database commands:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Start development:**
   ```bash
   npm run start:dev
   ```

## 🏗️ Architecture Features

### CQRS Pattern
- **Commands**: Create, Update, Delete operations
- **Queries**: Read operations with complex filtering
- **Handlers**: Separate business logic for each operation

### Multi-Tenancy
- Automatic tenant isolation
- Tenant validation middleware
- Tenant-specific data queries

### Security
- JWT authentication
- Role-based access control
- Input validation
- Tenant-based authorization

### Documentation
- Comprehensive Swagger documentation
- API examples and descriptions
- Request/response schemas

### Best Practices
- Separation of concerns
- Dependency injection
- Error handling
- Logging and monitoring
- Type safety

## 🔄 Customizing the Products

To modify the products for your project needs:

1. Edit files in `src/modules/_products_/`
2. Update placeholders (`Products`, `products`, etc.)
3. Run the generator to test your changes
4. Generated modules will use your updated products

## 🎯 Example Usage

After generating a `products` module:

```bash
# API endpoints available:
GET    /products           # List products with pagination
GET    /products/:id       # Get single product
POST   /products           # Create new product
PATCH  /products/:id       # Update product
DELETE /products/:id       # Delete product

# Swagger documentation:
http://localhost:3000/api/docs#tag-products
```

## 🧪 Testing

Each generated module includes the foundation for:
- Unit tests for services
- Integration tests for controllers
- E2E tests for complete workflows

Start with the generated structure and add your specific test cases.

---

This products system ensures consistency across your entire application while allowing for rapid development of new features. Happy coding! 🚀