import { LoggerService as NestLoggerService } from '@nestjs/common';
export interface LogContext {
    tenantId?: string;
    userId?: string;
    correlationId?: string;
    [key: string]: any;
}
export declare class LoggerService implements NestLoggerService {
    private formatMessage;
    log(message: string, context?: LogContext): void;
    error(message: string, trace?: string, context?: LogContext): void;
    warn(message: string, context?: LogContext): void;
    debug(message: string, context?: LogContext): void;
    verbose(message: string, context?: LogContext): void;
}
