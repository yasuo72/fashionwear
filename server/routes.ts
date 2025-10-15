import express, { type Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";
import { authenticate, isAdmin, type AuthRequest } from "./middleware/auth";
import { generateToken, setTokenCookie, clearTokenCookie } from "./utils/jwt";

import User from "./models/User";
import Address from "./models/Address";
import Category from "./models/Category";
import Product from "./models/Product";
import Cart from "./models/Cart";
import Order from "./models/Order";
import Wishlist from "./models/Wishlist";
import Review from "./models/Review";
import Coupon from "./models/Coupon";
import Banner from "./models/Banner";
import SiteSettings from "./models/SiteSettings";

export async function registerRoutes(app: express.Application): Promise<Server> {
  
  // ==================== AUTH ROUTES ====================
  
  // Register
  app.post(
    "/api/auth/register",
    [
      body("email").isEmail().normalizeEmail(),
      body("password").isLength({ min: 6 }),
      body("firstName").trim().notEmpty(),
      body("lastName").trim().notEmpty(),
    ],
    async (req: any, res: any) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        const { email, password, firstName, lastName, phone } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ error: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
          email,
          password: hashedPassword,
          firstName,
          lastName,
          phone,
        });

        const token = generateToken({
          id: (user._id as any).toString(),
          email: user.email,
          role: user.role,
        });

        setTokenCookie(res, token);

        res.status(201).json({
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          },
        });
      } catch (error) {
        res.status(500).json({ error: "Server error" });
      }
    }
  );

  // Login
  app.post(
    "/api/auth/login",
    [
      body("email").isEmail().normalizeEmail(),
      body("password").notEmpty(),
    ],
    async (req: any, res: any) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
          return res.status(401).json({ error: "Invalid credentials" });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = generateToken({
          id: (user._id as any).toString(),
          email: user.email,
          role: user.role,
        });

        setTokenCookie(res, token);

        res.json({
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          },
        });
      } catch (error) {
        res.status(500).json({ error: "Server error" });
      }
    }
  );

  // Logout
  app.post("/api/auth/logout", (req, res) => {
    clearTokenCookie(res);
    res.json({ message: "Logged out successfully" });
  });

  // Forgot Password - Request reset token
  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        // Don't reveal if user exists or not for security
        return res.json({ message: "If the email exists, a reset link has been sent" });
      }

      // Generate reset token (simple version - in production use crypto)
      const resetToken = Math.random().toString(36).substring(2, 15) + 
                        Math.random().toString(36).substring(2, 15);
      
      // Hash the token before saving
      const hashedToken = await bcrypt.hash(resetToken, 10);
      
      // Set token and expiry (1 hour)
      user.resetPasswordToken = hashedToken;
      user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
      await user.save();

      // Generate reset URL based on request origin
      const origin = req.get('origin') || req.get('referer')?.split('/').slice(0, 3).join('/') || 
                     process.env.VITE_API_URL || 'http://localhost:5000';
      const resetUrl = `${origin}/reset-password?token=${resetToken}`;
      
      console.log('\n========================================');
      console.log('🔐 PASSWORD RESET REQUEST');
      console.log('========================================');
      console.log('Email:', email);
      console.log('Reset Link:', resetUrl);
      console.log('Token:', resetToken);
      console.log('Expires:', new Date(Date.now() + 3600000).toLocaleString());
      console.log('========================================\n');

      res.json({ 
        message: "Password reset link generated successfully",
        // Return reset link (until email is configured)
        resetUrl: resetUrl,
        // Only show token in development for debugging
        resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({ error: "Server error" });
    }
  });

  // Reset Password - Using token
  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { token, password } = req.body;

      if (!token || !password) {
        return res.status(400).json({ error: "Token and password are required" });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
      }

      // Find user with valid reset token
      const users = await User.find({
        resetPasswordExpires: { $gt: Date.now() }
      });

      let user = null;
      for (const u of users) {
        if (u.resetPasswordToken) {
          const isValid = await bcrypt.compare(token, u.resetPasswordToken);
          if (isValid) {
            user = u;
            break;
          }
        }
      }

      if (!user) {
        return res.status(400).json({ error: "Invalid or expired reset token" });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Update password and clear reset fields
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      res.json({ message: "Password reset successful" });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({ error: "Server error" });
    }
  });

  // Get current user
  app.get("/api/auth/me", authenticate, async (req: AuthRequest, res: Response) => {
    try {
      const user = await User.findById(req.user!.id).select("-password");
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ user });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  // ==================== USER PROFILE ROUTES ====================

  // Update profile
  app.patch("/api/user/profile", authenticate, async (req: AuthRequest, res: Response) => {
    try {
      const { firstName, lastName, phone, bio, address, preferences } = req.body;
      
      const updateData: any = {};
      if (firstName) updateData.firstName = firstName;
      if (lastName) updateData.lastName = lastName;
      if (phone !== undefined) updateData.phone = phone;
      if (bio !== undefined) updateData.bio = bio;
      if (address) updateData.address = address;
      if (preferences) updateData.preferences = preferences;

      const user = await User.findByIdAndUpdate(
        req.user!.id,
        updateData,
        { new: true, runValidators: true }
      ).select("-password");

      res.json({ user });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  // Update profile image
  app.patch("/api/user/profile/image", authenticate, async (req: AuthRequest, res: Response) => {
    try {
      const { profileImage } = req.body;
      
      if (!profileImage) {
        return res.status(400).json({ error: "Profile image URL is required" });
      }

      const user = await User.findByIdAndUpdate(
        req.user!.id,
        { profileImage },
        { new: true, runValidators: true }
      ).select("-password");

      res.json({ user });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  // Change password (when logged in)
  app.post("/api/user/change-password", authenticate, async (req: AuthRequest, res: Response) => {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: "Current and new password are required" });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ error: "New password must be at least 6 characters" });
      }

      const user = await User.findById(req.user!.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Current password is incorrect" });
      }

      // Hash and update new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();

      res.json({ message: "Password changed successfully" });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({ error: "Server error" });
    }
  });

  // Delete account
  app.delete("/api/user/account", authenticate, async (req: AuthRequest, res: Response) => {
    try {
      const { password } = req.body;

      if (!password) {
        return res.status(400).json({ error: "Password is required to delete account" });
      }

      const user = await User.findById(req.user!.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Incorrect password" });
      }

      // Delete user's data
      await Cart.deleteMany({ user: req.user!.id });
      await Wishlist.deleteMany({ user: req.user!.id });
      await Order.updateMany({ user: req.user!.id }, { user: null });
      await Review.updateMany({ user: req.user!.id }, { user: null });
      await Address.deleteMany({ user: req.user!.id });
      
      // Delete user
      await User.findByIdAndDelete(req.user!.id);

      // Clear cookie
      clearTokenCookie(res);

      res.json({ message: "Account deleted successfully" });
    } catch (error) {
      console.error('Delete account error:', error);
      res.status(500).json({ error: "Server error" });
    }
  });

  // ==================== ADDRESS ROUTES ====================

  // Get user addresses
  app.get("/api/addresses", authenticate, async (req: AuthRequest, res: Response) => {
    try {
      const addresses = await Address.find({ userId: req.user!.id });
      res.json({ addresses });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  // Create address
  app.post("/api/addresses", authenticate, async (req: AuthRequest, res: Response) => {
    try {
      const { label, street, city, state, zipCode, country, phone, isDefault } = req.body;

      if (isDefault) {
        await Address.updateMany(
          { userId: req.user!.id },
          { isDefault: false }
        );
      }

      const address = await Address.create({
        userId: req.user!.id,
        label,
        street,
        city,
        state,
        zipCode,
        country,
        phone,
        isDefault,
      });

      res.status(201).json({ address });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  // Update address
  app.patch("/api/addresses/:id", authenticate, async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { label, street, city, state, zipCode, country, phone, isDefault } = req.body;

      if (isDefault) {
        await Address.updateMany(
          { userId: req.user!.id },
          { isDefault: false }
        );
      }

      const address = await Address.findOneAndUpdate(
        { _id: id, userId: req.user!.id },
        { label, street, city, state, zipCode, country, phone, isDefault },
        { new: true }
      );

      if (!address) {
        return res.status(404).json({ error: "Address not found" });
      }

      res.json({ address });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  // Delete address
  app.delete("/api/addresses/:id", authenticate, async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const address = await Address.findOneAndDelete({ _id: id, userId: req.user!.id });

      if (!address) {
        return res.status(404).json({ error: "Address not found" });
      }

      res.json({ message: "Address deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  // ==================== CATEGORY ROUTES ====================

  // Get all categories
  app.get("/api/categories", async (req: Request, res: Response) => {
    try {
      const categories = await Category.find({ isActive: true });
      
      // Add product count for each category (including subcategories)
      const categoriesWithCount = await Promise.all(
        categories.map(async (category) => {
          // Count products in this category
          const directCount = await Product.countDocuments({ 
            categoryId: category._id,
            isActive: true 
          });
          
          // Count products in subcategories
          const subcategories = await Category.find({ 
            parentId: category._id,
            isActive: true 
          });
          
          let subcategoryCount = 0;
          for (const subcat of subcategories) {
            const count = await Product.countDocuments({ 
              categoryId: subcat._id,
              isActive: true 
            });
            subcategoryCount += count;
          }
          
          return {
            ...category.toObject(),
            productCount: directCount + subcategoryCount
          };
        })
      );
      
      res.json({ categories: categoriesWithCount });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  // Get category by slug
  app.get("/api/categories/:slug", async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const category = await Category.findOne({ slug, isActive: true });
      
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }

      res.json({ category });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  // Get unique brands
  app.get("/api/brands", async (req: Request, res: Response) => {
    try {
      const allBrands = await Product.distinct("brand", { isActive: true });
      // Filter out null, undefined, and empty strings
      const brands = allBrands.filter((brand: any) => brand && brand.trim() !== "").sort();
      res.json({ brands });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  // ==================== PRODUCT ROUTES ====================

  // Get all products with filters
  app.get("/api/products", async (req: Request, res: Response) => {
    try {
      const {
        category,
        minPrice,
        maxPrice,
        brand,
        search,
        sort = "createdAt",
        order = "desc",
        page = 1,
        limit = 20,
      } = req.query;

      const query: any = { isActive: true };

      if (category) {
        const cat = await Category.findOne({ slug: category });
        if (cat) {
          query.categoryId = cat._id;
        }
      }

      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }

      if (brand) {
        query.brand = { $regex: brand, $options: "i" };
      }

      if (search) {
        // Use regex search for better compatibility
        query.$or = [
          { name: { $regex: search as string, $options: 'i' } },
          { description: { $regex: search as string, $options: 'i' } },
          { brand: { $regex: search as string, $options: 'i' } },
          { tags: { $in: [new RegExp(search as string, 'i')] } }
        ];
      }

      const sortOrder = order === "asc" ? 1 : -1;
      const sortQuery: any = { [sort as string]: sortOrder };

      const skip = (Number(page) - 1) * Number(limit);

      const [products, total] = await Promise.all([
        Product.find(query)
          .sort(sortQuery)
          .skip(skip)
          .limit(Number(limit))
          .populate("categoryId", "name slug"),
        Product.countDocuments(query),
      ]);

      res.json({
        products,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  // Get product by slug
  app.get("/api/products/:slug", async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const product = await Product.findOne({ slug, isActive: true })
        .populate("categoryId", "name slug");

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.json({ product });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  // ==================== CART ROUTES ====================

  // Get cart
  app.get("/api/cart", authenticate, async (req: AuthRequest, res: Response) => {
    try {
      let cart = await Cart.findOne({ userId: req.user!.id }).populate("items.productId");

      if (!cart) {
        cart = await Cart.create({ userId: req.user!.id, items: [] });
      }

      res.json({ cart });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  // Add to cart
  app.post("/api/cart", authenticate, async (req: AuthRequest, res: Response) => {
    try {
      const { productId, quantity, size, color, price } = req.body;

      let cart = await Cart.findOne({ userId: req.user!.id });

      if (!cart) {
        cart = await Cart.create({ userId: req.user!.id, items: [] });
      }

      const existingItemIndex = cart.items.findIndex(
        (item) =>
          item.productId.toString() === productId &&
          item.size === size &&
          item.color === color
      );

      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity, size, color, price });
      }

      await cart.save();
      await cart.populate("items.productId");

      res.json({ cart });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  // Update cart item
  app.patch("/api/cart/:itemId", authenticate, async (req: AuthRequest, res: Response) => {
    try {
      const { itemId } = req.params;
      const { quantity } = req.body;

      const cart = await Cart.findOne({ userId: req.user!.id });

      if (!cart) {
        return res.status(404).json({ error: "Cart not found" });
      }

      const itemIndex = cart.items.findIndex((item: any) => item._id.toString() === itemId);
      
      if (itemIndex === -1) {
        return res.status(404).json({ error: "Cart item not found" });
      }

      if (quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantity;
      }

      await cart.save();
      await cart.populate("items.productId");

      res.json({ cart });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  // Remove from cart
  app.delete("/api/cart/:itemId", authenticate, async (req: AuthRequest, res: Response) => {
    try {
      const { itemId } = req.params;

      const cart = await Cart.findOne({ userId: req.user!.id });

      if (!cart) {
        return res.status(404).json({ error: "Cart not found" });
      }

      cart.items = cart.items.filter((item: any) => item._id.toString() !== itemId);
      await cart.save();
      await cart.populate("items.productId");

      res.json({ cart });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  // Clear cart
  app.delete("/api/cart", authenticate, async (req: AuthRequest, res: Response) => {
    try {
      const cart = await Cart.findOneAndUpdate(
        { userId: req.user!.id },
        { items: [] },
        { new: true }
      );

      res.json({ cart });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  // ==================== PAYMENT ROUTES ====================

  // Create Razorpay order
  app.post("/api/payment/create-order", authenticate, async (req: AuthRequest, res) => {
    try {
      const Razorpay = (await import('razorpay')).default;
      
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID!,
        key_secret: process.env.RAZORPAY_KEY_SECRET!,
      });

      const { amount, currency = 'INR' } = req.body;

      const options = {
        amount: amount * 100, // amount in smallest currency unit (paise)
        currency,
        receipt: `receipt_${Date.now()}`,
        payment_capture: 1,
      };

      const order = await razorpay.orders.create(options);
      res.json({ order });
    } catch (error) {
      console.error('Razorpay order creation error:', error);
      res.status(500).json({ error: "Failed to create payment order" });
    }
  });

  // Verify Razorpay payment
  app.post("/api/payment/verify", authenticate, async (req: AuthRequest, res) => {
    try {
      const crypto = await import('crypto');
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

      const sign = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSign = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
        .update(sign.toString())
        .digest("hex");

      if (razorpay_signature === expectedSign) {
        res.json({ 
          success: true, 
          message: "Payment verified successfully",
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id
        });
      } else {
        res.status(400).json({ success: false, message: "Invalid signature" });
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      res.status(500).json({ error: "Payment verification failed" });
    }
  });

  // ==================== ORDER ROUTES ====================

  // Get user orders
  app.get("/api/orders", authenticate, async (req: AuthRequest, res) => {
    try {
      const orders = await Order.find({ userId: req.user!.id }).sort({ createdAt: -1 });
      res.json({ orders });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  // Get order by ID
  app.get("/api/orders/:id", authenticate, async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const order = await Order.findOne({ _id: id, userId: req.user!.id });

      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      res.json({ order });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  // Create order
  app.post("/api/orders", authenticate, async (req: AuthRequest, res) => {
    try {
      const {
        items,
        shippingAddress,
        paymentMethod,
        paymentId,
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        subtotal,
        shipping,
        tax,
        discount,
        total,
      } = req.body;

      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      const order = await Order.create({
        userId: req.user!.id,
        orderNumber,
        items,
        shippingAddress,
        paymentMethod,
        paymentId: paymentId || razorpayPaymentId,
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        subtotal,
        shipping,
        tax,
        discount,
        total,
        status: paymentMethod === 'razorpay' ? 'confirmed' : 'pending',
        paymentStatus: paymentMethod === 'razorpay' ? 'paid' : 'pending',
      });

      // Clear cart after order
      await Cart.findOneAndUpdate(
        { userId: req.user!.id },
        { items: [] }
      );

      res.status(201).json({ order });
    } catch (error) {
      console.error('Order creation error:', error);
      res.status(500).json({ error: "Server error" });
    }
  });

  // ==================== WISHLIST ROUTES ====================

  // Get wishlist
  app.get("/api/wishlist", authenticate, async (req: AuthRequest, res) => {
    try {
      let wishlist = await Wishlist.findOne({ userId: req.user!.id }).populate("productIds");

      if (!wishlist) {
        wishlist = await Wishlist.create({ userId: req.user!.id, productIds: [] });
      }

      res.json({ wishlist });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  // Add to wishlist
  app.post("/api/wishlist", authenticate, async (req: AuthRequest, res) => {
    try {
      const { productId } = req.body;

      let wishlist = await Wishlist.findOne({ userId: req.user!.id });

      if (!wishlist) {
        wishlist = await Wishlist.create({ userId: req.user!.id, productIds: [productId] });
      } else if (!wishlist.productIds.includes(productId)) {
        wishlist.productIds.push(productId);
        await wishlist.save();
      }

      await wishlist.populate("productIds");

      res.json({ wishlist });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  // Remove from wishlist
  app.delete("/api/wishlist/:productId", authenticate, async (req: AuthRequest, res) => {
    try {
      const { productId } = req.params;

      const wishlist = await Wishlist.findOne({ userId: req.user!.id });

      if (!wishlist) {
        return res.status(404).json({ error: "Wishlist not found" });
      }

      wishlist.productIds = wishlist.productIds.filter(
        (id) => id.toString() !== productId
      );
      await wishlist.save();
      await wishlist.populate("productIds");

      res.json({ wishlist });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  // ==================== REVIEW ROUTES ====================

  // Get product reviews
  app.get("/api/reviews/:productId", async (req, res) => {
    try {
      const { productId } = req.params;
      const reviews = await Review.find({ productId })
        .populate("userId", "firstName lastName")
        .sort({ createdAt: -1 });

      res.json({ reviews });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  // Create review
  app.post("/api/reviews", authenticate, async (req: AuthRequest, res) => {
    try {
      const { productId, orderId, rating, title, comment, images } = req.body;

      // Check if user already reviewed this product
      const existingReview = await Review.findOne({
        productId,
        userId: req.user!.id,
      });

      if (existingReview) {
        return res.status(400).json({ error: "You have already reviewed this product" });
      }

      // Check if user has purchased this product (optional but recommended)
      let isVerified = false;
      if (orderId) {
        const order = await Order.findOne({
          _id: orderId,
          userId: req.user!.id,
          status: 'delivered'
        });
        
        if (order) {
          const hasProduct = order.items.some((item: any) => 
            item.productId.toString() === productId
          );
          isVerified = hasProduct;
        }
      }

      const review = await Review.create({
        productId,
        orderId,
        userId: req.user!.id,
        rating,
        title,
        comment,
        images: images || [],
        isVerified,
      });

      // Update product rating and review count
      const reviews = await Review.find({ productId });
      const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

      await Product.findByIdAndUpdate(productId, {
        rating: avgRating,
        reviewCount: reviews.length,
      });

      await review.populate("userId", "firstName lastName");

      res.status(201).json({ review });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  // Mark review as helpful
  app.post("/api/reviews/:reviewId/helpful", authenticate, async (req: AuthRequest, res) => {
    try {
      const { reviewId } = req.params;
      
      const review = await Review.findByIdAndUpdate(
        reviewId,
        { $inc: { helpfulCount: 1 } },
        { new: true }
      ).populate("userId", "firstName lastName");

      res.json({ review });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  // Get user's delivered orders for review
  app.get("/api/orders/reviewable", authenticate, async (req: AuthRequest, res) => {
    try {
      const orders = await Order.find({
        userId: req.user!.id,
        status: 'delivered'
      })
      .populate('items.productId')
      .sort({ deliveredAt: -1 })
      .limit(20);

      // Filter out products already reviewed
      const reviewableOrders = await Promise.all(
        orders.map(async (order) => {
          const reviewableItems = await Promise.all(
            order.items.map(async (item: any) => {
              const existingReview = await Review.findOne({
                productId: item.productId._id,
                userId: req.user!.id
              });
              
              return {
                ...item.toObject(),
                hasReview: !!existingReview,
                orderId: order._id
              };
            })
          );
          
          return {
            ...order.toObject(),
            items: reviewableItems
          };
        })
      );

      res.json({ orders: reviewableOrders });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  // ==================== COUPON ROUTES ====================

  // Validate coupon
  app.post("/api/coupons/validate", authenticate, async (req: AuthRequest, res) => {
    try {
      const { code, subtotal } = req.body;

      const coupon = await Coupon.findOne({
        code: code.toUpperCase(),
        isActive: true,
      });

      if (!coupon) {
        return res.status(404).json({ error: "Invalid coupon code" });
      }

      const now = new Date();
      if (now < coupon.validFrom || now > coupon.validUntil) {
        return res.status(400).json({ error: "Coupon has expired" });
      }

      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        return res.status(400).json({ error: "Coupon usage limit reached" });
      }

      if (coupon.minPurchase && subtotal < coupon.minPurchase) {
        return res.status(400).json({
          error: `Minimum purchase of $${coupon.minPurchase} required`,
        });
      }

      let discount = 0;
      if (coupon.discountType === "percentage") {
        discount = (subtotal * coupon.discountValue) / 100;
        if (coupon.maxDiscount) {
          discount = Math.min(discount, coupon.maxDiscount);
        }
      } else {
        discount = coupon.discountValue;
      }

      res.json({
        coupon: {
          code: coupon.code,
          description: coupon.description,
          discount,
        },
      });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  // ==================== ADMIN ROUTES ====================
  // Admin Routes
  // Admin middleware to check if user is admin
  const adminAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }
    next();
  };

  // Admin Stats
  app.get("/api/admin/stats", authenticate, adminAuth, async (req: AuthRequest, res: Response) => {
    try {
      const totalOrders = await Order.countDocuments();
      const totalProducts = await Product.countDocuments();
      const totalUsers = await User.countDocuments();
      
      // Calculate total revenue
      const revenueResult = await Order.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: "$total" } } }
      ]);
      const totalRevenue = revenueResult[0]?.total || 0;

      // Mock growth percentages (in real app, calculate from historical data)
      const stats = {
        totalRevenue,
        totalOrders,
        activeUsers: totalUsers,
        totalProducts,
        revenueGrowth: 12.5,
        ordersGrowth: 8.2,
        usersGrowth: 15.3
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch admin stats" });
    }
  });

  // Sales Analytics
  app.get("/api/admin/sales-analytics", authenticate, adminAuth, async (req: AuthRequest, res: Response) => {
    try {
      const { timeRange = '7days' } = req.query;
      
      // Calculate date range
      const now = new Date();
      let startDate = new Date();
      
      switch (timeRange) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case '7days':
          startDate.setDate(now.getDate() - 7);
          break;
        case '30days':
          startDate.setDate(now.getDate() - 30);
          break;
        case '90days':
          startDate.setDate(now.getDate() - 90);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      // Total revenue and orders
      const orders = await Order.find({
        createdAt: { $gte: startDate },
        status: { $ne: 'cancelled' }
      });

      const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
      const totalOrders = orders.length;
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // Total customers
      const totalCustomers = await User.countDocuments({ role: 'user' });
      const totalProducts = await Product.countDocuments({ isActive: true });

      // Growth calculations (compare with previous period)
      const previousStartDate = new Date(startDate);
      previousStartDate.setTime(previousStartDate.getTime() - (now.getTime() - startDate.getTime()));
      
      const previousOrders = await Order.find({
        createdAt: { $gte: previousStartDate, $lt: startDate },
        status: { $ne: 'cancelled' }
      });

      const previousRevenue = previousOrders.reduce((sum, order) => sum + order.total, 0);
      const revenueGrowth = previousRevenue > 0 
        ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 
        : 0;
      const ordersGrowth = previousOrders.length > 0
        ? ((totalOrders - previousOrders.length) / previousOrders.length) * 100
        : 0;

      // Top selling products
      const productSales = await Order.aggregate([
        { $match: { createdAt: { $gte: startDate }, status: { $ne: 'cancelled' } } },
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.productId',
            sales: { $sum: '$items.quantity' },
            revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
          }
        },
        { $sort: { revenue: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: '_id',
            as: 'product'
          }
        },
        { $unwind: '$product' }
      ]);

      const topSellingProducts = productSales.map(item => ({
        name: item.product.name,
        sales: item.sales,
        revenue: item.revenue
      }));

      // Recent orders
      const recentOrders = await Order.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .select('orderNumber total status createdAt');

      res.json({
        totalRevenue,
        totalOrders,
        averageOrderValue,
        totalCustomers,
        totalProducts,
        revenueGrowth: Math.round(revenueGrowth * 10) / 10,
        ordersGrowth: Math.round(ordersGrowth * 10) / 10,
        topSellingProducts,
        recentOrders
      });
    } catch (error) {
      console.error('Sales analytics error:', error);
      res.status(500).json({ message: "Failed to fetch sales analytics" });
    }
  });

  // Admin Orders
  app.get("/api/admin/orders", authenticate, adminAuth, async (req: AuthRequest, res: Response) => {
    try {
      const orders = await Order.find()
        .populate('userId', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .limit(100);

      res.json({ orders });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // Update Order Status
  app.patch("/api/admin/orders/:id", authenticate, adminAuth, async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const order = await Order.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      ).populate('userId', 'firstName lastName email');

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.json({ order });
    } catch (error) {
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  // Admin Products
  app.get("/api/admin/products", authenticate, adminAuth, async (req: AuthRequest, res: Response) => {
    try {
      const products = await Product.find().populate('categoryId', 'name').sort({ createdAt: -1 });
      res.json({ products });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // Create Product
  app.post("/api/admin/products", authenticate, adminAuth, async (req: AuthRequest, res: Response) => {
    try {
      console.log("=== Creating product ===");
      console.log("Request body:", JSON.stringify(req.body, null, 2));
      
      // Validate required fields
      const { name, description, price, categoryId, images, variants } = req.body;
      
      if (!name || !description || !price || !categoryId || !images || !variants) {
        const missing = [];
        if (!name) missing.push('name');
        if (!description) missing.push('description');
        if (!price) missing.push('price');
        if (!categoryId) missing.push('categoryId');
        if (!images) missing.push('images');
        if (!variants) missing.push('variants');
        
        console.error("Missing required fields:", missing);
        return res.status(400).json({ 
          message: `Missing required fields: ${missing.join(', ')}` 
        });
      }

      // Generate slug if not provided
      const slug = req.body.slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
      
      // Ensure arrays are properly formatted
      const productData = {
        ...req.body,
        slug,
        images: Array.isArray(images) ? images.filter(img => img && img.trim()) : [images].filter(Boolean),
        variants: Array.isArray(variants) ? variants : [variants],
        tags: Array.isArray(req.body.tags) ? req.body.tags.filter((tag: string) => tag && tag.trim()) : [],
        price: Number(price),
        originalPrice: req.body.originalPrice && Number(req.body.originalPrice) > 0 ? Number(req.body.originalPrice) : undefined,
        discount: req.body.discount && Number(req.body.discount) > 0 ? Number(req.body.discount) : undefined,
      };

      console.log("Processed product data:", JSON.stringify(productData, null, 2));
      
      const product = await Product.create(productData);
      console.log("Product created successfully:", product._id);
      res.status(201).json({ product });
    } catch (error: any) {
      console.error("=== Product creation error ===");
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error code:", error.code);
      console.error("Full error:", error);
      
      if (error.code === 11000) {
        return res.status(400).json({ message: "Product with this slug already exists" });
      }
      
      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map((err: any) => err.message);
        console.error("Validation errors:", validationErrors);
        return res.status(400).json({ 
          message: "Validation error", 
          errors: validationErrors 
        });
      }
      
      res.status(500).json({ 
        message: "Failed to create product", 
        error: error.message 
      });
    }
  });

  // Update Product
  app.patch("/api/admin/products/:id", authenticate, adminAuth, async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json({ product });
    } catch (error) {
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  // Delete Product
  app.delete("/api/admin/products/:id", authenticate, adminAuth, async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const product = await Product.findByIdAndDelete(id);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Admin Users
  app.get("/api/admin/users", authenticate, adminAuth, async (req: AuthRequest, res: Response) => {
    try {
      const users = await User.find().select('-password').sort({ createdAt: -1 });
      res.json({ users });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Update User Role
  app.patch("/api/admin/users/:id", authenticate, adminAuth, async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { role } = req.body;

      const user = await User.findByIdAndUpdate(
        id,
        { role },
        { new: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ user });
    } catch (error) {
      res.status(500).json({ message: "Failed to update user role" });
    }
  });

  // Top Products Analytics
  app.get("/api/admin/analytics/top-products", authenticate, adminAuth, async (req: AuthRequest, res: Response) => {
    try {
      // Mock data for now - in real app, calculate from order items
      const products = [
        { name: "Cotton T-Shirt", sales: 342, revenue: 567554 },
        { name: "Denim Jeans", sales: 289, revenue: 1198461 },
        { name: "Summer Dress", sales: 256, revenue: 849728 },
        { name: "Running Shoes", sales: 234, revenue: 1358378 },
        { name: "Winter Jacket", sales: 198, revenue: 1477566 },
      ];

      res.json({ products });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch top products" });
    }
  });

  // Admin Categories
  app.get("/api/admin/categories", authenticate, adminAuth, async (req: AuthRequest, res: Response) => {
    try {
      const categories = await Category.find().sort({ createdAt: -1 });
      res.json({ categories });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Create Category
  app.post("/api/admin/categories", authenticate, adminAuth, async (req: AuthRequest, res: Response) => {
    try {
      const { name, description, slug, image, isActive } = req.body;
      const category = await Category.create({
        name,
        description,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
        image,
        isActive: isActive !== undefined ? isActive : true
      });
      res.status(201).json({ category });
    } catch (error) {
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  // Update Category
  app.patch("/api/admin/categories/:id", authenticate, adminAuth, async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const category = await Category.findByIdAndUpdate(id, req.body, { new: true });
      
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      res.json({ category });
    } catch (error) {
      res.status(500).json({ message: "Failed to update category" });
    }
  });

  // Delete Category
  app.delete("/api/admin/categories/:id", authenticate, adminAuth, async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      
      // Check if category has products
      const productCount = await Product.countDocuments({ categoryId: id });
      if (productCount > 0) {
        return res.status(400).json({ message: "Cannot delete category with existing products" });
      }

      const category = await Category.findByIdAndDelete(id);
      
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      res.json({ message: "Category deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete category" });
    }
  });

  // Admin Coupons
  app.get("/api/admin/coupons", authenticate, adminAuth, async (req: AuthRequest, res: Response) => {
    try {
      const coupons = await Coupon.find().sort({ createdAt: -1 });
      res.json({ coupons });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch coupons" });
    }
  });

  // Create Coupon
  app.post("/api/admin/coupons", authenticate, adminAuth, async (req: AuthRequest, res: Response) => {
    try {
      console.log("=== Creating coupon ===");
      console.log("Request body:", JSON.stringify(req.body, null, 2));

      const {
        code,
        description,
        discountType,
        discountValue,
        minPurchase,
        maxDiscount,
        usageLimit,
        validFrom,
        validUntil,
        isActive
      } = req.body;

      // Validate required fields
      if (!code || !description || !discountType || !discountValue || !validFrom || !validUntil) {
        const missing = [];
        if (!code) missing.push('code');
        if (!description) missing.push('description');
        if (!discountType) missing.push('discountType');
        if (!discountValue) missing.push('discountValue');
        if (!validFrom) missing.push('validFrom');
        if (!validUntil) missing.push('validUntil');
        
        console.error("Missing required fields:", missing);
        return res.status(400).json({ 
          message: `Missing required fields: ${missing.join(', ')}` 
        });
      }

      const coupon = await Coupon.create({
        code: code.toUpperCase(),
        description,
        discountType,
        discountValue: Number(discountValue),
        minPurchase: minPurchase ? Number(minPurchase) : undefined,
        maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
        usageLimit: usageLimit ? Number(usageLimit) : undefined,
        validFrom: new Date(validFrom),
        validUntil: new Date(validUntil),
        isActive: isActive !== undefined ? isActive : true
      });

      console.log("Coupon created successfully:", coupon._id);
      res.status(201).json({ coupon });
    } catch (error: any) {
      console.error("=== Coupon creation error ===");
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Full error:", error);

      if (error.code === 11000) {
        return res.status(400).json({ message: "Coupon code already exists" });
      }
      
      if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map((err: any) => err.message);
        console.error("Validation errors:", validationErrors);
        return res.status(400).json({ 
          message: "Validation error", 
          errors: validationErrors 
        });
      }

      console.error("Stack trace:", error.stack);
      res.status(500).json({ 
        message: "Failed to create coupon",
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  });

  // Update Coupon
  app.patch("/api/admin/coupons/:id", authenticate, adminAuth, async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const coupon = await Coupon.findByIdAndUpdate(id, req.body, { new: true });
      
      if (!coupon) {
        return res.status(404).json({ message: "Coupon not found" });
      }

      res.json({ coupon });
    } catch (error) {
      res.status(500).json({ message: "Failed to update coupon" });
    }
  });

  // Delete Coupon
  app.delete("/api/admin/coupons/:id", authenticate, adminAuth, async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const coupon = await Coupon.findByIdAndDelete(id);
      
      if (!coupon) {
        return res.status(404).json({ message: "Coupon not found" });
      }

      res.json({ message: "Coupon deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete coupon" });
    }
  });

  // ==================== BANNER ROUTES ====================
  
  // Get Active Banners (Public)
  app.get("/api/banners", async (req: Request, res: Response) => {
    try {
      const { location } = req.query;
      const query: any = { isActive: true };
      
      if (location) {
        query.location = location;
      }
      
      const banners = await Banner.find(query).sort({ createdAt: -1 });
      res.json({ banners });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch banners" });
    }
  });

  // Admin Get All Banners
  app.get("/api/admin/banners", authenticate, adminAuth, async (req: AuthRequest, res: Response) => {
    try {
      const banners = await Banner.find().sort({ createdAt: -1 });
      res.json({ banners });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch banners" });
    }
  });

  // Create Banner
  app.post("/api/admin/banners", authenticate, adminAuth, async (req: AuthRequest, res: Response) => {
    try {
      const { text, type, location, isActive } = req.body;
      
      if (!text || !text.trim()) {
        return res.status(400).json({ message: "Banner text is required" });
      }
      
      const banner = await Banner.create({
        text: text.trim(),
        type: type || 'badge',
        location: location || 'hero',
        isActive: isActive !== undefined ? isActive : true,
      });
      
      res.status(201).json({ banner, message: "Banner created successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to create banner" });
    }
  });

  // Update Banner
  app.patch("/api/admin/banners/:id", authenticate, adminAuth, async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const banner = await Banner.findByIdAndUpdate(id, req.body, { new: true });
      
      if (!banner) {
        return res.status(404).json({ message: "Banner not found" });
      }

      res.json({ banner, message: "Banner updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update banner" });
    }
  });

  // Delete Banner
  app.delete("/api/admin/banners/:id", authenticate, adminAuth, async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const banner = await Banner.findByIdAndDelete(id);
      
      if (!banner) {
        return res.status(404).json({ message: "Banner not found" });
      }

      res.json({ message: "Banner deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete banner" });
    }
  });

  // ==================== SITE SETTINGS ROUTES ====================
  
  // Get Site Settings (Public)
  app.get("/api/settings", async (req: Request, res: Response) => {
    try {
      let settings = await SiteSettings.findOne();
      
      // Create default settings if none exist
      if (!settings) {
        settings = await SiteSettings.create({});
      }
      
      res.json({ settings });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  // Get Site Settings (Admin)
  app.get("/api/admin/settings", authenticate, adminAuth, async (req: AuthRequest, res: Response) => {
    try {
      let settings = await SiteSettings.findOne();
      
      // Create default settings if none exist
      if (!settings) {
        settings = await SiteSettings.create({});
      }
      
      res.json({ settings });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  // Update Site Settings
  app.patch("/api/admin/settings", authenticate, adminAuth, async (req: AuthRequest, res: Response) => {
    try {
      let settings = await SiteSettings.findOne();
      
      if (!settings) {
        settings = await SiteSettings.create(req.body);
      } else {
        settings = await SiteSettings.findOneAndUpdate({}, req.body, { new: true });
      }
      
      res.json({ settings, message: "Settings updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update settings" });
    }
  });

  // ==================== SALE MANAGEMENT ROUTES ====================
  
  // Get Products on Sale (Public)
  app.get("/api/products/on-sale", async (req: Request, res: Response) => {
    try {
      const products = await Product.find({ isOnSale: true, isActive: true })
        .populate('categoryId', 'name')
        .sort({ createdAt: -1 });
      
      res.json({ products });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sale products" });
    }
  });

  // Toggle Product Sale Status (Admin)
  app.patch("/api/admin/products/:id/sale", authenticate, adminAuth, async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { isOnSale } = req.body;
      
      const product = await Product.findByIdAndUpdate(
        id,
        { isOnSale: isOnSale },
        { new: true }
      );
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json({ 
        product, 
        message: `Product ${isOnSale ? 'added to' : 'removed from'} sale successfully` 
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to update product sale status" });
    }
  });

  // Bulk Update Sale Status (Admin)
  app.post("/api/admin/products/bulk-sale", authenticate, adminAuth, async (req: AuthRequest, res: Response) => {
    try {
      const { productIds, isOnSale } = req.body;
      
      if (!Array.isArray(productIds) || productIds.length === 0) {
        return res.status(400).json({ message: "Product IDs array is required" });
      }
      
      await Product.updateMany(
        { _id: { $in: productIds } },
        { $set: { isOnSale: isOnSale } }
      );
      
      res.json({ 
        message: `${productIds.length} products ${isOnSale ? 'added to' : 'removed from'} sale successfully` 
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to bulk update sale status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
