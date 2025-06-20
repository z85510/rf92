import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { LoggerService } from '../common/services/logger.service';
export declare class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private logger;
    constructor(logger: LoggerService);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    withTenant(tenantId: string): {
        user: {
            findMany: (args?: any) => import(".prisma/client").Prisma.PrismaPromise<{
                tenantId: string;
                id: string;
                email: string;
                passwordHash: string;
                firstName: string | null;
                lastName: string | null;
                roles: string[];
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
            }[]>;
            findUnique: (args: any) => import(".prisma/client").Prisma.Prisma__UserClient<{
                tenantId: string;
                id: string;
                email: string;
                passwordHash: string;
                firstName: string | null;
                lastName: string | null;
                roles: string[];
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
            }, null, import("@prisma/client/runtime/library").DefaultArgs>;
            create: (args: any) => import(".prisma/client").Prisma.Prisma__UserClient<{
                tenantId: string;
                id: string;
                email: string;
                passwordHash: string;
                firstName: string | null;
                lastName: string | null;
                roles: string[];
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
            }, never, import("@prisma/client/runtime/library").DefaultArgs>;
            update: (args: any) => import(".prisma/client").Prisma.Prisma__UserClient<{
                tenantId: string;
                id: string;
                email: string;
                passwordHash: string;
                firstName: string | null;
                lastName: string | null;
                roles: string[];
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
            }, never, import("@prisma/client/runtime/library").DefaultArgs>;
            delete: (args: any) => import(".prisma/client").Prisma.Prisma__UserClient<{
                tenantId: string;
                id: string;
                email: string;
                passwordHash: string;
                firstName: string | null;
                lastName: string | null;
                roles: string[];
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
            }, never, import("@prisma/client/runtime/library").DefaultArgs>;
        };
    };
}
