import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { UsersController } from "./presentation/controllers/users.controller";
import { CreateUserHandler } from "./application/handlers/create-user.handler";
import { GetUserHandler } from "./application/handlers/get-user.handler";
import { PrismaUserRepository } from "./infrastructure/repositories/prisma-user.repository";
import { USER_REPOSITORY } from "./domain/repositories/user.repository";
import { UsersWebSocketGateway } from "./infrastructure/websocket/users-websocket.gateway";
import { WebSocketModule } from "../../infrastructure/websocket/websocket.module";

@Module({
  imports: [CqrsModule, WebSocketModule],
  controllers: [UsersController],
  providers: [
    CreateUserHandler,
    GetUserHandler,
    UsersWebSocketGateway,
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [USER_REPOSITORY],
})
export class UsersModule {}
