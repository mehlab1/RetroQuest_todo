

y# Vercel Deployment Guide

This guide will help you deploy both the frontend and backend of your RetroQuest application on Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Database**: Set up a PostgreSQL database (recommended: Neon, Supabase, or Railway)
3. **Git Repository**: Your code should be in a Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Database Setup

### Option A: Neon (Recommended)
1. Go to [neon.tech](https://neon.tech) and create an account
2. Create a new project
3. Copy the connection string from the dashboard
4. Run the following commands to set up your database:

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy
```

### Option B: Supabase
1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Go to Settings > Database to get your connection string
4. Run the same commands as above

## Step 2: Environment Variables

Set up the following environment variables in your Vercel project:

### Required Environment Variables

```env
# Database
DATABASE_URL=your-postgresql-connection-string

# JWT Secret
JWT_SECRET=your-super-secure-jwt-secret-key-here

# Frontend URL (will be your Vercel domain)
FRONTEND_URL=https://your-app-name.vercel.app

# Node Environment
NODE_ENV=production
```

### Optional Environment Variables

```env
# Google OAuth (if using Google login)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email (if using email features)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Monitoring
SENTRY_DSN=your-sentry-dsn
```

## Step 3: Deploy to Vercel

### Method 1: Vercel CLI (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel --prod
```

### Method 2: GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Configure the build settings:
   - **Framework Preset**: Other
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

## Step 4: Configure Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to Settings > Environment Variables
3. Add all the environment variables listed above
4. Make sure to set them for "Production" environment

## Step 5: Database Migration

After deployment, you need to run database migrations:

1. Go to your Vercel project dashboard
2. Navigate to Functions > api/index.js
3. Click on "View Function Logs"
4. You can run migrations using Vercel's CLI:

```bash
vercel env pull .env.production.local
npx prisma migrate deploy
```

## Step 6: Verify Deployment

1. Check your API health endpoint: `https://your-app.vercel.app/api/health`
2. Test your frontend: `https://your-app.vercel.app`
3. Verify database connectivity

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Ensure your DATABASE_URL is correct
   - Check if your database allows external connections
   - Verify SSL settings in the connection string

2. **Build Errors**
   - Check the build logs in Vercel dashboard
   - Ensure all dependencies are in package.json
   - Verify Node.js version compatibility

3. **API Routes Not Working**
   - Check the Vercel function logs
   - Verify the API routes are correctly configured
   - Ensure CORS settings are correct

4. **Environment Variables Not Loading**
   - Double-check variable names in Vercel dashboard
   - Ensure variables are set for the correct environment
   - Redeploy after adding new environment variables

### Debugging

1. **Check Function Logs**:
   - Go to Vercel dashboard > Functions > api/index.js
   - Click "View Function Logs"

2. **Test Locally**:
   ```bash
   vercel dev
   ```

3. **Check Database**:
   ```bash
   npx prisma studio
   ```

## Post-Deployment

1. **Set up Custom Domain** (Optional):
   - Go to Vercel dashboard > Settings > Domains
   - Add your custom domain

2. **Enable Analytics** (Optional):
   - Go to Vercel dashboard > Analytics
   - Enable web analytics

3. **Set up Monitoring** (Recommended):
   - Consider using Sentry for error tracking
   - Set up uptime monitoring

## Security Considerations

1. **Environment Variables**: Never commit sensitive data to your repository
2. **CORS**: Ensure CORS is properly configured for your domain
3. **Rate Limiting**: The API includes rate limiting by default
4. **HTTPS**: Vercel automatically provides HTTPS

## Performance Optimization

1. **Database Indexing**: Ensure your database has proper indexes
2. **Caching**: Consider implementing Redis for caching
3. **CDN**: Vercel automatically provides CDN for static assets
4. **Image Optimization**: Use Vercel's image optimization features

## Support

If you encounter issues:

1. Check the [Vercel documentation](https://vercel.com/docs)
2. Review the [Prisma documentation](https://www.prisma.io/docs)
3. Check the function logs in your Vercel dashboard
4. Ensure all environment variables are correctly set

## Next Steps

After successful deployment:

1. Set up monitoring and alerting
2. Configure backups for your database
3. Set up CI/CD pipelines
4. Consider implementing feature flags
5. Plan for scaling as your application grows
