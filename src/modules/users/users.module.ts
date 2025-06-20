import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersReadController } from './controllers/users-read.controller';
import { UsersWriteController } from './controllers/users-write.controller';
import { UsersService } from './services/users.service';
import { UsersQueryService } from './services/users-query.service';
import { CreateUserHandler } from './handlers/create-user.handler';
import { UpdateUserHandler } from './handlers/update-user.handler';
import { DeleteUserHandler } from './handlers/delete-user.handler';
import { GetUserHandler } from './handlers/get-user.handler';
import { GetUsersHandler } from './handlers/get-users.handler';

@Module({
  imports: [CqrsModule],
  controllers: [
    UsersReadController,
    UsersWriteController,
  ],
  providers: [
    // Services
    UsersService,
    UsersQueryService,
    
    // Command Handlers
    CreateUserHandler,
    UpdateUserHandler,
    DeleteUserHandler,
    
    // Query Handlers
    GetUserHandler,
    GetUsersHandler,
  ],
  exports: [UsersService, UsersQueryService],
})
export class UsersModule {}