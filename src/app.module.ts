import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './config/env.schema';
import { LoggerModule } from './infrastructure/logger/logger.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { KafkaModule } from './infrastructure/kafka/kafka.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => envSchema.parse(config),
    }),
    LoggerModule,
    DatabaseModule,
    KafkaModule,
    // Feature modules
    UsersModule,
  ],
})
export class AppModule {}