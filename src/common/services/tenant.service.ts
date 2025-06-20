import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class TenantService {
  constructor(private configService: ConfigService) {}

  /**
   * Get tenant by subdomain
   */
  async getTenantBySubdomain(subdomain: string): Promise<Tenant | null> {
    // In a real app, this would query the database
    // For demo purposes, we'll use a mock tenant
    if (subdomain === 'demo' || subdomain === 'test') {
      return {
        id: '1',
        name: 'Demo Tenant',
        subdomain,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
    return null;
  }

  /**
   * Get tenant by ID
   */
  async getTenantById(tenantId: string): Promise<Tenant | null> {
    // In a real app, this would query the database
    if (tenantId === '1') {
      return {
        id: '1',
        name: 'Demo Tenant',
        subdomain: 'demo',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
    return null;
  }

  /**
   * Extract tenant from request headers or subdomain
   */
  extractTenantFromRequest(request: any): string | null {
    // Try to get tenant from X-Tenant-ID header first
    const tenantHeader = request.headers['x-tenant-id'];
    if (tenantHeader) {
      return tenantHeader;
    }

    // Try to extract from subdomain
    const host = request.headers.host;
    if (host) {
      const subdomain = host.split('.')[0];
      if (subdomain && subdomain !== 'www' && subdomain !== 'api') {
        return subdomain;
      }
    }

    // Default tenant for development
    return this.configService.get('DEFAULT_TENANT_ID', '1');
  }

  /**
   * Validate if tenant is active
   */
  async validateTenant(tenantId: string): Promise<boolean> {
    const tenant = await this.getTenantById(tenantId);
    return tenant?.isActive ?? false;
  }
}