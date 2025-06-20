import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('health')
@Controller()
export class AppController {
  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'nestjs-modular-api',
    };
  }

  @Get()
  @ApiOperation({ summary: 'Root endpoint' })
  @ApiResponse({ status: 200, description: 'Welcome message' })
  getRoot() {
    return {
      message: 'Welcome to NestJS Modular API',
      documentation: '/api/docs',
      health: '/health',
    };
  }
}