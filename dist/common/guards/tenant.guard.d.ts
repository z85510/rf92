import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TenantService } from '../services/tenant.service';
import { LoggerService } from '../services/logger.service';
export declare class TenantGuard implements CanActivate {
    private tenantService;
    private reflector;
    private logger;
    constructor(tenantService: TenantService, reflector: Reflector, logger: LoggerService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
