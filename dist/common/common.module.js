"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const tenant_service_1 = require("./services/tenant.service");
const logger_service_1 = require("./services/logger.service");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const tenant_guard_1 = require("./guards/tenant.guard");
let CommonModule = class CommonModule {
};
exports.CommonModule = CommonModule;
exports.CommonModule = CommonModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.registerAsync({
                useFactory: (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: { expiresIn: '24h' },
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        providers: [
            tenant_service_1.TenantService,
            logger_service_1.LoggerService,
            jwt_auth_guard_1.JwtAuthGuard,
            tenant_guard_1.TenantGuard,
        ],
        exports: [
            tenant_service_1.TenantService,
            logger_service_1.LoggerService,
            jwt_auth_guard_1.JwtAuthGuard,
            tenant_guard_1.TenantGuard,
            jwt_1.JwtModule,
        ],
    })
], CommonModule);
//# sourceMappingURL=common.module.js.map