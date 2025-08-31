@echo off
echo 🚀 Starting Vercel deployment for RetroQuest...

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Vercel CLI is not installed. Installing...
    npm install -g vercel
)

REM Check if user is logged in to Vercel
vercel whoami >nul 2>&1
if errorlevel 1 (
    echo 🔐 Please log in to Vercel...
    vercel login
)

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Generate Prisma client
echo 🔧 Generating Prisma client...
npx prisma generate

REM Build the project
echo 🏗️ Building the project...
npm run build

REM Deploy to Vercel
echo 🚀 Deploying to Vercel...
vercel --prod

echo ✅ Deployment completed!
echo 📋 Next steps:
echo 1. Set up environment variables in Vercel dashboard
echo 2. Run database migrations: npx prisma migrate deploy
echo 3. Test your application
echo 4. Check the deployment guide: VERCEL_DEPLOYMENT.md

pause
