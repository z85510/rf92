import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { LoggerService } from '../common/services/logger.service';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(private logger: LoggerService) {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
      ],
    });

    // Log database queries in development
    if (process.env.NODE_ENV === 'development') {
      this.$on('query', (e) => {
        this.logger.debug(`Query: ${e.query}`, { 
          params: e.params, 
          duration: `${e.duration}ms` 
        });
      });
    }

    this.$on('error', (e) => {
      this.logger.error('Database error', e.message);
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Successfully connected to database');
    } catch (error) {
      this.logger.error('Failed to connect to database', error.message);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Disconnected from database');
  }

  /**
   * Helper method to handle tenant-specific queries
   */
  withTenant(tenantId: string) {
    return {
      user: {
        findMany: (args?: any) => this.user.findMany({
          ...args,
          where: { ...args?.where, tenantId },
        }),
        findUnique: (args: any) => this.user.findUnique({
          ...args,
          where: { ...args.where, tenantId },
        }),
        create: (args: any) => this.user.create({
          ...args,
          data: { ...args.data, tenantId },
        }),
        update: (args: any) => this.user.update({
          ...args,
          where: { ...args.where, tenantId },
        }),
        delete: (args: any) => this.user.delete({
          ...args,
          where: { ...args.where, tenantId },
        }),
      },
    };
  }
}