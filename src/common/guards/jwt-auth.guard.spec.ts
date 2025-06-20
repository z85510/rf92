import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard, JwtPayload } from './jwt-auth.guard';
import { LoggerService } from '../services/logger.service';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let jwtService: jest.Mocked<JwtService>;
  let reflector: jest.Mocked<Reflector>;
  let logger: jest.Mocked<LoggerService>;

  beforeEach(async () => {
    const mockJwtService = {
      verifyAsync: jest.fn(),
    };

    const mockReflector = {
      getAllAndOverride: jest.fn(),
    };

    const mockLogger = {
      warn: jest.fn(),
      debug: jest.fn(),
      error: jest.fn(),
      log: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: Reflector,
          useValue: mockReflector,
        },
        {
          provide: LoggerService,
          useValue: mockLogger,
        },
      ],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
    jwtService = module.get(JwtService);
    reflector = module.get(Reflector);
    logger = module.get(LoggerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const createMockExecutionContext = (headers: any = {}): ExecutionContext => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          headers,
          url: '/test-path',
        }),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as any;
  };

  describe('canActivate', () => {
    it('should allow access to public routes', async () => {
      // Arrange
      const context = createMockExecutionContext();
      reflector.getAllAndOverride.mockReturnValue(true); // Route is public

      // Act
      const result = await guard.canActivate(context);

      // Assert
      expect(result).toBe(true);
      expect(jwtService.verifyAsync).not.toHaveBeenCalled();
    });

    it('should allow access with valid JWT token', async () => {
      // Arrange
      const validPayload: JwtPayload = {
        sub: 'user-123',
        email: 'test@example.com',
        tenantId: 'tenant-123',
        roles: ['user'],
        iat: 1234567890,
        exp: 1234567999,
      };

      const context = createMockExecutionContext({
        authorization: 'Bearer valid-token',
      });
      
      reflector.getAllAndOverride.mockReturnValue(false); // Route is not public
      jwtService.verifyAsync.mockResolvedValue(validPayload);

      // Act
      const result = await guard.canActivate(context);

      // Assert
      expect(result).toBe(true);
      expect(jwtService.verifyAsync).toHaveBeenCalledWith('valid-token');
      expect(logger.debug).toHaveBeenCalledWith(
        'JWT token validated',
        expect.objectContaining({
          userId: validPayload.sub,
          tenantId: validPayload.tenantId,
        })
      );
    });

    it('should deny access when no token is provided', async () => {
      // Arrange
      const context = createMockExecutionContext(); // No authorization header
      reflector.getAllAndOverride.mockReturnValue(false); // Route is not public

      // Act & Assert
      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException
      );
      await expect(guard.canActivate(context)).rejects.toThrow(
        'Access token is required'
      );
      
      expect(logger.warn).toHaveBeenCalledWith(
        'No JWT token provided',
        expect.objectContaining({ path: '/test-path' })
      );
    });

    it('should deny access when token format is invalid', async () => {
      // Arrange
      const context = createMockExecutionContext({
        authorization: 'InvalidFormat token',
      });
      reflector.getAllAndOverride.mockReturnValue(false);

      // Act & Assert
      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException
      );
      await expect(guard.canActivate(context)).rejects.toThrow(
        'Access token is required'
      );
    });

    it('should deny access when token is invalid', async () => {
      // Arrange
      const context = createMockExecutionContext({
        authorization: 'Bearer invalid-token',
      });
      
      reflector.getAllAndOverride.mockReturnValue(false);
      jwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

      // Act & Assert
      await expect(guard.canActivate(context)).rejects.toThrow(
        UnauthorizedException
      );
      await expect(guard.canActivate(context)).rejects.toThrow(
        'Invalid or expired access token'
      );
      
      expect(logger.warn).toHaveBeenCalledWith(
        'Invalid JWT token',
        expect.objectContaining({
          error: 'Invalid token',
          path: '/test-path',
        })
      );
    });

    it('should attach user payload to request on successful validation', async () => {
      // Arrange
      const validPayload: JwtPayload = {
        sub: 'user-123',
        email: 'test@example.com',
        tenantId: 'tenant-123',
        roles: ['user', 'admin'],
      };

      const mockRequest = { headers: { authorization: 'Bearer valid-token' }, url: '/test-path' };
      const context = {
        switchToHttp: () => ({
          getRequest: () => mockRequest,
        }),
        getHandler: jest.fn(),
        getClass: jest.fn(),
      } as any;
      
      reflector.getAllAndOverride.mockReturnValue(false);
      jwtService.verifyAsync.mockResolvedValue(validPayload);

      // Act
      await guard.canActivate(context);

      // Assert
      expect((mockRequest as any).user).toEqual(validPayload);
    });
  });
});