import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default(3000),
  
  // Database
  DATABASE_URL: z.string().default('postgresql://postgres:password@localhost:5432/nestjs_db?schema=public'),
  
  // Kafka
  KAFKA_BROKERS: z.string().default('localhost:9092'),
  KAFKA_CLIENT_ID: z.string().default('nestjs-app'),
  
  // JWT (optional for future auth)
  JWT_SECRET: z.string().default('your-secret-key'),
});

export type EnvConfig = z.infer<typeof envSchema>;