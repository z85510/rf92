import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TenantService } from '../services/tenant.service';
import { LoggerService } from '../services/logger.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(
    private tenantService: TenantService,
    private reflector: Reflector,
    private logger: LoggerService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Skip tenant validation for public routes
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    
    // Extract tenant from request
    const tenantId = this.tenantService.extractTenantFromRequest(request);
    
    if (!tenantId) {
      this.logger.warn('No tenant ID found in request', { path: request.url });
      throw new ForbiddenException('Tenant ID is required');
    }

    // Validate tenant exists and is active
    const isValidTenant = await this.tenantService.validateTenant(tenantId);
    
    if (!isValidTenant) {
      this.logger.warn('Invalid or inactive tenant', { 
        tenantId, 
        path: request.url 
      });
      throw new ForbiddenException('Invalid or inactive tenant');
    }

    // Attach tenant ID to request for later use
    request.tenantId = tenantId;
    
    this.logger.debug('Tenant validated', { 
      tenantId, 
      path: request.url 
    });

    return true;
  }
}