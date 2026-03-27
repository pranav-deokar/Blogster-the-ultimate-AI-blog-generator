# 🚀 Quick Setup Guide

Follow these steps to get your AI Blog Generation System running:

## Step 1: Backend Setup (5 minutes)

```bash
cd backend
npm install
cp .env.example .env
```

Now edit `backend/.env` and add your OpenRouter API key:
```env
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxx  # Replace with your actual key
MODEL_NAME=anthropic/claude-3.5-sonnet
BASE_URL=https://openrouter.ai/api/v1
PORT=3001
FRONTEND_URL=http://localhost:5173
```

Get your API key from: https://openrouter.ai/keys

## Step 2: Frontend Setup (2 minutes)

```bash
cd ../frontend
npm install
cp .env.example .env
```

The default `.env` should work, but verify:
```env
VITE_API_URL=http://localhost:3001
```

## Step 3: Start the System

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

Wait for: `✅ Server running on port 3001`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Open: http://localhost:5173

## ✅ You're Ready!

1. Enter a keyword (e.g., "react hooks tutorial")
2. Click "Generate"
3. Watch the AI pipeline create your blog
4. Copy or download the result

## 🐛 Issues?

- Backend won't start? Check your API key in `.env`
- Frontend can't connect? Make sure backend is running first
- Port conflict? Change PORT in backend `.env`

## 🌐 Deploy to Production

See detailed deployment instructions in main README.md

Happy blogging! 🎉
