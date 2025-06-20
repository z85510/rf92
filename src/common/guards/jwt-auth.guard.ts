import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { LoggerService } from '../services/logger.service';

export interface JwtPayload {
  sub: string; // user id
  email: string;
  tenantId: string;
  roles: string[];
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private logger: LoggerService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if route is public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      this.logger.warn('No JWT token provided', { path: request.url });
      throw new UnauthorizedException('Access token is required');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      
      // Attach user info to request
      (request as any).user = payload;
      
      this.logger.debug('JWT token validated', { 
        userId: payload.sub, 
        tenantId: payload.tenantId,
        path: request.url 
      });
      
      return true;
    } catch (error) {
      this.logger.warn('Invalid JWT token', { 
        error: error.message, 
        path: request.url 
      });
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}