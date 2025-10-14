# 🚀 Vercel Deployment Checklist

## ✅ Pre-Deployment Steps

### 1. Environment Setup
- [ ] Create MongoDB Atlas account and cluster
- [ ] Get MongoDB connection string
- [ ] Generate JWT secret (use: `openssl rand -base64 32`)
- [ ] Generate Session secret (use: `openssl rand -base64 32`)
- [ ] Copy `.env.example` to `.env` and fill in values

### 2. Code Preparation
- [ ] All features tested locally
- [ ] No console.errors or warnings
- [ ] Build runs successfully (`npm run build`)
- [ ] All dependencies in `package.json`
- [ ] No hardcoded API URLs (use environment variables)

### 3. Database Setup
- [ ] MongoDB Atlas cluster created
- [ ] Database user created with password
- [ ] Network access set to 0.0.0.0/0 (allow all IPs)
- [ ] Connection string tested locally
- [ ] Database seeded with initial data (`npm run seed`)

### 4. Git Repository
- [ ] Code pushed to GitHub/GitLab/Bitbucket
- [ ] `.env` file NOT in repository (check `.gitignore`)
- [ ] All changes committed
- [ ] Repository is public or Vercel has access

## 🌐 Deployment Steps

### Option A: Vercel Dashboard (Recommended)

1. [ ] Go to https://vercel.com/dashboard
2. [ ] Click "Add New Project"
3. [ ] Import your Git repository
4. [ ] Configure build settings:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. [ ] Add environment variables (see list below)
6. [ ] Click "Deploy"
7. [ ] Wait for deployment to complete

### Option B: Vercel CLI

1. [ ] Install Vercel CLI: `npm install -g vercel`
2. [ ] Login: `vercel login`
3. [ ] Run: `vercel`
4. [ ] Add environment variables: `vercel env add VARIABLE_NAME`
5. [ ] Deploy to production: `vercel --prod`

## 🔐 Environment Variables to Add in Vercel

Copy these from your `.env` file to Vercel:

```
DATABASE_URL
MONGODB_URI
JWT_SECRET
SESSION_SECRET
NODE_ENV=production
VITE_API_URL (your Vercel domain)
```

Optional (if using):
```
STRIPE_SECRET_KEY
STRIPE_PUBLISHABLE_KEY
RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
SMTP_HOST
SMTP_PORT
SMTP_USER
SMTP_PASS
```

## ✨ Post-Deployment Steps

### 1. Verify Deployment
- [ ] Homepage loads correctly
- [ ] All images display
- [ ] Navigation works
- [ ] Search functionality works
- [ ] User can register
- [ ] User can login
- [ ] Products display correctly
- [ ] Cart functionality works
- [ ] Checkout process works
- [ ] Admin panel accessible
- [ ] Blog pages load
- [ ] Contact form works

### 2. Test All Features
- [ ] Browse products by category
- [ ] Add items to cart
- [ ] Update cart quantities
- [ ] Remove items from cart
- [ ] Wishlist functionality
- [ ] Product search
- [ ] Product filters
- [ ] User profile
- [ ] Order placement
- [ ] Order history
- [ ] Payment methods (if integrated)
- [ ] Chatbot functionality
- [ ] Mobile responsiveness

### 3. Performance Check
- [ ] Page load speed acceptable
- [ ] Images optimized
- [ ] No console errors
- [ ] API responses fast
- [ ] Database queries optimized

### 4. SEO & Analytics (Optional)
- [ ] Add meta tags
- [ ] Set up Google Analytics
- [ ] Add sitemap
- [ ] Configure robots.txt
- [ ] Set up error tracking (Sentry)

### 5. Custom Domain (Optional)
- [ ] Purchase domain
- [ ] Add domain in Vercel
- [ ] Configure DNS records
- [ ] Wait for SSL certificate
- [ ] Verify domain works

## 🐛 Common Issues & Solutions

### Build Fails
**Problem:** Build command fails
**Solution:** 
- Check build logs in Vercel
- Verify all dependencies installed
- Test `npm run build` locally

### Database Connection Error
**Problem:** Can't connect to MongoDB
**Solution:**
- Verify DATABASE_URL is correct
- Check MongoDB Atlas IP whitelist (0.0.0.0/0)
- Ensure database user has correct permissions

### 404 on API Routes
**Problem:** API endpoints return 404
**Solution:**
- Check `vercel.json` configuration
- Verify route definitions
- Ensure server code is built correctly

### Environment Variables Not Working
**Problem:** App can't read env variables
**Solution:**
- Redeploy after adding variables
- Use correct prefix (VITE_ for client-side)
- Check variable names match exactly

## 📊 Monitoring

### View Logs
- Vercel Dashboard → Your Project → Deployments → Click deployment → View logs
- Or use CLI: `vercel logs`

### Analytics
- Vercel Dashboard → Your Project → Analytics
- Monitor page views, performance, errors

## 🎉 Success Criteria

Your deployment is successful when:
- ✅ Site loads at your Vercel URL
- ✅ All pages accessible
- ✅ User can complete full purchase flow
- ✅ Admin can manage products
- ✅ No errors in browser console
- ✅ Mobile version works perfectly
- ✅ All API endpoints responding
- ✅ Database operations working

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review MongoDB Atlas logs
3. Test locally with production database
4. Check Vercel documentation
5. Search Vercel community forums

---

## 🚀 Quick Deploy Commands

```bash
# Initial setup
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_REPO_URL
git push -u origin main

# Deploy via CLI
vercel login
vercel
vercel --prod

# Update deployment
git add .
git commit -m "Update"
git push origin main
# Vercel auto-deploys on push!
```

---

**Your FashionFusion e-commerce site will be live at:**
`https://your-project-name.vercel.app`

**Enjoy your deployment! 🎊**
