# 🚀 LearnPath Deployment Guide

## Part 1: MongoDB Atlas Setup (5 minutes)

### 1. Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up with Google/Email
3. Choose **FREE** M0 cluster (512MB storage)

### 2. Create a Cluster
1. Click "Build a Database" → Choose **FREE** tier
2. Select **AWS** provider
3. Choose region closest to you (e.g., N. Virginia / Mumbai)
4. Cluster name: `LearnPath` (or keep default)
5. Click "Create"

### 3. Setup Database Access
1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. **Authentication Method:** Password
4. **Username:** `learnpath-admin` (or your choice)
5. **Password:** Click "Autogenerate Secure Password" → **COPY IT!**
6. **Database User Privileges:** Select "Read and write to any database"
7. Click "Add User"

### 4. Setup Network Access
1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### 5. Get Connection String
1. Go to "Database" in left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Driver: **Node.js**, Version: **5.5 or later**
5. Copy the connection string (looks like):
   ```
   mongodb+srv://learnpath-admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<password>` with your actual password
7. Add database name after `.net/`: `/learnpath`

Final connection string:
```
mongodb+srv://learnpath-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/learnpath?retryWrites=true&w=majority
```

---

## Part 2: Deploy Backend to Render

### 1. Prepare Backend for Deployment
Already done! Your backend is production-ready.

### 2. Deploy to Render
1. Go to https://render.com and sign up with GitHub
2. Click "New +" → "Web Service"
3. Connect your GitHub repository (or use "Public Git Repository" with your repo URL)
4. **Settings:**
   - Name: `learnpath-backend`
   - Region: Choose closest to you
   - Branch: `main` or `cute` (your current branch)
   - Root Directory: `backend`
   - Runtime: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: **Free**

5. **Environment Variables** - Click "Add Environment Variable":
   ```
   PORT=5050
   MONGO_URI=mongodb+srv://learnpath-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/learnpath?retryWrites=true&w=majority
   NODE_ENV=production
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
   JWT_EXPIRES_IN=7d
   ```

6. Click "Create Web Service"
7. Wait 5-10 minutes for deployment
8. **Copy your backend URL**: `https://learnpath-backend-xxxx.onrender.com`

---

## Part 3: Deploy Frontend to Vercel

### 1. Update Frontend API URL
We'll use environment variable for this (already set up in next step)

### 2. Deploy to Vercel
1. Go to https://vercel.com and sign up with GitHub
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. **Configure Project:**
   - Framework Preset: **Vite**
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

5. **Environment Variables** - Add these:
   ```
   VITE_API_URL=https://learnpath-backend-xxxx.onrender.com/api
   ```
   (Replace with your actual Render backend URL)

6. Click "Deploy"
7. Wait 2-3 minutes
8. **Your app is live!** Copy the URL: `https://learnpath-xxxx.vercel.app`

---

## Part 4: Update Frontend to Use Environment Variable

Your frontend needs to read from environment variable instead of hardcoded localhost.

---

## Part 5: Test Your Deployment

1. Open your Vercel URL: `https://learnpath-xxxx.vercel.app`
2. Register a new account
3. Test login, skills, resources, etc.
4. Check backend logs on Render dashboard if errors occur

---

## Important Notes

### Free Tier Limitations:
- **Render:** Backend sleeps after 15 mins of inactivity (wakes up in ~30 seconds on first request)
- **MongoDB Atlas:** 512MB storage limit (enough for thousands of users)
- **Vercel:** Unlimited bandwidth for personal projects

### Backend URL on Render:
- Free tier uses: `https://your-app.onrender.com`
- Takes ~30 seconds to wake up from sleep
- Consider adding loading state: "Waking up server..."

### CORS Configuration:
Already set up to accept requests from any origin (production-ready)

### Security Checklist:
✅ JWT secret is environment variable
✅ MongoDB connection string is environment variable
✅ Passwords are hashed with bcrypt
✅ CORS enabled
✅ .env files in .gitignore

---

## Troubleshooting

### Backend won't start on Render:
- Check logs in Render dashboard
- Verify MongoDB connection string is correct
- Ensure all environment variables are set

### Frontend can't connect to backend:
- Check VITE_API_URL in Vercel environment variables
- Verify backend is running (visit backend URL directly)
- Check browser console for CORS errors

### MongoDB connection failed:
- Verify password has no special characters (or URL encode them)
- Check IP whitelist includes 0.0.0.0/0
- Ensure database name is in connection string

---

## Post-Deployment

1. **Create First Admin User:**
   - Register a new account on your deployed app
   - SSH into Render (or use Render shell)
   - Run: `node src/scripts/makeAdmin.js user@email.com`

2. **Custom Domain (Optional):**
   - Vercel: Add custom domain in project settings
   - Render: Add custom domain in service settings

3. **Monitoring:**
   - Render provides logs and metrics
   - Vercel provides analytics
   - MongoDB Atlas shows database metrics

---

## Quick Reference

**MongoDB Atlas Dashboard:** https://cloud.mongodb.com
**Render Dashboard:** https://dashboard.render.com
**Vercel Dashboard:** https://vercel.com/dashboard

**Backend URL:** https://learnpath-backend-xxxx.onrender.com
**Frontend URL:** https://learnpath-xxxx.vercel.app

---

🎉 Your LearnPath app is now live and accessible from anywhere in the world!
