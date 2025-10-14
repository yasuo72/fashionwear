# Razorpay Payment Integration Setup Guide

## 🔑 Step 1: Get Your Razorpay Keys

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign in or create an account
3. Navigate to **Settings** → **API Keys**
4. Generate your **Key ID** and **Key Secret**
5. Copy both keys (you'll need them in the next step)

## 📝 Step 2: Configure Environment Variables

### Backend (.env file)
Add these to your `.env` file in the root directory:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_your_key_id_here
RAZORPAY_KEY_SECRET=your_key_secret_here
```

### Frontend (.env file)
Create/update `.env` file in the root directory:

```env
# Razorpay Public Key (for frontend)
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id_here
```

**Important:** 
- Use **test keys** for development (starts with `rzp_test_`)
- Use **live keys** for production (starts with `rzp_live_`)
- Never commit your `.env` file to Git!

## 📦 Step 3: Install Dependencies

Run this command to install Razorpay SDK:

```bash
npm install
```

The `razorpay` package is already added to package.json.

## 🚀 Step 4: Test the Integration

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Test the payment flow:**
   - Add items to cart
   - Go to checkout
   - Select "Razorpay" as payment method
   - Click "Pay ₹X" button
   - Razorpay payment modal will open

3. **Test Card Details (Test Mode):**
   - Card Number: `4111 1111 1111 1111`
   - Expiry: Any future date (e.g., `12/25`)
   - CVV: Any 3 digits (e.g., `123`)
   - Name: Any name

4. **Test UPI (Test Mode):**
   - UPI ID: `success@razorpay`
   - This will simulate a successful payment

## 🔒 Security Features

✅ **Payment Verification:** Server-side signature verification
✅ **Secure Transactions:** All payments processed through Razorpay
✅ **Order Tracking:** Payment details stored with order
✅ **Verified Purchase Badge:** For reviews

## 📋 Payment Flow

1. User selects Razorpay payment method
2. Clicks "Pay" button
3. Razorpay SDK loads and creates payment order
4. User completes payment in Razorpay modal
5. Payment verified on backend using signature
6. Order created with payment details
7. User redirected to orders page

## 🎯 Features Implemented

- ✅ Razorpay payment gateway integration
- ✅ Multiple payment methods (UPI, Cards, Netbanking, Wallets)
- ✅ Payment verification with signature
- ✅ Order creation with payment details
- ✅ Payment status tracking
- ✅ Secure payment processing
- ✅ Test and production mode support

## 🐛 Troubleshooting

### Issue: "Razorpay SDK failed to load"
**Solution:** Check your internet connection and ensure the Razorpay script can load.

### Issue: "Payment verification failed"
**Solution:** Ensure your `RAZORPAY_KEY_SECRET` is correct in the backend `.env` file.

### Issue: "Invalid Key ID"
**Solution:** Verify that `VITE_RAZORPAY_KEY_ID` in frontend matches your Razorpay dashboard key.

### Issue: Payment succeeds but order not created
**Solution:** Check backend logs for errors. Ensure MongoDB connection is working.

## 🌐 Production Deployment

### Railway Deployment:

1. **Add environment variables in Railway:**
   - Go to your Railway project
   - Click on "Variables" tab
   - Add:
     - `RAZORPAY_KEY_ID` = your_live_key_id
     - `RAZORPAY_KEY_SECRET` = your_live_key_secret
     - `VITE_RAZORPAY_KEY_ID` = your_live_key_id

2. **Switch to Live Mode:**
   - Replace test keys with live keys
   - Test thoroughly before going live

3. **Enable Webhooks (Optional):**
   - Set up webhooks in Razorpay dashboard
   - Add webhook endpoint: `https://your-domain.com/api/payment/webhook`

## 📞 Support

- **Razorpay Docs:** https://razorpay.com/docs/
- **Test Cards:** https://razorpay.com/docs/payments/payments/test-card-upi-details/
- **API Reference:** https://razorpay.com/docs/api/

## ✅ Checklist

- [ ] Razorpay account created
- [ ] API keys generated
- [ ] Environment variables configured
- [ ] Dependencies installed
- [ ] Test payment successful
- [ ] Payment verification working
- [ ] Order creation working
- [ ] Ready for production!

---

**Note:** Always test thoroughly in test mode before switching to live mode!
