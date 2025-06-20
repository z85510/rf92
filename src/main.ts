import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { LoggerService } from './common/services/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Get logger service from DI container
  const logger = app.get(LoggerService);
  
  // Global pipes
  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true, 
    transform: true,
    forbidNonWhitelisted: true,
    transformOptions: {
      enableImplicitConversion: true,
    }
  }));
  
  // Global filters
  app.useGlobalFilters(new AllExceptionsFilter(logger));
  
  // Global interceptors
  app.useGlobalInterceptors(new LoggingInterceptor(logger));
  
  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('NestJS Modular API')
    .setDescription('A scalable NestJS API with CQRS, multi-tenancy, and comprehensive documentation')
    .setVersion('1.0')
    .addBearerAuth(
      {
        description: 'JWT Authorization header using the Bearer scheme.',
        name: 'Authorization',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header'
      },
      'access-token',
    )
    .addTag('users', 'User management operations')
    .addTag('auth', 'Authentication operations')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  
  // CORS
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
  });
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/api/docs`);
}

bootstrap();