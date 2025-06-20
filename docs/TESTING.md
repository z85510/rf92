# 🧪 Testing Guide

This document provides comprehensive information about testing strategies, best practices, and examples for the NestJS enterprise application.

## 📋 Testing Strategy

We follow a **multi-layered testing approach** to ensure high-quality, reliable code:

1. **Unit Tests**: Test individual components in isolation
2. **Integration Tests**: Test component interactions
3. **End-to-End (E2E) Tests**: Test complete user workflows
4. **Contract Tests**: Ensure API compatibility

## 🎯 Testing Objectives

- ✅ **High Coverage**: Maintain >80% test coverage
- ✅ **Fast Feedback**: Quick unit tests for rapid development
- ✅ **Confidence**: E2E tests for critical user paths
- ✅ **Maintainability**: Easy to read and maintain tests
- ✅ **Documentation**: Tests as living documentation

## 🏗️ Test Structure

```
src/
├── **/*.spec.ts          # Unit tests (next to source files)
test/
├── **/*.e2e-spec.ts     # End-to-end tests
├── jest-e2e.json        # E2E Jest configuration
└── test-utils.ts        # Testing utilities and helpers
```

## 🔧 Test Configuration

### Jest Configuration

**Unit Tests** (`package.json`):
```json
{
  "jest": {
    "moduleFileExtensions": ["js", "json", "ts"],
    "rootDir": "src",
    "testRegex": ".*\\.spec\\.ts$",
    "transform": {
      "^.+\\.(t|j)s$": "ts-jest"
    },
    "collectCoverageFrom": ["**/*.(t|j)s"],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node"
  }
}
```

**E2E Tests** (`test/jest-e2e.json`):
```json
{
  "moduleFileExtensions": ["js", "json", "ts"],
  "rootDir": ".",
  "testEnvironment": "node",
  "testRegex": ".e2e-spec.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  }
}
```

## 🧪 Unit Testing

### Testing Philosophy

- **Arrange-Act-Assert (AAA)**: Clear test structure
- **One Assertion per Test**: Focused test cases
- **Descriptive Names**: Tests as documentation
- **Mock External Dependencies**: Isolated testing

### Example: Testing a Handler

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserHandler } from './create-user.handler';
import { UserRepository, USER_REPOSITORY } from '../../domain/repositories/user.repository';
import { UserKafkaProducer } from '../../infrastructure/messaging/user.kafka-producer';

describe('CreateUserHandler', () => {
  let handler: CreateUserHandler;
  let userRepository: jest.Mocked<UserRepository>;
  let kafkaProducer: jest.Mocked<UserKafkaProducer>;

  beforeEach(async () => {
    const mockUserRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
    };

    const mockKafkaProducer = {
      publishUserCreated: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserHandler,
        {
          provide: USER_REPOSITORY,
          useValue: mockUserRepository,
        },
        {
          provide: UserKafkaProducer,
          useValue: mockKafkaProducer,
        },
      ],
    }).compile();

    handler = module.get<CreateUserHandler>(CreateUserHandler);
    userRepository = module.get(USER_REPOSITORY);
    kafkaProducer = module.get(UserKafkaProducer);
  });

  describe('execute', () => {
    it('should create a user successfully', async () => {
      // Arrange
      const commandData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };
      
      const command = new CreateUserCommand(commandData);
      
      userRepository.save.mockResolvedValue(undefined);
      kafkaProducer.publishUserCreated.mockResolvedValue(undefined);

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(userRepository.save).toHaveBeenCalledWith(expect.any(User));
      expect(kafkaProducer.publishUserCreated).toHaveBeenCalledWith(expect.any(User));
      expect(result).toEqual({
        id: expect.any(String),
        email: commandData.email,
      });
    });

    it('should handle repository errors', async () => {
      // Arrange
      const command = new CreateUserCommand({ email: 'test@example.com', password: 'password123' });
      userRepository.save.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(handler.execute(command)).rejects.toThrow('Database error');
      expect(kafkaProducer.publishUserCreated).not.toHaveBeenCalled();
    });
  });
});
```

### Testing Controllers

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UsersController } from './users.controller';

describe('UsersController', () => {
  let controller: UsersController;
  let commandBus: jest.Mocked<CommandBus>;
  let queryBus: jest.Mocked<QueryBus>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: CommandBus,
          useValue: { execute: jest.fn() },
        },
        {
          provide: QueryBus,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    commandBus = module.get(CommandBus);
    queryBus = module.get(QueryBus);
  });

  it('should execute CreateUserCommand with correct data', async () => {
    // Arrange
    const createUserDto = {
      email: 'test@example.com',
      password: 'password123',
    };
    const expectedResult = { id: 'user-123', email: createUserDto.email };
    commandBus.execute.mockResolvedValue(expectedResult);

    // Act
    const result = await controller.create(createUserDto);

    // Assert
    expect(commandBus.execute).toHaveBeenCalledWith(
      expect.objectContaining({ data: createUserDto })
    );
    expect(result).toEqual(expectedResult);
  });
});
```

