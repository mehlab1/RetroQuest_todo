#!/bin/bash

echo "🚀 Starting RetroQuest Backend Deployment..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "🗄️ Running database migrations..."
npx prisma migrate deploy

# Start the application
echo "🎮 Starting RetroQuest Backend..."
npm start
