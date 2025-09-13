# Deployment Guide

## 🚀 Overview

This guide covers deployment strategies and configurations for the Teachers Blog Platform. The application is built with Next.js and can be deployed to various platforms.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Build Process](#build-process)
- [Deployment Platforms](#deployment-platforms)
- [Environment Configuration](#environment-configuration)
- [Performance Optimization](#performance-optimization)
- [Monitoring and Logging](#monitoring-and-logging)
- [Troubleshooting](#troubleshooting)

## ✅ Prerequisites

### System Requirements
- Node.js 18.x or higher
- npm or yarn package manager
- Git for version control

### Pre-deployment Checklist
- [ ] All tests pass
- [ ] Code is linted and formatted
- [ ] Environment variables are configured
- [ ] Build process completes successfully
- [ ] Database connections are tested
- [ ] API endpoints are functional

## 🔨 Build Process

### Local Build
```bash
# Install dependencies
npm install

# Run linting
npm run lint

# Create production build
npm run build

# Test production build locally
npm run start
```

### Build Output
The build process generates:
- `.next/` - Optimized application bundle
- `out/` - Static export (if configured)
- Build manifest and metadata files

### Build Optimization
```javascript
// next.config.ts
const nextConfig = {
  // Enable compression
  compress: true,
  
  // Optimize images
  images: {
    domains: ['example.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Enable experimental features
  experimental: {
    optimizeCss: true,
  },
  
  // Configure headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
    ];
  },
};
```

## 🌐 Deployment Platforms

### Vercel (Recommended)

Vercel is the recommended platform for Next.js applications.

#### Automatic Deployment
1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel automatically detects Next.js

2. **Configure Project**
   ```bash
   # Install Vercel CLI (optional)
   npm i -g vercel
   
   # Deploy from command line
   vercel
   ```

3. **Environment Variables**
   - Add in Vercel dashboard under Settings > Environment Variables
   - Or use `.env.local` for local development

#### Vercel Configuration
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["iad1"],
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

### Netlify

#### Deploy to Netlify
1. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`

2. **Netlify Configuration**
   ```toml
   # netlify.toml
   [build]
     command = "npm run build"
     publish = ".next"
   
   [build.environment]
     NODE_VERSION = "18"
   
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

### AWS Amplify

#### Amplify Deployment
1. **Connect Repository**
   - Use AWS Amplify Console
   - Connect GitHub/GitLab repository

2. **Build Settings**
   ```yaml
   # amplify.yml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

### Docker Deployment

#### Dockerfile
```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --only=production

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

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

#### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - BACKEND_URL=https://blog-dinamico-app.onrender.com
    restart: unless-stopped
```

### Traditional VPS/Server

#### PM2 Process Manager
```bash
# Install PM2
npm install -g pm2

# Create ecosystem file
# ecosystem.config.js
module.exports = {
  apps: [{
    name: 'teachers-blog',
    script: 'npm',
    args: 'start',
    cwd: '/path/to/app',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};

# Start application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save
pm2 startup
```

#### Nginx Configuration
```nginx
# /etc/nginx/sites-available/teachers-blog
server {
    listen 80;
    server_name yourdomain.com;

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

## ⚙️ Environment Configuration

### Environment Variables

#### Production Environment
```env
# .env.production
NODE_ENV=production
BACKEND_URL=https://blog-dinamico-app.onrender.com
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-secret-key
```

#### Development Environment
```env
# .env.local
NODE_ENV=development
BACKEND_URL=https://blog-dinamico-app.onrender.com
```

### Platform-Specific Configuration

#### Vercel Environment Variables
```bash
# Set via Vercel CLI
vercel env add NODE_ENV production
vercel env add BACKEND_URL https://blog-dinamico-app.onrender.com

# Or via dashboard at vercel.com/dashboard
```

#### Netlify Environment Variables
```bash
# Set via Netlify CLI
netlify env:set NODE_ENV production
netlify env:set BACKEND_URL https://blog-dinamico-app.onrender.com
```

## 🚀 Performance Optimization

### Next.js Optimizations

#### Image Optimization
```tsx
// Use Next.js Image component
import Image from 'next/image';

<Image
  src="/profile.jpg"
  alt="Profile"
  width={500}
  height={300}
  priority // For above-the-fold images
/>
```

#### Code Splitting
```tsx
// Dynamic imports for code splitting
import dynamic from 'next/dynamic';

const DynamicComponent = dynamic(() => import('../components/Heavy'), {
  loading: () => <p>Loading...</p>,
});
```

#### Bundle Analysis
```bash
# Install bundle analyzer
npm install --save-dev @next/bundle-analyzer

# Add to next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);

# Run analysis
ANALYZE=true npm run build
```

### CDN Configuration

#### Vercel Edge Network
- Automatic global CDN
- Edge functions for dynamic content
- Automatic image optimization

#### Cloudflare Integration
```javascript
// next.config.js
module.exports = {
  images: {
    loader: 'cloudinary',
    path: 'https://res.cloudinary.com/your-cloud/',
  },
};
```

### Caching Strategies

#### Static Assets
```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
```

#### API Routes
```typescript
// app/api/posts/route.ts
export async function GET() {
  const posts = await fetchPosts();
  
  return new Response(JSON.stringify(posts), {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      'Content-Type': 'application/json',
    },
  });
}
```

## 📊 Monitoring and Logging

### Error Tracking

#### Sentry Integration
```bash
# Install Sentry
npm install @sentry/nextjs

# Configure Sentry
# sentry.client.config.js
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### Analytics

#### Vercel Analytics
```tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Performance Monitoring

#### Web Vitals
```tsx
// app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

### Health Checks

#### API Health Endpoint
```typescript
// app/api/health/route.ts
export async function GET() {
  try {
    // Check database connection
    // Check external API availability
    
    return Response.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version,
    });
  } catch (error) {
    return Response.json(
      { status: 'unhealthy', error: error.message },
      { status: 503 }
    );
  }
}
```

## 🔧 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npm run type-check
```

#### Memory Issues
```javascript
// next.config.js - Increase memory limit
module.exports = {
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
};
```

#### Environment Variable Issues
```bash
# Debug environment variables
console.log('Environment:', {
  NODE_ENV: process.env.NODE_ENV,
  BACKEND_URL: process.env.BACKEND_URL,
});
```

### Deployment Logs

#### Vercel Logs
```bash
# View deployment logs
vercel logs

# View function logs
vercel logs --follow
```

#### PM2 Logs
```bash
# View application logs
pm2 logs teachers-blog

# Monitor in real-time
pm2 monit
```

### Performance Issues

#### Bundle Size Analysis
```bash
# Analyze bundle size
npm run build
npm run analyze

# Check for large dependencies
npx bundlephobia <package-name>
```

#### Runtime Performance
```typescript
// Add performance monitoring
export function reportWebVitals(metric) {
  console.log(metric);
  // Send to analytics service
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
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
        run: npm test
      
      - name: Build application
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 📋 Deployment Checklist

### Pre-deployment
- [ ] Code review completed
- [ ] Tests passing
- [ ] Build successful
- [ ] Environment variables configured
- [ ] Database migrations run (if applicable)

### Post-deployment
- [ ] Application accessible
- [ ] All features working
- [ ] Performance metrics normal
- [ ] Error rates acceptable
- [ ] Monitoring alerts configured

### Rollback Plan
- [ ] Previous version tagged
- [ ] Rollback procedure documented
- [ ] Database backup available
- [ ] Quick rollback method tested

---

**Last Updated**: January 2024
**Deployment Version**: 1.0