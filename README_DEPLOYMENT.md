# FashionFusion - Vercel Deployment Guide

## 🚀 Prerequisites

Before deploying to Vercel, ensure you have:

1. ✅ A [Vercel account](https://vercel.com/signup)
2. ✅ [Vercel CLI](https://vercel.com/cli) installed (optional but recommended)
3. ✅ Git repository (GitHub, GitLab, or Bitbucket)
4. ✅ Database setup (MongoDB Atlas or similar)

## 📋 Pre-Deployment Checklist

### 1. Environment Variables

Create a `.env` file with the following variables (these will be added to Vercel):

```env
# Database
DATABASE_URL=your_mongodb_connection_string
MONGODB_URI=your_mongodb_connection_string

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here

# Session Secret
SESSION_SECRET=your_session_secret_here

# Node Environment
NODE_ENV=production

# API URL (will be your Vercel domain)
VITE_API_URL=https://your-app.vercel.app

# Optional: Payment Gateway Keys
STRIPE_SECRET_KEY=your_stripe_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### 2. Database Setup

**MongoDB Atlas (Recommended):**

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist all IP addresses (0.0.0.0/0) for Vercel
5. Get your connection string
6. Replace `<password>` with your database user password

Example connection string:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/fashionfusion?retryWrites=true&w=majority
```

### 3. Update API Endpoints (if needed)

Check that all API calls in your frontend use relative paths or environment variables:

```typescript
// Good ✅
fetch('/api/products')

// Or with env variable ✅
fetch(`${import.meta.env.VITE_API_URL}/api/products`)
```

## 🌐 Deployment Methods

### Method 1: Deploy via Vercel Dashboard (Easiest)

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/fashionfusion.git
   git push -u origin main
   ```

2. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**

3. **Click "Add New Project"**

4. **Import your Git repository**

5. **Configure Project:**
   - Framework Preset: `Vite`
   - Root Directory: `./` (leave as is)
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

6. **Add Environment Variables:**
   Click "Environment Variables" and add all variables from your `.env` file

7. **Click "Deploy"**

8. **Wait for deployment** (usually 2-3 minutes)

### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Follow the prompts:**
   - Set up and deploy? `Y`
   - Which scope? Select your account
   - Link to existing project? `N`
   - Project name? `fashionfusion` (or your preferred name)
   - In which directory is your code located? `./`

5. **Add environment variables:**
   ```bash
   vercel env add DATABASE_URL
   vercel env add JWT_SECRET
   vercel env add SESSION_SECRET
   # Add all other env variables
   ```

6. **Deploy to production:**
   ```bash
   vercel --prod
   ```

## 🔧 Post-Deployment Configuration

### 1. Seed Database (First Time Only)

After deployment, seed your database with initial data:

```bash
# Locally with production database
npm run seed
```

Or create a Vercel Function to seed data.

### 2. Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

### 3. Environment Variables Management

To update environment variables:

**Via Dashboard:**
1. Go to Project Settings → Environment Variables
2. Add/Edit/Delete variables
3. Redeploy for changes to take effect

**Via CLI:**
```bash
vercel env add VARIABLE_NAME
vercel env rm VARIABLE_NAME
vercel env ls
```

## 📊 Monitoring & Logs

### View Deployment Logs:
1. Go to your project in Vercel Dashboard
2. Click on "Deployments"
3. Click on any deployment to see logs

### Real-time Logs (CLI):
```bash
vercel logs
```

## 🐛 Troubleshooting

### Build Fails

**Issue:** Build command fails
**Solution:** 
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node version compatibility

### Database Connection Issues

**Issue:** Cannot connect to database
**Solution:**
- Verify `DATABASE_URL` is correct
- Ensure MongoDB Atlas allows connections from all IPs (0.0.0.0/0)
- Check database user permissions

### API Routes Not Working

**Issue:** 404 on API routes
**Solution:**
- Verify `vercel.json` configuration
- Check that routes are properly defined
- Ensure server code is in correct directory

### Environment Variables Not Loading

**Issue:** App can't access env variables
**Solution:**
- Redeploy after adding env variables
- Use `process.env.VARIABLE_NAME` for server
- Use `import.meta.env.VITE_VARIABLE_NAME` for client
- Ensure client variables are prefixed with `VITE_`

## 🔒 Security Checklist

- ✅ All sensitive keys in environment variables
- ✅ `.env` file in `.gitignore`
- ✅ CORS configured properly
- ✅ Rate limiting enabled
- ✅ Input validation on all endpoints
- ✅ SQL injection prevention
- ✅ XSS protection enabled
- ✅ HTTPS enforced (automatic on Vercel)

## 📈 Performance Optimization

### Enable Caching:
Add to `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### Image Optimization:
Use Vercel's built-in image optimization:
```typescript
import Image from 'next/image' // If using Next.js
```

## 🔄 Continuous Deployment

Vercel automatically deploys when you push to your main branch:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

Vercel will:
1. Detect the push
2. Run build
3. Deploy to production
4. Update your live site

## 📱 Testing Deployment

After deployment, test:

1. ✅ Homepage loads
2. ✅ User registration/login works
3. ✅ Product browsing works
4. ✅ Cart functionality works
5. ✅ Checkout process works
6. ✅ Order placement works
7. ✅ Admin dashboard accessible
8. ✅ All API endpoints respond
9. ✅ Images load correctly
10. ✅ Mobile responsiveness

## 🆘 Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)

## 🎉 Success!

Your FashionFusion e-commerce site is now live on Vercel!

**Next Steps:**
1. Share your live URL
2. Monitor analytics
3. Set up error tracking (Sentry, etc.)
4. Configure email notifications
5. Add payment gateway in production mode

---

**Live URL:** `https://your-project.vercel.app`

**Admin Panel:** `https://your-project.vercel.app/admin`

**API Endpoint:** `https://your-project.vercel.app/api`
