# 🚀 **RetroQuest To-Do - Production Deployment Guide**

## 📋 **Overview**
This guide will help you deploy RetroQuest To-Do to production using:
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: Neon PostgreSQL (already configured)

## 🎯 **Prerequisites**
- GitHub account with your code
- Vercel account (free)
- Render account (free)
- Google Cloud Console access (for OAuth)

---

## 🌐 **Step 1: Deploy Backend to Render**

### **1.1: Connect to Render**
1. Go to [render.com](https://render.com) and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select the repository containing your RetroQuest code

### **1.2: Configure Backend Service**
- **Name**: `retroquest-backend`
- **Root Directory**: `backend`
- **Environment**: `Node`
- **Build Command**: `npm install && npx prisma generate`
- **Start Command**: `npx prisma migrate deploy && npm start`

### **1.3: Set Environment Variables**
Add these environment variables in Render dashboard:

```bash
NODE_ENV=production
DATABASE_URL=postgresql://neondb_owner:npg_CAam1es2BQlw@ep-lively-meadow-adc7xn3v-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=your-super-secure-jwt-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

### **1.4: Deploy Backend**
1. Click "Create Web Service"
2. Wait for deployment to complete
3. Note your backend URL (e.g., `https://retroquest-backend.onrender.com`)

---

## ⚡ **Step 2: Deploy Frontend to Vercel**

### **2.1: Connect to Vercel**
1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "New Project"
3. Import your GitHub repository
4. Select the repository

### **2.2: Configure Frontend**
- **Framework Preset**: Vite
- **Root Directory**: `./` (root)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### **2.3: Set Environment Variables**
Add this environment variable in Vercel dashboard:

```bash
VITE_API_URL=https://your-backend-url.onrender.com/api
```

### **2.4: Deploy Frontend**
1. Click "Deploy"
2. Wait for deployment to complete
3. Note your frontend URL (e.g., `https://retroquest-todo.vercel.app`)

---

## 🔧 **Step 3: Update Google OAuth Settings**

### **3.1: Update Google Cloud Console**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to "APIs & Services" → "Credentials"
3. Edit your OAuth 2.0 Client ID
4. Add these Authorized redirect URIs:
   ```
   https://your-backend-url.onrender.com/api/auth/google/callback
   https://your-frontend-url.vercel.app/auth-callback
   ```

### **3.2: Update Environment Variables**
1. Go back to Render dashboard
2. Update `FRONTEND_URL` to your Vercel URL
3. Redeploy the backend service

---

## 🧪 **Step 4: Test Your Deployment**

### **4.1: Test Backend Health**
```bash
curl https://your-backend-url.onrender.com/api/health
```
Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-XX...",
  "database": "connected",
  "environment": "production"
}
```

### **4.2: Test Frontend**
1. Visit your Vercel URL
2. Try to register/login
3. Test Google OAuth
4. Create and complete tasks
5. Check gamification features

---

## 🔍 **Step 5: Troubleshooting**

### **Common Issues:**

**Backend Issues:**
- **Database Connection**: Check `DATABASE_URL` in Render
- **OAuth Errors**: Verify Google credentials and redirect URIs
- **CORS Errors**: Ensure `FRONTEND_URL` is correct

**Frontend Issues:**
- **API Connection**: Check `VITE_API_URL` in Vercel
- **Build Errors**: Check Vercel build logs
- **OAuth Redirect**: Verify callback URL

### **Debug Commands:**
```bash
# Check backend logs in Render dashboard
# Check frontend build logs in Vercel dashboard
# Test API endpoints with curl or Postman
```

---

## 🎉 **Step 6: Go Live!**

Once everything is working:

1. **Share your app**: `https://your-frontend-url.vercel.app`
2. **Monitor performance**: Check Vercel and Render dashboards
3. **Set up monitoring**: Consider adding Sentry for error tracking
4. **Backup strategy**: Your data is safe in Neon PostgreSQL

---

## 📊 **Post-Deployment Checklist**

- [ ] Backend health check passes
- [ ] Frontend loads without errors
- [ ] User registration works
- [ ] Google OAuth works
- [ ] Task creation/editing works
- [ ] Gamification features work
- [ ] Mobile responsiveness tested
- [ ] Performance is acceptable

---

## 🆘 **Support**

If you encounter issues:
1. Check the logs in Render/Vercel dashboards
2. Verify all environment variables are set correctly
3. Test locally first to isolate issues
4. Check the troubleshooting section above

**Your RetroQuest To-Do app is now live! 🎮✨**
