import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { JsonLogger } from './infrastructure/logger/json-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Global pipes
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  
  // Global filters
  app.useGlobalFilters(new AllExceptionsFilter());
  
  // Global interceptors
  const logger = app.get(JsonLogger);
  app.useGlobalInterceptors(new LoggingInterceptor(logger));
  
  // CORS
  app.enableCors();
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();