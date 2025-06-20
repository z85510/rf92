"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let TenantService = class TenantService {
    constructor(configService) {
        this.configService = configService;
    }
    async getTenantBySubdomain(subdomain) {
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
    async getTenantById(tenantId) {
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
    extractTenantFromRequest(request) {
        const tenantHeader = request.headers['x-tenant-id'];
        if (tenantHeader) {
            return tenantHeader;
        }
        const host = request.headers.host;
        if (host) {
            const subdomain = host.split('.')[0];
            if (subdomain && subdomain !== 'www' && subdomain !== 'api') {
                return subdomain;
            }
        }
        return this.configService.get('DEFAULT_TENANT_ID', '1');
    }
    async validateTenant(tenantId) {
        const tenant = await this.getTenantById(tenantId);
        return tenant?.isActive ?? false;
    }
};
exports.TenantService = TenantService;
exports.TenantService = TenantService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], TenantService);
//# sourceMappingURL=tenant.service.js.map