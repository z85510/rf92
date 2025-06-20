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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserHandler = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const create_user_command_1 = require("../commands/create-user.command");
const user_repository_1 = require("../../domain/repositories/user.repository");
const user_entity_1 = require("../../domain/entities/user.entity");
const user_kafka_producer_1 = require("../../infrastructure/messaging/user.kafka-producer");
const bcrypt = require("bcryptjs");
let CreateUserHandler = class CreateUserHandler {
    constructor(repo, producer) {
        this.repo = repo;
        this.producer = producer;
    }
    async execute(cmd) {
        const hash = await bcrypt.hash(cmd.data.password, 10);
        const user = user_entity_1.User.create((0, crypto_1.randomUUID)(), cmd.data.email, hash);
        await this.repo.save(user);
        await this.producer.publishUserCreated(user);
        return { id: user.id, email: user.email };
    }
};
exports.CreateUserHandler = CreateUserHandler;
exports.CreateUserHandler = CreateUserHandler = __decorate([
    (0, cqrs_1.CommandHandler)(create_user_command_1.CreateUserCommand),
    __param(0, (0, common_1.Inject)(user_repository_1.USER_REPOSITORY)),
    __metadata("design:paramtypes", [Object, user_kafka_producer_1.UserKafkaProducer])
], CreateUserHandler);
//# sourceMappingURL=create-user.handler.js.map