### Testing Guards

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        {
          provide: JwtService,
          useValue: { verifyAsync: jest.fn() },
        },
        {
          provide: Reflector,
          useValue: { getAllAndOverride: jest.fn() },
        },
      ],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
    jwtService = module.get(JwtService);
  });

  it('should allow access with valid JWT token', async () => {
    // Test implementation
  });
});
```

## 🔗 Integration Testing

Integration tests verify that multiple components work together correctly.

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../infrastructure/database/prisma.service';
import { UsersModule } from './users.module';

describe('Users Integration', () => {
  let module: TestingModule;
  let prisma: PrismaService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [UsersModule],
    }).compile();

    prisma = module.get<PrismaService>(PrismaService);
    await module.init();
  });

  afterAll(async () => {
    await module.close();
  });

  beforeEach(async () => {
    await prisma.user.deleteMany();
    await prisma.tenant.deleteMany();
  });

  it('should create a user and save to database', async () => {
    // Integration test implementation
  });
});
```

## 🌐 E2E Testing

End-to-end tests verify complete application workflows.

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/infrastructure/database/prisma.service';
import { TestUtils } from './test-utils';

describe('Users E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = await TestUtils.setupTestApp(moduleFixture);
    prisma = app.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await TestUtils.cleanDatabase(prisma);
  });

  describe('/users (POST)', () => {
    it('should create a new user', async () => {
      // Arrange
      const createUserDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      // Act & Assert
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('email', createUserDto.email);
      expect(response.body).not.toHaveProperty('password');
    });

    it('should validate required fields', async () => {
      const invalidUserDto = {
        email: 'invalid-email',
        // missing password
      };

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(invalidUserDto)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(Array.isArray(response.body.message)).toBe(true);
    });
  });

  describe('/users/:id (GET)', () => {
    it('should get user by id', async () => {
      // Arrange
      const tenant = await TestUtils.createTestTenant(prisma);
      const user = await TestUtils.createTestUser(prisma, tenant.id);

      // Act & Assert
      const response = await request(app.getHttpServer())
        .get(`/users/${user.id}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', user.id);
      expect(response.body).toHaveProperty('email', user.email);
    });

    it('should return 404 for non-existent user', () => {
      const nonExistentId = '550e8400-e29b-41d4-a716-446655440000';
      
      return request(app.getHttpServer())
        .get(`/users/${nonExistentId}`)
        .expect(404);
    });
  });
});
```

## 🛠️ Test Utilities

### Test Utils Class

```typescript
export class TestUtils {
  static createMockJwtPayload(overrides: Partial<JwtPayload> = {}): JwtPayload {
    return {
      sub: 'test-user-id',
      email: 'test@example.com',
      tenantId: 'test-tenant-id',
      roles: ['user'],
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
      ...overrides,
    };
  }

  static async setupTestApp(moduleClass: any): Promise<INestApplication> {
    const app = moduleFixture.createNestApplication();
    
    app.useGlobalPipes(new ValidationPipe({ 
      whitelist: true, 
      transform: true,
      forbidNonWhitelisted: true,
    }));

    await app.init();
    return app;
  }

  static async cleanDatabase(prisma: PrismaService): Promise<void> {
    await prisma.user.deleteMany();
    await prisma.tenant.deleteMany();
  }
}
```

### Mock Factories

```typescript
export const MockFactories = {
  createMockRepository: () => ({
    save: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
  }),

  createMockCommandBus: () => ({
    execute: jest.fn(),
  }),

  createMockJwtService: () => ({
    verifyAsync: jest.fn(),
    sign: jest.fn(),
  }),
};
```

## 📊 Test Coverage

### Running Coverage Reports

```bash
# Generate coverage report
npm run test:cov

# View HTML coverage report
open coverage/lcov-report/index.html
```

### Coverage Goals

- **Overall Coverage**: >80%
- **Branch Coverage**: >75%
- **Function Coverage**: >90%
- **Line Coverage**: >85%

### Coverage Configuration

```json
{
  "jest": {
    "collectCoverageFrom": [
      "src/**/*.(t|j)s",
      "!src/**/*.spec.ts",
      "!src/**/*.interface.ts",
      "!src/main.ts"
    ],
    "coverageThreshold": {
      "global": {
        "branches": 75,
        "functions": 90,
        "lines": 85,
        "statements": 85
      }
    }
  }
}
```

## ⚡ Testing Best Practices

### 1. Test Structure

```typescript
describe('ComponentName', () => {
  // Setup
  beforeEach(() => {
    // Arrange common setup
  });

  describe('methodName', () => {
    it('should do something when condition is met', () => {
      // Arrange
      // Act
      // Assert
    });

    it('should handle error when invalid input provided', () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

### 2. Descriptive Test Names

```typescript
// ❌ Bad
it('should work', () => {});

// ✅ Good
it('should create user successfully with valid input data', () => {});
it('should throw validation error when email format is invalid', () => {});
it('should return 404 when user does not exist', () => {});
```

### 3. Mock Strategy

```typescript
// ❌ Don't mock what you own
const mockUserService = {
  createUser: jest.fn(),
};

// ✅ Mock external dependencies
const mockEmailService = {
  sendWelcomeEmail: jest.fn(),
};

const mockDatabase = {
  save: jest.fn(),
  find: jest.fn(),
};
```

### 4. Test Data Management

```typescript
// ✅ Use factories for test data
const createTestUser = (overrides = {}) => ({
  id: 'test-id',
  email: 'test@example.com',
  ...overrides,
});

// ✅ Use meaningful test data
const validUserData = {
  email: 'john.doe@example.com',
  password: 'SecurePassword123!',
  firstName: 'John',
  lastName: 'Doe',
};
```

### 5. Async Testing

```typescript
// ✅ Proper async/await usage
it('should handle async operations', async () => {
  const result = await service.asyncMethod();
  expect(result).toBeDefined();
});

// ✅ Testing promises
it('should reject with error for invalid input', async () => {
  await expect(service.asyncMethod('invalid')).rejects.toThrow('Invalid input');
});
```

## 🚀 Testing Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- user.service.spec.ts

# Run tests with coverage
npm run test:cov

# Run E2E tests
npm run test:e2e

# Run tests in debug mode
npm run test:debug

# Run tests with verbose output
npm test -- --verbose
```

## 🔍 Debugging Tests

### VS Code Configuration

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Jest Tests",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

### Debug Specific Test

```bash
# Debug specific test file
npm run test:debug -- --testNamePattern="should create user"
```

## 📈 Test Metrics

### Key Metrics to Track

1. **Test Coverage**: Percentage of code covered by tests
2. **Test Execution Time**: How long tests take to run
3. **Test Reliability**: How often tests pass/fail
4. **Test Maintainability**: How easy tests are to update

### Performance Goals

- **Unit Tests**: <5 seconds total execution time
- **Integration Tests**: <30 seconds total execution time
- **E2E Tests**: <2 minutes total execution time

## 🎯 Testing Checklist

### Before Committing

- [ ] All tests pass locally
- [ ] New code has test coverage >80%
- [ ] Tests are descriptive and maintainable
- [ ] No console errors or warnings
- [ ] Tests run in reasonable time

### Code Review

- [ ] Tests verify the right behavior
- [ ] Edge cases are covered
- [ ] Error scenarios are tested
- [ ] Tests are readable and well-structured
- [ ] Mocks are appropriate and minimal

---

Following these testing practices ensures our application is reliable, maintainable, and provides confidence for continuous deployment.