import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { envSchema } from './config/env.schema';
import { DatabaseModule } from './database/database.module';
import { CommonModule } from './common/common.module';
import { AppController } from './app.controller';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => envSchema.parse(config),
    }),
    CqrsModule.forRoot(),
    DatabaseModule,
    CommonModule,
    // Feature modules
    UsersModule,
  ],
  controllers: [AppController],
})
export class AppModule {}