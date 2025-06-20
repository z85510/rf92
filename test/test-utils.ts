import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/infrastructure/database/prisma.service';
import { JwtPayload } from '../src/common/guards/jwt-auth.guard';

/**
 * Test utilities for creating mock data and setting up test environments
 */

export class TestUtils {
  /**
   * Creates a mock JWT payload for testing authenticated requests
   */
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

  /**
   * Creates a mock tenant for testing
   */
  static createMockTenant(overrides: any = {}) {
    return {
      id: 'test-tenant-id',
      name: 'Test Tenant',
      subdomain: 'test-tenant',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    };
  }

  /**
   * Creates a mock user for testing
   */
  static createMockUser(overrides: any = {}) {
    return {
      id: 'test-user-id',
      email: 'test@example.com',
      passwordHash: 'hashed-password',
      firstName: 'Test',
      lastName: 'User',
      roles: ['user'],
      isActive: true,
      tenantId: 'test-tenant-id',
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    };
  }

  /**
   * Sets up a test application with proper configuration
   */
  static async setupTestApp(moduleClass: any): Promise<INestApplication> {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [moduleClass],
    }).compile();

    const app = moduleFixture.createNestApplication();
    
    // Apply same global configurations as main.ts
    app.useGlobalPipes(new ValidationPipe({ 
      whitelist: true, 
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      }
    }));

    await app.init();
    return app;
  }

  /**
   * Cleans up test database
   */
  static async cleanDatabase(prisma: PrismaService): Promise<void> {
    await prisma.user.deleteMany();
    await prisma.tenant.deleteMany();
  }

  /**
   * Creates a test tenant in the database
   */
  static async createTestTenant(prisma: PrismaService, data: any = {}): Promise<any> {
    return prisma.tenant.create({
      data: {
        name: 'Test Tenant',
        subdomain: 'test-tenant',
        isActive: true,
        ...data,
      },
    });
  }

  /**
   * Creates a test user in the database
   */
  static async createTestUser(prisma: PrismaService, tenantId: string, data: any = {}): Promise<any> {
    return prisma.user.create({
      data: {
        email: 'test@example.com',
        passwordHash: 'hashed-password',
        firstName: 'Test',
        lastName: 'User',
        tenantId,
        ...data,
      },
    });
  }

  /**
   * Creates a mock execution context for guard testing
   */
  static createMockExecutionContext(request: any = {}) {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {},
          url: '/test-path',
          ...request,
        }),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as any;
  }

  /**
   * Creates authorization header for testing
   */
  static createAuthHeader(token: string = 'test-token'): object {
    return {
      authorization: `Bearer ${token}`,
    };
  }
}

/**
 * Mock factories for common services
 */
export const MockFactories = {
  createMockRepository: () => ({
    save: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
    findByTenant: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  }),

  createMockCommandBus: () => ({
    execute: jest.fn(),
  }),

  createMockQueryBus: () => ({
    execute: jest.fn(),
  }),

  createMockJwtService: () => ({
    verifyAsync: jest.fn(),
    sign: jest.fn(),
  }),

  createMockKafkaProducer: () => ({
    publishUserCreated: jest.fn(),
    publishUserUpdated: jest.fn(),
    publishUserDeleted: jest.fn(),
  }),

  createMockLogger: () => ({
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  }),
};