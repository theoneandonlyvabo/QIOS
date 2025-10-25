# QIOS Deployment Guide

## Overview

Guide ini menjelaskan cara deploy QIOS ke berbagai platform dan environment.

## Prerequisites

- Node.js 18+
- npm atau yarn
- Database PostgreSQL
- API keys untuk payment gateways
- Domain dan SSL certificate (untuk production)

## Environment Setup

### Development Environment

1. **Clone repository**
```bash
git clone https://github.com/your-username/qios-retail-system.git
cd qios-retail-system
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp env.example .env.local
```

4. **Configure database**
```bash
# Setup PostgreSQL database
createdb qios_dev

# Run migrations
npx prisma db push
```

5. **Start development server**
```bash
npm run dev
```

### Production Environment

1. **Build application**
```bash
npm run build
```

2. **Start production server**
```bash
npm start
```

## Deployment Options

### 1. Vercel (Recommended)

Vercel adalah platform yang paling mudah untuk deploy Next.js applications.

#### Setup

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
vercel
```

4. **Configure Environment Variables**

Di Vercel dashboard:
- Go to Project Settings
- Navigate to Environment Variables
- Add all required environment variables

#### Environment Variables untuk Vercel

```env
# Database
DATABASE_URL=postgresql://username:password@host:5432/database

# JWT
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=7d

# Payment Gateways
MIDTRANS_SERVER_KEY=your-midtrans-server-key
MIDTRANS_CLIENT_KEY=your-midtrans-client-key
MIDTRANS_IS_PRODUCTION=true

XENDIT_SECRET_KEY=your-xendit-secret-key
XENDIT_PUBLIC_KEY=your-xendit-public-key

# Bank APIs
BCA_API_KEY=your-bca-api-key
MANDIRI_API_KEY=your-mandiri-api-key

# E-wallet APIs
DANA_API_KEY=your-dana-api-key
OVO_API_KEY=your-ovo-api-key
LINKAJA_API_KEY=your-linkaja-api-key
GOPAY_API_KEY=your-gopay-api-key

# Utility APIs
PLN_API_KEY=your-pln-api-key
PDAM_API_KEY=your-pdam-api-key

# AI/ML Services
OPENAI_API_KEY=your-openai-api-key

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_API_URL=https://your-domain.vercel.app/api
NODE_ENV=production
```

#### Custom Domain

1. **Add domain di Vercel dashboard**
2. **Configure DNS records**
3. **SSL certificate otomatis**

### 2. Docker

#### Dockerfile

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### Docker Compose

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/qios
    depends_on:
      - db
      - redis

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=qios
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

#### Deploy dengan Docker

```bash
# Build image
docker build -t qios-retail-system .

# Run container
docker run -p 3000:3000 --env-file .env qios-retail-system

# Atau dengan docker-compose
docker-compose up -d
```

### 3. AWS

#### AWS EC2

1. **Launch EC2 instance**
   - Instance type: t3.medium atau lebih besar
   - OS: Ubuntu 20.04 LTS
   - Security group: HTTP (80), HTTPS (443), SSH (22)

2. **Setup server**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y
```

3. **Deploy application**
```bash
# Clone repository
git clone https://github.com/your-username/qios-retail-system.git
cd qios-retail-system

# Install dependencies
npm install

# Build application
npm run build

# Start with PM2
pm2 start npm --name "qios" -- start
pm2 save
pm2 startup
```

4. **Configure Nginx**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

5. **Setup SSL dengan Let's Encrypt**
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com
```

#### AWS RDS

1. **Create RDS PostgreSQL instance**
2. **Configure security groups**
3. **Update DATABASE_URL**

#### AWS S3

1. **Create S3 bucket untuk static assets**
2. **Configure bucket policy**
3. **Update environment variables**

### 4. DigitalOcean

#### DigitalOcean App Platform

1. **Connect GitHub repository**
2. **Configure build settings**
3. **Set environment variables**
4. **Deploy**

#### DigitalOcean Droplet

1. **Create droplet**
2. **Setup server (sama seperti AWS EC2)**
3. **Deploy application**

### 5. Railway

1. **Connect GitHub repository**
2. **Configure environment variables**
3. **Deploy**

## Database Setup

### PostgreSQL

1. **Create database**
```sql
CREATE DATABASE qios_production;
CREATE USER qios_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE qios_production TO qios_user;
```

2. **Run migrations**
```bash
npx prisma db push
```

3. **Seed data (optional)**
```bash
npx prisma db seed
```

### Redis (Optional)

Untuk caching dan session storage:

```bash
# Install Redis
sudo apt install redis-server -y

