"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const users_controller_1 = require("./presentation/controllers/users.controller");
const create_user_handler_1 = require("./application/handlers/create-user.handler");
const get_user_handler_1 = require("./application/handlers/get-user.handler");
const prisma_user_repository_1 = require("./infrastructure/repositories/prisma-user.repository");
const user_repository_1 = require("./domain/repositories/user.repository");
const users_websocket_gateway_1 = require("./infrastructure/websocket/users-websocket.gateway");
const websocket_module_1 = require("../../infrastructure/websocket/websocket.module");
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [cqrs_1.CqrsModule, websocket_module_1.WebSocketModule],
        controllers: [users_controller_1.UsersController],
        providers: [
            create_user_handler_1.CreateUserHandler,
            get_user_handler_1.GetUserHandler,
            users_websocket_gateway_1.UsersWebSocketGateway,
            {
                provide: user_repository_1.USER_REPOSITORY,
                useClass: prisma_user_repository_1.PrismaUserRepository,
            },
        ],
        exports: [user_repository_1.USER_REPOSITORY],
    })
], UsersModule);
//# sourceMappingURL=users.module.js.map