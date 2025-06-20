import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';
import { JsonLogger } from '../../infrastructure/logger/json-logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private log: JsonLogger) {}
  
  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const { method, url } = ctx.switchToHttp().getRequest<Request>();
    const start = Date.now();
    
    return next.handle().pipe(
      tap(() => this.log.debug(`${method} ${url} ${Date.now() - start}ms`))
    );
  }
}