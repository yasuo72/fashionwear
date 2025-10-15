# 🔐 How to Test Password Reset

## Quick Testing Guide

### **Step 1: Start Your Server**
```bash
npm run dev
```

### **Step 2: Go to Login Page**
```
http://localhost:5000/login
```

### **Step 3: Click "Forgot password?"**

### **Step 4: Enter Your Email**
- Use an email that exists in your database
- Example: `admin@fashionfusion.com` or any registered user

### **Step 5: Submit**
Click "Send Reset Link"

### **Step 6: Get Reset Link (3 Ways)**

#### **Option A: Copy from Success Page** ⭐ EASIEST
- After submitting, you'll see a success page
- The reset link will be displayed in a box
- Click the **Copy** button to copy it
- Paste it in your browser

#### **Option B: Check Server Console**
Look for output like this:
```
========================================
🔐 PASSWORD RESET REQUEST
========================================
Email: user@example.com
Reset Link: http://localhost:5000/reset-password?token=abc123xyz789
Token: abc123xyz789
Expires: 10/15/2025, 11:30:00 PM
========================================
```

#### **Option C: Check Browser Network Tab**
1. Open DevTools (F12)
2. Go to Network tab
3. Find the `forgot-password` request
4. Look at the Response
5. Copy the `resetUrl` value

### **Step 7: Open Reset Link**
- Click the link OR
- Paste it in your browser
- You'll be taken to the reset password page

### **Step 8: Enter New Password**
- Password must be at least 6 characters
- Enter it twice (password + confirm)
- Click "Reset Password"

### **Step 9: Success!**
- You'll see a success message
- Auto-redirected to login page after 2 seconds
- Login with your new password

---

## 🎯 Visual Guide

```
Login Page
    ↓
Click "Forgot password?"
    ↓
Enter Email → Submit
    ↓
Success Page Shows:
┌─────────────────────────────────────┐
│  ✅ Reset Link Generated!           │
│                                     │
│  🔧 DEVELOPMENT MODE                │
│  Copy this link:                    │
│  ┌───────────────────────┐ [Copy]  │
│  │ http://localhost:...  │         │
│  └───────────────────────┘         │
└─────────────────────────────────────┘
    ↓
Click Link or Paste in Browser
    ↓
Reset Password Page
    ↓
Enter New Password (2x)
    ↓
Success! → Login
```

---

## 🐛 Troubleshooting

### **"Invalid or expired reset token"**
- Token expired (1 hour limit)
- Request a new reset link
- Make sure you copied the full link

### **"Email not found"**
- User doesn't exist in database
- Create an account first
- Or use an existing email

### **Reset link not showing**
- Check server console
- Make sure server is running
- Check browser console for errors

### **Can't copy link**
- Manually copy from server console
- Or use browser DevTools Network tab

---

## 📧 Production Setup (Real Emails)

To send actual emails instead of showing links:

1. **Install nodemailer:**
```bash
npm install nodemailer @types/nodemailer
```

2. **Add to `.env`:**
```env
NODE_ENV=production
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

3. **Update code** (see `PASSWORD_RESET_GUIDE.md`)

---

## ✅ Test Checklist

- [ ] Can access forgot password page
- [ ] Can submit email
- [ ] Reset link appears on success page
- [ ] Can copy reset link
- [ ] Reset link opens correctly
- [ ] Can enter new password
- [ ] Password validation works
- [ ] Can reset password successfully
- [ ] Can login with new password
- [ ] Token expires after 1 hour

---

## 💡 Pro Tips

1. **Quick Test:** Use the copy button on success page
2. **Debug:** Check server console for detailed logs
3. **Token:** Valid for 1 hour only
4. **Security:** In production, links won't be shown
5. **Email:** Use a real email that exists in your DB

---

**Happy Testing!** 🚀
