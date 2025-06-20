import { Module } from '@nestjs/common';
import { SharedCqrsModule } from '../../common/cqrs/shared-cqrs.module';
import { UsersController } from './presentation/controllers/users.controller';
import { PrismaUserRepository } from './infrastructure/repositories/prisma-user.repository';
import { UserKafkaProducer } from './infrastructure/messaging/user.kafka-producer';
import { CreateUserHandler } from './application/handlers/create-user.handler';
import { GetUserHandler } from './application/handlers/get-user.handler';
import { USER_REPOSITORY } from './domain/repositories/user.repository';

@Module({
  imports: [SharedCqrsModule],
  controllers: [UsersController],
  providers: [
    // application
    CreateUserHandler,
    GetUserHandler,
    // infrastructure
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
    UserKafkaProducer,
  ],
})
export class UsersModule {}