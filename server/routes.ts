import type { Express } from "express";
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

export async function registerRoutes(app: Express): Promise<Server> {
  
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
    async (req, res) => {
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
          id: user._id.toString(),
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
    async (req, res) => {
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
          id: user._id.toString(),
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

  // Get current user
  app.get("/api/auth/me", authenticate, async (req: AuthRequest, res) => {
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
  app.patch("/api/user/profile", authenticate, async (req: AuthRequest, res) => {
    try {
      const { firstName, lastName, phone } = req.body;
      const user = await User.findByIdAndUpdate(
        req.user!.id,
        { firstName, lastName, phone },
        { new: true, runValidators: true }
      ).select("-password");

      res.json({ user });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  // Change password
  app.post("/api/user/change-password", authenticate, async (req: AuthRequest, res) => {
    try {
      const { currentPassword, newPassword } = req.body;

      const user = await User.findById(req.user!.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }

      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();

      res.json({ message: "Password changed successfully" });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  // ==================== ADDRESS ROUTES ====================

  // Get user addresses
  app.get("/api/addresses", authenticate, async (req: AuthRequest, res) => {
    try {
      const addresses = await Address.find({ userId: req.user!.id });
      res.json({ addresses });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  // Create address
  app.post("/api/addresses", authenticate, async (req: AuthRequest, res) => {
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
  app.patch("/api/addresses/:id", authenticate, async (req: AuthRequest, res) => {
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
  app.delete("/api/addresses/:id", authenticate, async (req: AuthRequest, res) => {
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
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await Category.find({ isActive: true });
      res.json({ categories });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  // Get category by slug
  app.get("/api/categories/:slug", async (req, res) => {
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

  // ==================== PRODUCT ROUTES ====================

  // Get all products with filters
  app.get("/api/products", async (req, res) => {
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
        query.$text = { $search: search as string };
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
  app.get("/api/products/:slug", async (req, res) => {
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
  app.get("/api/cart", authenticate, async (req: AuthRequest, res) => {
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
  app.post("/api/cart", authenticate, async (req: AuthRequest, res) => {
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
  app.patch("/api/cart/:itemId", authenticate, async (req: AuthRequest, res) => {
    try {
      const { itemId } = req.params;
      const { quantity } = req.body;

      const cart = await Cart.findOne({ userId: req.user!.id });

      if (!cart) {
        return res.status(404).json({ error: "Cart not found" });
      }

      const item = cart.items.id(itemId);
      if (!item) {
        return res.status(404).json({ error: "Cart item not found" });
      }

      if (quantity <= 0) {
        cart.items.pull(itemId);
      } else {
        item.quantity = quantity;
      }

      await cart.save();
      await cart.populate("items.productId");

      res.json({ cart });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  // Remove from cart
  app.delete("/api/cart/:itemId", authenticate, async (req: AuthRequest, res) => {
    try {
      const { itemId } = req.params;

      const cart = await Cart.findOne({ userId: req.user!.id });

      if (!cart) {
        return res.status(404).json({ error: "Cart not found" });
      }

      cart.items.pull(itemId);
      await cart.save();
      await cart.populate("items.productId");

      res.json({ cart });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  // Clear cart
  app.delete("/api/cart", authenticate, async (req: AuthRequest, res) => {
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
        subtotal,
        shipping,
        tax,
        discount,
        total,
        status: "pending",
      });

      await Cart.findOneAndUpdate(
        { userId: req.user!.id },
        { items: [] }
      );

      res.status(201).json({ order });
    } catch (error) {
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
      const { productId, rating, title, comment } = req.body;

      const existingReview = await Review.findOne({
        productId,
        userId: req.user!.id,
      });

      if (existingReview) {
        return res.status(400).json({ error: "You have already reviewed this product" });
      }

      const review = await Review.create({
        productId,
        userId: req.user!.id,
        rating,
        title,
        comment,
      });

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

  // Get admin dashboard stats
  app.get("/api/admin/stats", authenticate, isAdmin, async (req: AuthRequest, res) => {
    try {
      const [
        totalOrders,
        totalRevenue,
        totalProducts,
        totalUsers,
        recentOrders,
      ] = await Promise.all([
        Order.countDocuments(),
        Order.aggregate([
          { $group: { _id: null, total: { $sum: "$total" } } },
        ]),
        Product.countDocuments({ isActive: true }),
        User.countDocuments(),
        Order.find()
          .sort({ createdAt: -1 })
          .limit(10)
          .populate("userId", "firstName lastName email"),
      ]);

      res.json({
        stats: {
          totalOrders,
          totalRevenue: totalRevenue[0]?.total || 0,
          totalProducts,
          totalUsers,
        },
        recentOrders,
      });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  // Get all orders (admin)
  app.get("/api/admin/orders", authenticate, isAdmin, async (req: AuthRequest, res) => {
    try {
      const orders = await Order.find()
        .sort({ createdAt: -1 })
        .populate("userId", "firstName lastName email");

      res.json({ orders });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  // Update order status (admin)
  app.patch("/api/admin/orders/:id", authenticate, isAdmin, async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const { status, trackingNumber } = req.body;

      const order = await Order.findByIdAndUpdate(
        id,
        { status, trackingNumber },
        { new: true }
      );

      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      res.json({ order });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  // Create category (admin)
  app.post("/api/admin/categories", authenticate, isAdmin, async (req: AuthRequest, res) => {
    try {
      const { name, slug, description, image, parentId } = req.body;

      const category = await Category.create({
        name,
        slug,
        description,
        image,
        parentId,
      });

      res.status(201).json({ category });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  // Create product (admin)
  app.post("/api/admin/products", authenticate, isAdmin, async (req: AuthRequest, res) => {
    try {
      const {
        name,
        slug,
        description,
        price,
        originalPrice,
        discount,
        categoryId,
        images,
        variants,
        brand,
        tags,
        isFeatured,
      } = req.body;

      const product = await Product.create({
        name,
        slug,
        description,
        price,
        originalPrice,
        discount,
        categoryId,
        images,
        variants,
        brand,
        tags,
        isFeatured,
      });

      res.status(201).json({ product });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  // Update product (admin)
  app.patch("/api/admin/products/:id", authenticate, isAdmin, async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const product = await Product.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.json({ product });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  // Delete product (admin)
  app.delete("/api/admin/products/:id", authenticate, isAdmin, async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      
      const product = await Product.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
      );

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  // Create coupon (admin)
  app.post("/api/admin/coupons", authenticate, isAdmin, async (req: AuthRequest, res) => {
    try {
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
      } = req.body;

      const coupon = await Coupon.create({
        code: code.toUpperCase(),
        description,
        discountType,
        discountValue,
        minPurchase,
        maxDiscount,
        usageLimit,
        validFrom,
        validUntil,
      });

      res.status(201).json({ coupon });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
