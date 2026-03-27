# 🌐 Deployment Guide

Complete guide for deploying the AI Blog Generation System to production.

## Overview

- **Frontend**: Static site (Vercel, Netlify, Cloudflare Pages)
- **Backend**: Node.js server (Render, Railway, Fly.io)
- **No Database Required**: Stateless architecture

---

## Option 1: Vercel (Frontend) + Render (Backend)

### Backend Deployment (Render)

1. **Create Render Account**: https://render.com

2. **New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select `backend` directory (or use root if you uploaded backend only)

3. **Configuration**:
   ```
   Name: ai-blog-backend
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   ```

4. **Environment Variables**:
   Add these in Render dashboard:
   ```
   OPENROUTER_API_KEY=your_actual_key
   MODEL_NAME=anthropic/claude-3.5-sonnet
   BASE_URL=https://openrouter.ai/api/v1
   PORT=3001
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend.vercel.app
   ```

5. **Deploy**: Click "Create Web Service"

6. **Copy Backend URL**: e.g., `https://ai-blog-backend.onrender.com`

### Frontend Deployment (Vercel)

1. **Create Vercel Account**: https://vercel.com

2. **Import Project**:
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Vercel auto-detects Vite

3. **Configuration**:
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Environment Variables**:
   ```
   VITE_API_URL=https://ai-blog-backend.onrender.com
   ```

5. **Deploy**: Click "Deploy"

6. **Update Backend**:
   - Go back to Render
   - Update `FRONTEND_URL` to your Vercel URL
   - Redeploy backend

---

## Option 2: Netlify (Frontend) + Railway (Backend)

### Backend Deployment (Railway)

1. **Create Railway Account**: https://railway.app

2. **New Project**:
   - Click "New Project"
   - "Deploy from GitHub repo"
   - Select your repository

3. **Configuration**:
   - Railway auto-detects Node.js
   - Set root directory to `backend` if needed

4. **Environment Variables**:
   Click "Variables" and add:
   ```
   OPENROUTER_API_KEY=your_actual_key
   MODEL_NAME=anthropic/claude-3.5-sonnet
   BASE_URL=https://openrouter.ai/api/v1
   FRONTEND_URL=https://your-site.netlify.app
   ```

5. **Domain**: Railway provides a URL like `xxx.railway.app`

### Frontend Deployment (Netlify)

1. **Create Netlify Account**: https://netlify.com

2. **Import Project**:
   - "Add new site" → "Import an existing project"
   - Connect to GitHub

3. **Configuration**:
   ```
   Base directory: frontend
   Build command: npm run build
   Publish directory: frontend/dist
   ```

4. **Environment Variables**:
   Site settings → Environment variables:
   ```
   VITE_API_URL=https://xxx.railway.app
   ```

5. **Deploy**: Netlify will auto-deploy

---

## Option 3: All-in-One (Render)

Deploy both frontend and backend on Render:

### Backend (Web Service)
Same as Option 1 above

### Frontend (Static Site)

1. **New Static Site** in Render

2. **Configuration**:
   ```
   Build Command: cd frontend && npm install && npm run build
   Publish Directory: frontend/dist
   ```

3. **Environment Variables**:
   ```
   VITE_API_URL=https://your-backend.onrender.com
   ```

---

## Environment Variables Reference

### Backend (.env)
```bash
# Required
OPENROUTER_API_KEY=sk-or-v1-xxxxxx
MODEL_NAME=anthropic/claude-3.5-sonnet
BASE_URL=https://openrouter.ai/api/v1

# Optional
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.com
```

### Frontend (.env)
```bash
# Required
VITE_API_URL=https://your-backend-url.com
```

---

## Post-Deployment Checklist

- [ ] Backend is accessible (test `/api/health`)
- [ ] Frontend loads without errors
- [ ] CORS is configured (FRONTEND_URL set correctly)
- [ ] Environment variables are set
- [ ] API key is valid and working
- [ ] Generate a test blog to verify full pipeline
- [ ] Check browser console for errors
- [ ] Test on mobile devices

---

## Custom Domain Setup

### Vercel/Netlify (Frontend)
1. Go to Domain Settings
2. Add your custom domain
3. Update DNS records as instructed
4. SSL is automatic

### Render/Railway (Backend)
1. Go to Settings → Custom Domain
2. Add your API subdomain (e.g., api.yourdomain.com)
3. Update DNS CNAME record
4. Update FRONTEND_URL in backend env vars

---

## Monitoring & Logs

### Render
- Logs tab shows real-time server logs
- Metrics shows CPU/Memory usage

### Railway
- Deployments tab for build logs
- Observability for metrics

### Vercel/Netlify
- Functions tab for serverless logs
- Analytics for traffic

---

## Scaling Considerations

### Free Tier Limits

**Render Free:**
- Sleeps after 15 min inactivity
- First request may be slow (cold start)
- 750 hours/month

**Railway Free:**
- $5 credit/month
- No sleep
- Pay as you go after credit

**Vercel/Netlify Free:**
- 100GB bandwidth/month
- Unlimited deployments

### Upgrade Recommendations

For production use:
- **Render**: $7/month for always-on
- **Railway**: ~$5-10/month typical usage
- **Vercel Pro**: $20/month (if needed)

---

## Troubleshooting Deployment

### "Cannot connect to backend"
- Check VITE_API_URL is correct
- Verify backend is running (visit health endpoint)
- Check browser console for CORS errors

### "API key invalid"
- Verify OPENROUTER_API_KEY in backend env
- Check for extra spaces or quotes
- Regenerate key if needed

### "Build failed"
- Check Node.js version (use 18+)
- Clear build cache and retry
- Review build logs for specific errors

### "CORS error"
- Update FRONTEND_URL in backend env
- Include protocol (https://)
- No trailing slash

---

## Security Best Practices

1. **Never commit .env files**
2. **Use environment variables** for all secrets
3. **Enable HTTPS** (automatic on most platforms)
4. **Set NODE_ENV=production** in backend
5. **Rotate API keys** periodically
6. **Monitor usage** on OpenRouter dashboard
7. **Rate limiting** (built into OpenRouter)

---

## Cost Estimation

### AI API Costs (OpenRouter)
- Claude 3.5 Sonnet: ~$0.02-0.05 per blog
- 100 blogs/month: ~$2-5
- 1000 blogs/month: ~$20-50

### Hosting Costs
- **Free tier**: $0 (with limitations)
- **Paid tier**: $7-20/month
- **Total estimated**: $10-75/month for moderate use

---

## Support

If you encounter issues:
1. Check deployment logs
2. Verify all environment variables
3. Test backend `/api/health` endpoint
4. Review this guide
5. Check platform-specific documentation

---

**Ready to deploy? Start with Option 1 for the easiest setup!** 🚀
