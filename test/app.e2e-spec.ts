import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/infrastructure/database/prisma.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Apply same configurations as main.ts
    app.useGlobalPipes(new ValidationPipe({ 
      whitelist: true, 
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      }
    }));

    prisma = app.get<PrismaService>(PrismaService);
    
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Clean database before each test
    await prisma.user.deleteMany();
    await prisma.tenant.deleteMany();
  });

  describe('Health Check', () => {
    it('/ (GET) - should return welcome message', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('message');
          expect(res.body.message).toContain('NestJS');
        });
    });

    it('/health (GET) - should return health status', () => {
      return request(app.getHttpServer())
        .get('/health')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('status', 'ok');
          expect(res.body).toHaveProperty('timestamp');
        });
    });
  });

  describe('Users API', () => {
    let tenantId: string;

    beforeEach(async () => {
      // Create a test tenant
      const tenant = await prisma.tenant.create({
        data: {
          name: 'Test Tenant',
          subdomain: 'test-tenant',
          isActive: true,
        },
      });
      tenantId = tenant.id;
    });

    it('/users (POST) - should create a new user', async () => {
      const createUserDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        tenantId: tenantId,
      };

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('email', createUserDto.email);
      expect(response.body).not.toHaveProperty('password');
    });

    it('/users (POST) - should validate required fields', async () => {
      const invalidUserDto = {
        email: 'invalid-email',
        // missing required fields
      };

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(invalidUserDto)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(Array.isArray(response.body.message)).toBe(true);
    });

    it('/users/:id (GET) - should get user by id', async () => {
      // First create a user
      const user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          passwordHash: 'hashedpassword',
          firstName: 'John',
          lastName: 'Doe',
          tenantId: tenantId,
        },
      });

      const response = await request(app.getHttpServer())
        .get(`/users/${user.id}`)
        .expect(200);

      expect(response.body).toHaveProperty('id', user.id);
      expect(response.body).toHaveProperty('email', user.email);
    });

    it('/users/:id (GET) - should return 404 for non-existent user', () => {
      const nonExistentId = '550e8400-e29b-41d4-a716-446655440000';
      
      return request(app.getHttpServer())
        .get(`/users/${nonExistentId}`)
        .expect(404);
    });
  });

  describe('Error Handling', () => {
    it('should handle validation errors gracefully', () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({
          email: 'invalid-email',
          password: '123', // too short
        })
        .expect(400)
        .expect((res) => {
          expect(res.body).toHaveProperty('statusCode', 400);
          expect(res.body).toHaveProperty('message');
        });
    });

    it('should handle not found errors', () => {
      return request(app.getHttpServer())
        .get('/non-existent-route')
        .expect(404);
    });
  });
});