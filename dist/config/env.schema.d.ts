import { z } from 'zod';
export declare const envSchema: z.ZodObject<{
    NODE_ENV: z.ZodDefault<z.ZodEnum<["development", "production", "test"]>>;
    PORT: z.ZodDefault<z.ZodEffects<z.ZodString, number, string>>;
    DATABASE_URL: z.ZodDefault<z.ZodString>;
    KAFKA_BROKERS: z.ZodDefault<z.ZodString>;
    KAFKA_CLIENT_ID: z.ZodDefault<z.ZodString>;
    JWT_SECRET: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    NODE_ENV?: "development" | "production" | "test";
    PORT?: number;
    DATABASE_URL?: string;
    KAFKA_BROKERS?: string;
    KAFKA_CLIENT_ID?: string;
    JWT_SECRET?: string;
}, {
    NODE_ENV?: "development" | "production" | "test";
    PORT?: string;
    DATABASE_URL?: string;
    KAFKA_BROKERS?: string;
    KAFKA_CLIENT_ID?: string;
    JWT_SECRET?: string;
}>;
export type EnvConfig = z.infer<typeof envSchema>;
