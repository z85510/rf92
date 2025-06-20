import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * Decorator to set required roles for a route
 * @param roles - Array of required roles
 * @example
 * @Roles('admin', 'user')
 * @Get('users')
 * getUsers() {}
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);