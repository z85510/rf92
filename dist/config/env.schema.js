"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envSchema = void 0;
const zod_1 = require("zod");
exports.envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    PORT: zod_1.z.string().transform(Number).default('3000'),
    DATABASE_URL: zod_1.z.string().default('postgresql://postgres:password@localhost:5432/nestjs_db?schema=public'),
    KAFKA_BROKERS: zod_1.z.string().default('localhost:9092'),
    KAFKA_CLIENT_ID: zod_1.z.string().default('nestjs-app'),
    JWT_SECRET: zod_1.z.string().default('your-secret-key'),
});
//# sourceMappingURL=env.schema.js.map