# Start Redis
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

## Monitoring & Logging

### PM2 Monitoring

```bash
# Monitor processes
pm2 monit

# View logs
pm2 logs

# Restart application
pm2 restart qios
```

### Logging

```bash
# Create log directory
mkdir -p /var/log/qios

# Configure log rotation
sudo nano /etc/logrotate.d/qios
```

### Health Checks

```bash
# Health check endpoint
curl http://localhost:3000/api/health

# Expected response
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00Z",
  "version": "1.0.0"
}
```

## Security

### Environment Variables

```bash
# Secure environment variables
chmod 600 .env.production
```

### Firewall

```bash
# Configure UFW
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### SSL/TLS

1. **Let's Encrypt (Free)**
```bash
sudo certbot --nginx -d your-domain.com
```

2. **Commercial SSL**
   - Upload certificate files
   - Configure Nginx

### Security Headers

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
```

## Backup & Recovery

### Database Backup

```bash
# Create backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump qios_production > /backups/qios_$DATE.sql
```

### Application Backup

```bash
# Backup application files
tar -czf qios_backup_$(date +%Y%m%d).tar.gz /var/www/qios
```

### Automated Backups

```bash
# Add to crontab
0 2 * * * /path/to/backup_script.sh
```

## Performance Optimization

### CDN Setup

1. **Cloudflare**
   - Add domain
   - Configure DNS
   - Enable caching

2. **AWS CloudFront**
   - Create distribution
   - Configure origins
   - Set up caching

### Database Optimization

```sql
-- Create indexes
CREATE INDEX idx_sales_date ON sales(date);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_products_category ON products(category);
```

### Caching

```javascript
// Redis caching
const redis = require('redis');
const client = redis.createClient();

// Cache payment gateway responses
const cacheKey = `payment:${orderId}`;
const cached = await client.get(cacheKey);
if (cached) {
  return JSON.parse(cached);
}
```

## Troubleshooting

### Common Issues

1. **Port already in use**
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 PID
```

2. **Database connection failed**
```bash
# Check database status
sudo systemctl status postgresql

# Check connection
psql -h localhost -U qios_user -d qios_production
```

3. **Memory issues**
```bash
# Check memory usage
free -h

# Restart application
pm2 restart qios
```

### Logs

```bash
# Application logs
pm2 logs qios

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# System logs
sudo journalctl -u nginx -f
```

## Scaling

### Horizontal Scaling

1. **Load Balancer**
   - Configure Nginx load balancer
   - Add multiple application instances

2. **Database Scaling**
   - Read replicas
   - Connection pooling

### Vertical Scaling

1. **Increase server resources**
2. **Optimize application code**
3. **Database optimization**

## Maintenance

### Regular Tasks

1. **Update dependencies**
```bash
npm update
npm audit fix
```

2. **Database maintenance**
```sql
-- Analyze tables
ANALYZE;

-- Vacuum database
VACUUM;
```

3. **Log rotation**
```bash
# Configure logrotate
sudo nano /etc/logrotate.d/qios
```

### Updates

1. **Application updates**
```bash
git pull origin main
npm install
npm run build
pm2 restart qios
```

2. **Database migrations**
```bash
npx prisma db push
```

## Support

- **Documentation**: [Deployment Docs](https://docs.qios.com/deployment)
- **Status Page**: [Status](https://status.qios.com)
- **Support Email**: deployment-support@qios.com
- **GitHub Issues**: [Issues](https://github.com/qios/deployment-issues)
