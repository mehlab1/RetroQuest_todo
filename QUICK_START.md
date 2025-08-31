# Quick Start: Deploy to Vercel

## 🚀 Fast Deployment (5 minutes)

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy (Windows)
```bash
deploy.bat
```

### 3. Deploy (Mac/Linux)
```bash
chmod +x deploy.sh
./deploy.sh
```

## 🔧 Manual Deployment

### 1. Install Dependencies
```bash
npm install
```

### 2. Generate Prisma Client
```bash
npx prisma generate
```

### 3. Build Project
```bash
npm run build
```

### 4. Deploy
```bash
vercel --prod
```

## ⚙️ Required Environment Variables

Set these in your Vercel dashboard after deployment:

```env
DATABASE_URL=your-postgresql-connection-string
JWT_SECRET=your-super-secure-jwt-secret
FRONTEND_URL=https://your-app.vercel.app
NODE_ENV=production
```

## 📋 Post-Deployment Checklist

- [ ] Set environment variables in Vercel dashboard
- [ ] Run database migrations: `npx prisma migrate deploy`
- [ ] Test API health: `https://your-app.vercel.app/api/health`
- [ ] Test frontend: `https://your-app.vercel.app`

## 🆘 Need Help?

- Check the full guide: `VERCEL_DEPLOYMENT.md`
- View function logs in Vercel dashboard
- Test locally: `vercel dev`

## 🎯 What's Included

✅ Frontend (React + Vite)  
✅ Backend (Express.js API)  
✅ Database (PostgreSQL + Prisma)  
✅ Authentication (JWT + Google OAuth)  
✅ Rate Limiting  
✅ CORS Configuration  
✅ Security Headers  
✅ Health Check Endpoint
