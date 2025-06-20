import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TenantService } from './services/tenant.service';
import { LoggerService } from './services/logger.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { TenantGuard } from './guards/tenant.guard';
import { Roles } from './decorators/roles.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { CurrentTenant } from './decorators/current-tenant.decorator';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    TenantService,
    LoggerService,
    JwtAuthGuard,
    TenantGuard,
  ],
  exports: [
    TenantService,
    LoggerService,
    JwtAuthGuard,
    TenantGuard,
    JwtModule,
  ],
})
export class CommonModule {}