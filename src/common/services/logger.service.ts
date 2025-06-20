import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';

export interface LogContext {
  tenantId?: string;
  userId?: string;
  correlationId?: string;
  [key: string]: any;
}

@Injectable()
export class LoggerService implements NestLoggerService {
  private formatMessage(level: string, message: string, context?: LogContext) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...(context && { context }),
    };
    return JSON.stringify(logEntry);
  }

  log(message: string, context?: LogContext) {
    console.log(this.formatMessage('info', message, context));
  }

  error(message: string, trace?: string, context?: LogContext) {
    console.error(this.formatMessage('error', message, { ...context, trace }));
  }

  warn(message: string, context?: LogContext) {
    console.warn(this.formatMessage('warn', message, context));
  }

  debug(message: string, context?: LogContext) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(this.formatMessage('debug', message, context));
    }
  }

  verbose(message: string, context?: LogContext) {
    if (process.env.NODE_ENV === 'development') {
      console.log(this.formatMessage('verbose', message, context));
    }
  }
}