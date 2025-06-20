import { ConfigService } from '@nestjs/config';
export interface Tenant {
    id: string;
    name: string;
    subdomain: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare class TenantService {
    private configService;
    constructor(configService: ConfigService);
    getTenantBySubdomain(subdomain: string): Promise<Tenant | null>;
    getTenantById(tenantId: string): Promise<Tenant | null>;
    extractTenantFromRequest(request: any): string | null;
    validateTenant(tenantId: string): Promise<boolean>;
}
