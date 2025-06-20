import { 
  Injectable, 
  NestInterceptor, 
  ExecutionContext, 
  CallHandler 
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';
import { LoggerService } from '../services/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url } = request;
    const startTime = Date.now();

    const contextInfo = {
      tenantId: (request as any).tenantId,
      userId: (request as any).user?.sub,
      correlationId: request.headers['x-correlation-id'] as string,
    };

    this.logger.log(`${method} ${url} - Request started`, contextInfo);

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          this.logger.log(
            `${method} ${url} - Request completed in ${duration}ms`,
            { ...contextInfo, duration }
          );
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          this.logger.error(
            `${method} ${url} - Request failed in ${duration}ms`,
            error.stack,
            { ...contextInfo, duration, error: error.message }
          );
        },
      })
    );
  }
}