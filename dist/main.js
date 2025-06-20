"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const all_exceptions_filter_1 = require("./common/filters/all-exceptions.filter");
const logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
const logger_service_1 = require("./common/services/logger.service");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const logger = app.get(logger_service_1.LoggerService);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
            enableImplicitConversion: true,
        }
    }));
    app.useGlobalFilters(new all_exceptions_filter_1.AllExceptionsFilter(logger));
    app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor(logger));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('NestJS Modular API')
        .setDescription('A scalable NestJS API with CQRS, multi-tenancy, and comprehensive documentation')
        .setVersion('1.0')
        .addBearerAuth({
        description: 'JWT Authorization header using the Bearer scheme.',
        name: 'Authorization',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header'
    }, 'access-token')
        .addTag('users', 'User management operations')
        .addTag('auth', 'Authentication operations')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
        },
    });
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
//# sourceMappingURL=main.js.map