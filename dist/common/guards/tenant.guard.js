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
exports.TenantGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const tenant_service_1 = require("../services/tenant.service");
const logger_service_1 = require("../services/logger.service");
const public_decorator_1 = require("../decorators/public.decorator");
let TenantGuard = class TenantGuard {
    constructor(tenantService, reflector, logger) {
        this.tenantService = tenantService;
        this.reflector = reflector;
        this.logger = logger;
    }
    async canActivate(context) {
        const isPublic = this.reflector.getAllAndOverride(public_decorator_1.IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const tenantId = this.tenantService.extractTenantFromRequest(request);
        if (!tenantId) {
            this.logger.warn('No tenant ID found in request', { path: request.url });
            throw new common_1.ForbiddenException('Tenant ID is required');
        }
        const isValidTenant = await this.tenantService.validateTenant(tenantId);
        if (!isValidTenant) {
            this.logger.warn('Invalid or inactive tenant', {
                tenantId,
                path: request.url
            });
            throw new common_1.ForbiddenException('Invalid or inactive tenant');
        }
        request.tenantId = tenantId;
        this.logger.debug('Tenant validated', {
            tenantId,
            path: request.url
        });
        return true;
    }
};
exports.TenantGuard = TenantGuard;
exports.TenantGuard = TenantGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_service_1.TenantService,
        core_1.Reflector,
        logger_service_1.LoggerService])
], TenantGuard);
//# sourceMappingURL=tenant.guard.js.map