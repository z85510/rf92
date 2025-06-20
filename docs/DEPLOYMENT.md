# 🚀 Deployment Guide

This document provides comprehensive instructions for deploying the NestJS enterprise application in various environments, from development to production.

## 📋 Table of Contents

- [Environment Setup](#environment-setup)
- [Docker Deployment](#docker-deployment)
- [Production Deployment](#production-deployment)
- [Environment Variables](#environment-variables)
- [Database Migration](#database-migration)
- [Monitoring & Logging](#monitoring--logging)
- [Security Considerations](#security-considerations)
- [CI/CD Pipeline](#cicd-pipeline)

## 🔧 Environment Setup

### Prerequisites

**Development:**
- Node.js 18+ 
- Docker & Docker Compose
- Git

**Production:**
- Linux server (Ubuntu 20.04+ recommended)
- Docker & Docker Compose
- Nginx (reverse proxy)
- SSL certificate

### Local Development Setup

```bash
# Clone repository
git clone <repository-url>
cd nestjs-enterprise-app

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start infrastructure services
docker-compose up -d

# Setup database
npm run db:generate
npm run db:push

# Start application
npm run start:dev
```

## 🐳 Docker Deployment

### Development with Docker

```bash
# Start all services (app + dependencies)
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop all services
docker-compose down
```

### Production Docker Setup

**docker-compose.prod.yml:**
```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.prod
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      DATABASE_URL: ${DATABASE_URL}
      JWT_SECRET: ${JWT_SECRET}
      KAFKA_BROKERS: kafka:9092
    depends_on:
      - postgres
      - kafka
    restart: unless-stopped
    networks:
      - app-network

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    restart: unless-stopped
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    volumes:
      - redis_data:/data
    networks:
      - app-network

  kafka:
    image: confluentinc/cp-kafka:7.4.0
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092
      KAFKA_INTER_BROKER_LISTENER_NAME: PLAINTEXT
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
    depends_on:
      - zookeeper
    restart: unless-stopped
    networks:
      - app-network

  zookeeper:
    image: confluentinc/cp-zookeeper:7.4.0
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000
    restart: unless-stopped
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - app
    restart: unless-stopped
    networks:
      - app-network

volumes:
  postgres_data:
  redis_data:

networks:
  app-network:
    driver: bridge
```

### Production Dockerfile

**Dockerfile.prod:**
```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

WORKDIR /app

# Copy built application
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/package*.json ./
COPY --from=builder --chown=nestjs:nodejs /app/prisma ./prisma

# Switch to non-root user
USER nestjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Start application
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main"]
```

### Health Check Script

**healthcheck.js:**
```javascript
const http = require('http');

const options = {
  host: 'localhost',
  port: 3000,
  path: '/health',
  timeout: 2000,
};

const request = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  if (res.statusCode === 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

request.on('error', function(err) {
  console.log('ERROR:', err);
  process.exit(1);
});

request.end();
```

## 🌐 Production Deployment

### Server Setup (Ubuntu 20.04+)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Nginx
sudo apt install nginx -y

# Install Certbot for SSL
sudo apt install certbot python3-certbot-nginx -y
```

### Nginx Configuration

**/etc/nginx/sites-available/nestjs-app:**
```nginx
upstream nestjs_backend {
    server 127.0.0.1:3000;
    keepalive 32;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Security Headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req zone=api burst=20 nodelay;

    # Main application
    location / {
        proxy_pass http://nestjs_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # WebSocket support
    location /socket.io/ {
        proxy_pass http://nestjs_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static files (if any)
    location /static/ {
        alias /var/www/nestjs-app/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### SSL Certificate Setup

```bash
# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test auto-renewal
sudo certbot renew --dry-run

# Setup auto-renewal cron job
echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -
```

### Deployment Script

**deploy.sh:**
```bash
#!/bin/bash

set -e

echo "🚀 Starting deployment..."

# Variables
APP_DIR="/opt/nestjs-app"
BACKUP_DIR="/opt/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup
echo "📦 Creating backup..."
mkdir -p $BACKUP_DIR
docker-compose exec postgres pg_dump -U $DB_USER $DB_NAME > $BACKUP_DIR/db_backup_$DATE.sql

# Pull latest code
echo "📥 Pulling latest code..."
cd $APP_DIR
git pull origin main

# Build new images
echo "🔨 Building new images..."
docker-compose -f docker-compose.prod.yml build

# Run database migrations
echo "🗃️ Running database migrations..."
docker-compose -f docker-compose.prod.yml run --rm app npm run db:migrate:deploy

# Update services with zero downtime
echo "🔄 Updating services..."
docker-compose -f docker-compose.prod.yml up -d --no-deps app

# Health check
echo "🏥 Performing health check..."
sleep 10
curl -f http://localhost:3000/health || exit 1

echo "✅ Deployment completed successfully!"

# Cleanup old images
docker image prune -f

echo "🧹 Cleanup completed!"
```

## 🔐 Environment Variables

### Production Environment File

**.env.production:**
```env
# Application
NODE_ENV=production
PORT=3000
APP_NAME=NestJS Enterprise API

# Database
DATABASE_URL=postgresql://username:password@postgres:5432/production_db
DB_HOST=postgres
DB_PORT=5432
DB_USER=username
DB_PASSWORD=strong_password
DB_NAME=production_db

# Redis
REDIS_URL=redis://redis:6379

# JWT
JWT_SECRET=super-strong-secret-key-at-least-32-characters
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=another-super-strong-secret-key
JWT_REFRESH_EXPIRES_IN=7d

# Kafka
KAFKA_BROKERS=kafka:9092
KAFKA_CLIENT_ID=nestjs-prod
KAFKA_GROUP_ID=nestjs-consumer-group

# External Services
EMAIL_SERVICE_API_KEY=your-email-service-key
STORAGE_SERVICE_KEY=your-storage-service-key

# Monitoring
SENTRY_DSN=your-sentry-dsn
LOGGING_LEVEL=info

# Security
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
RATE_LIMIT_TTL=60000
RATE_LIMIT_MAX=100

# Features
ENABLE_SWAGGER=false
ENABLE_METRICS=true
ENABLE_TRACING=true
```

### Environment Variable Validation

```typescript
// src/config/env.schema.ts
import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.string().transform(Number).default('3000'),
  
  // Database
  DATABASE_URL: z.string().url(),
  
  // JWT
  JWT_SECRET: z.string().min(32, 'JWT secret must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('1h'),
  
  // Redis
  REDIS_URL: z.string().url().optional(),
  
  // Kafka
  KAFKA_BROKERS: z.string(),
  KAFKA_CLIENT_ID: z.string(),
  
  // Security
  CORS_ORIGINS: z.string().transform(val => val.split(',')),
  RATE_LIMIT_TTL: z.string().transform(Number).default('60000'),
  RATE_LIMIT_MAX: z.string().transform(Number).default('100'),
  
  // Monitoring
  SENTRY_DSN: z.string().url().optional(),
  LOGGING_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});
```

## 🗃️ Database Migration

### Migration Strategy

```bash
# Create migration
npx prisma migrate dev --name add_new_feature

# Deploy to production
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

### Backup Strategy

**backup.sh:**
```bash
#!/bin/bash

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/backups"
DB_NAME="production_db"
DB_USER="username"

# Create backup directory
mkdir -p $BACKUP_DIR

# Database backup
docker-compose exec postgres pg_dump -U $DB_USER $DB_NAME | gzip > $BACKUP_DIR/db_backup_$DATE.sql.gz

# Keep only last 30 days of backups
find $BACKUP_DIR -name "db_backup_*.sql.gz" -mtime +30 -delete

echo "Backup completed: $BACKUP_DIR/db_backup_$DATE.sql.gz"
```

### Restore Process

```bash
# Restore from backup
gunzip -c /opt/backups/db_backup_20240115_120000.sql.gz | docker-compose exec -T postgres psql -U username -d production_db
```

## 📊 Monitoring & Logging

### Application Metrics

**metrics.ts:**
```typescript
import { Injectable } from '@nestjs/common';
import { Counter, Histogram, register } from 'prom-client';

@Injectable()
export class MetricsService {
  private httpRequestTotal = new Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status'],
  });

  private httpRequestDuration = new Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route'],
    buckets: [0.1, 0.5, 1, 2, 5],
  });

  constructor() {
    register.registerMetric(this.httpRequestTotal);
    register.registerMetric(this.httpRequestDuration);
  }

  incrementHttpRequests(method: string, route: string, status: number) {
    this.httpRequestTotal.inc({ method, route, status: status.toString() });
  }

  observeHttpDuration(method: string, route: string, duration: number) {
    this.httpRequestDuration.observe({ method, route }, duration);
  }
}
```

### Log Aggregation

**docker-compose.logging.yml:**
```yaml
version: '3.8'

services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.8.0
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data

  logstash:
    image: docker.elastic.co/logstash/logstash:8.8.0
    volumes:
      - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf

  kibana:
    image: docker.elastic.co/kibana/kibana:8.8.0
    ports:
      - "5601:5601"
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200

volumes:
  elasticsearch_data:
```

### Prometheus Configuration

**prometheus.yml:**
```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'nestjs-app'
    static_configs:
      - targets: ['app:3000']
    metrics_path: '/metrics'
    scrape_interval: 5s
```

## 🔒 Security Considerations

### Security Checklist

- [ ] **Environment Variables**: All secrets in environment variables
- [ ] **JWT Secrets**: Strong, unique secrets (>32 characters)
- [ ] **Database**: Connection over SSL, strong passwords
- [ ] **HTTPS**: SSL/TLS encryption enabled
- [ ] **CORS**: Properly configured allowed origins
- [ ] **Rate Limiting**: Implement rate limiting
- [ ] **Input Validation**: All inputs validated
- [ ] **Dependencies**: Regular security updates
- [ ] **Logging**: No sensitive data in logs
- [ ] **Error Handling**: No stack traces in production

### Security Headers Middleware

```typescript
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class SecurityMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Remove server identification
    res.removeHeader('X-Powered-By');
    
    // Security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    next();
  }
}
```

### Secrets Management

```bash
# Using Docker secrets (Docker Swarm)
echo "super-secret-jwt-key" | docker secret create jwt_secret -

# Using environment files
# Never commit .env files to version control
echo ".env*" >> .gitignore
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

**.github/workflows/deploy.yml:**
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_USER: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm run test:cov
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
    
    - name: Run E2E tests
      run: npm run test:e2e
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Docker Buildx
      uses: docker/setup-buildx-action@v2
    
    - name: Login to DockerHub
      uses: docker/login-action@v2
      with:
        username: ${{ secrets.DOCKERHUB_USERNAME }}
        password: ${{ secrets.DOCKERHUB_TOKEN }}
    
    - name: Build and push
      uses: docker/build-push-action@v4
      with:
        context: .
        file: ./Dockerfile.prod
        push: true
        tags: yourusername/nestjs-app:latest

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: Deploy to server
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /opt/nestjs-app
          docker-compose -f docker-compose.prod.yml pull
          docker-compose -f docker-compose.prod.yml up -d
          docker system prune -f
```

### Deployment Verification

```bash
# Health check script
#!/bin/bash

echo "🏥 Performing health checks..."

# Application health
curl -f http://localhost:3000/health || exit 1

# Database connectivity
docker-compose exec app npm run db:status || exit 1

# Redis connectivity
docker-compose exec redis redis-cli ping || exit 1

# Kafka connectivity
docker-compose exec kafka kafka-broker-api-versions --bootstrap-server localhost:9092 || exit 1

echo "✅ All health checks passed!"
```

## 📈 Performance Optimization

### Production Optimizations

```typescript
// main.ts - Production optimizations
if (process.env.NODE_ENV === 'production') {
  // Enable compression
  app.use(compression());
  
  // Security middleware
  app.use(helmet());
  
  // Rate limiting
  app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  }));
}
```

### Database Connection Pooling

```typescript
// prisma.service.ts
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
      log: process.env.NODE_ENV === 'development' ? ['query'] : ['error'],
    });
  }
}
```

## 🚨 Troubleshooting

### Common Issues

**Database Connection Issues:**
```bash
# Check database connectivity
docker-compose exec app npx prisma db pull

# Check database logs
docker-compose logs postgres
```

**Memory Issues:**
```bash
# Check container memory usage
docker stats

# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm start
```

**SSL Certificate Issues:**
```bash
# Check certificate status
sudo certbot certificates

# Renew certificate
sudo certbot renew --force-renewal
```

### Log Analysis

```bash
# Application logs
docker-compose logs -f app

# Database logs
docker-compose logs -f postgres

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

This deployment guide provides a comprehensive foundation for deploying the NestJS enterprise application in production environments with proper security, monitoring, and scalability considerations.