import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator to extract current tenant ID from request
 * @example
 * @Get('users')
 * getUsers(@CurrentTenant() tenantId: string) {
 *   return this.usersService.findByTenant(tenantId);
 * }
 */
export const CurrentTenant = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    return request.tenantId || request.user?.tenantId;
  },
);