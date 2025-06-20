import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { LoggerService } from '../services/logger.service';
export interface JwtPayload {
    sub: string;
    email: string;
    tenantId: string;
    roles: string[];
    iat?: number;
    exp?: number;
}
export declare class JwtAuthGuard implements CanActivate {
    private jwtService;
    private reflector;
    private logger;
    constructor(jwtService: JwtService, reflector: Reflector, logger: LoggerService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractTokenFromHeader;
}
