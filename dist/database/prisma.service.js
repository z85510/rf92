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
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const logger_service_1 = require("../common/services/logger.service");
let PrismaService = class PrismaService extends client_1.PrismaClient {
    constructor(logger) {
        super();
        this.logger = logger;
    }
    async onModuleInit() {
        try {
            await this.$connect();
            this.logger.log('Successfully connected to database');
        }
        catch (error) {
            this.logger.error('Failed to connect to database', error.message);
            throw error;
        }
    }
    async onModuleDestroy() {
        await this.$disconnect();
        this.logger.log('Disconnected from database');
    }
    withTenant(tenantId) {
        return {
            user: {
                findMany: (args) => this.user.findMany({
                    ...args,
                    where: { ...args?.where, tenantId },
                }),
                findUnique: (args) => this.user.findUnique({
                    ...args,
                    where: { ...args.where, tenantId },
                }),
                create: (args) => this.user.create({
                    ...args,
                    data: { ...args.data, tenantId },
                }),
                update: (args) => this.user.update({
                    ...args,
                    where: { ...args.where, tenantId },
                }),
                delete: (args) => this.user.delete({
                    ...args,
                    where: { ...args.where, tenantId },
                }),
            },
        };
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [logger_service_1.LoggerService])
], PrismaService);
//# sourceMappingURL=prisma.service.js.map