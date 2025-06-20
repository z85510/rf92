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
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const jwt_1 = require("@nestjs/jwt");
const public_decorator_1 = require("../decorators/public.decorator");
const logger_service_1 = require("../services/logger.service");
let JwtAuthGuard = class JwtAuthGuard {
    constructor(jwtService, reflector, logger) {
        this.jwtService = jwtService;
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
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            this.logger.warn('No JWT token provided', { path: request.url });
            throw new common_1.UnauthorizedException('Access token is required');
        }
        try {
            const payload = await this.jwtService.verifyAsync(token);
            request.user = payload;
            this.logger.debug('JWT token validated', {
                userId: payload.sub,
                tenantId: payload.tenantId,
                path: request.url
            });
            return true;
        }
        catch (error) {
            this.logger.warn('Invalid JWT token', {
                error: error.message,
                path: request.url
            });
            throw new common_1.UnauthorizedException('Invalid or expired access token');
        }
    }
    extractTokenFromHeader(request) {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        core_1.Reflector,
        logger_service_1.LoggerService])
], JwtAuthGuard);
//# sourceMappingURL=jwt-auth.guard.js.map