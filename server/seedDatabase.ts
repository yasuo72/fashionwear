import { config } from "dotenv";
config();

import { connectDatabase } from "./config/database";
import Category from "./models/Category";
import Product from "./models/Product";
import User from "./models/User";
import bcrypt from "bcryptjs";

const categories = [
  {
    name: "Men",
    slug: "men",
    description: "Fashion for men",
    image: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=400&h=400&fit=crop",
    isActive: true
  },
  {
    name: "Women",
    slug: "women", 
    description: "Fashion for women",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=400&fit=crop",
    isActive: true
  },
  {
    name: "Kids",
    slug: "kids",
    description: "Fashion for kids",
    image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400&h=400&fit=crop",
    isActive: true
  },
  {
    name: "Accessories",
    slug: "accessories",
    description: "Fashion accessories",
    image: "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=400&h=400&fit=crop",
    isActive: true
  }
];

const products: any[] = [
  {
    name: "Cotton T-Shirt",
    slug: "cotton-t-shirt",
    description: "Comfortable cotton t-shirt perfect for everyday wear",
    price: 1659,
    originalPrice: 3319,
    discount: 50,
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop"],
    variants: [
      { size: "S", color: "White", stock: 10 },
      { size: "M", color: "White", stock: 15 },
      { size: "L", color: "White", stock: 8 },
      { size: "S", color: "Black", stock: 12 },
      { size: "M", color: "Black", stock: 20 },
      { size: "L", color: "Black", stock: 5 }
    ],
    brand: "FashionHub",
    tags: ["casual", "cotton", "comfortable"],
    rating: 4.5,
    reviewCount: 128,
    isFeatured: true,
    isActive: true
  },
  {
    name: "Denim Jeans",
    slug: "denim-jeans",
    description: "Classic denim jeans with modern fit",
    price: 4149,
    originalPrice: 8299,
    discount: 50,
    images: ["https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop"],
    variants: [
      { size: "28", color: "Blue", stock: 8 },
      { size: "30", color: "Blue", stock: 12 },
      { size: "32", color: "Blue", stock: 15 },
      { size: "34", color: "Blue", stock: 10 }
    ],
    brand: "DenimCo",
    tags: ["denim", "jeans", "casual"],
    rating: 4.7,
    reviewCount: 95,
    isFeatured: true,
    isActive: true
  },
  {
    name: "Summer Dress",
    slug: "summer-dress",
    description: "Light and breezy summer dress",
    price: 3319,
    originalPrice: 6639,
    discount: 50,
    images: ["https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop"],
    variants: [
      { size: "XS", color: "Floral", stock: 5 },
      { size: "S", color: "Floral", stock: 8 },
      { size: "M", color: "Floral", stock: 12 },
      { size: "L", color: "Floral", stock: 6 }
    ],
    brand: "SummerStyle",
    tags: ["dress", "summer", "floral"],
    rating: 4.8,
    reviewCount: 203,
    isFeatured: true,
    isActive: true
  },
  {
    name: "Casual Sneakers",
    slug: "casual-sneakers",
    description: "Comfortable sneakers for everyday wear",
    price: 6639,
    images: ["https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=400&fit=crop"],
    variants: [
      { size: "7", color: "White", stock: 10 },
      { size: "8", color: "White", stock: 15 },
      { size: "9", color: "White", stock: 12 },
      { size: "10", color: "White", stock: 8 },
      { size: "7", color: "Black", stock: 6 },
      { size: "8", color: "Black", stock: 10 },
      { size: "9", color: "Black", stock: 14 },
      { size: "10", color: "Black", stock: 7 }
    ],
    brand: "SneakerBrand",
    tags: ["sneakers", "casual", "comfortable"],
    rating: 4.9,
    reviewCount: 342,
    isFeatured: true,
    isActive: true
  },
  {
    name: "Floral Blouse",
    slug: "floral-blouse",
    description: "Elegant floral blouse for office or casual wear",
    price: 2904,
    originalPrice: 4149,
    discount: 30,
    images: ["https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&h=400&fit=crop"],
    variants: [
      { size: "XS", color: "Floral Print", stock: 4 },
      { size: "S", color: "Floral Print", stock: 8 },
      { size: "M", color: "Floral Print", stock: 10 },
      { size: "L", color: "Floral Print", stock: 6 }
    ],
    brand: "ElegantWear",
    tags: ["blouse", "floral", "elegant"],
    rating: 4.4,
    reviewCount: 89,
    isFeatured: false,
    isActive: true
  },
  {
    name: "Winter Jacket",
    slug: "winter-jacket",
    description: "Warm and stylish winter jacket",
    price: 7469,
    originalPrice: 12449,
    discount: 40,
    images: ["https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop"],
    variants: [
      { size: "S", color: "Black", stock: 5 },
      { size: "M", color: "Black", stock: 8 },
      { size: "L", color: "Black", stock: 6 },
      { size: "XL", color: "Black", stock: 4 }
    ],
    brand: "WinterWear",
    tags: ["jacket", "winter", "warm"],
    rating: 4.6,
    reviewCount: 156,
    isFeatured: true,
    isActive: true
  },
  {
    name: "Running Shoes",
    slug: "running-shoes",
    description: "High-performance running shoes",
    price: 5809,
    originalPrice: 9959,
    discount: 42,
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop"],
    variants: [
      { size: "7", color: "Blue", stock: 8 },
      { size: "8", color: "Blue", stock: 12 },
      { size: "9", color: "Blue", stock: 10 },
      { size: "10", color: "Blue", stock: 6 }
    ],
    brand: "SportMax",
    tags: ["shoes", "running", "sports"],
    rating: 4.8,
    reviewCount: 234,
    isFeatured: true,
    isActive: true
  },
  {
    name: "Leather Handbag",
    slug: "leather-handbag",
    description: "Premium leather handbag for everyday use",
    price: 6639,
    originalPrice: 10789,
    discount: 38,
    images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop"],
    variants: [
      { size: "One Size", color: "Brown", stock: 15 },
      { size: "One Size", color: "Black", stock: 12 }
    ],
    brand: "LuxeBags",
    tags: ["handbag", "leather", "accessories"],
    rating: 4.7,
    reviewCount: 189,
    isFeatured: false,
    isActive: true
  },
  {
    name: "Wool Sweater",
    slug: "wool-sweater",
    description: "Cozy wool sweater for cold days",
    price: 4979,
    originalPrice: 8299,
    discount: 40,
    images: ["https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop"],
    variants: [
      { size: "S", color: "Gray", stock: 8 },
      { size: "M", color: "Gray", stock: 12 },
      { size: "L", color: "Gray", stock: 10 },
      { size: "XL", color: "Gray", stock: 5 }
    ],
    brand: "CozyKnits",
    tags: ["sweater", "wool", "winter"],
    rating: 4.5,
    reviewCount: 167,
    isFeatured: false,
    isActive: true
  }
];

async function seedDatabase() {
  try {
    await connectDatabase();
    console.log("🌱 Starting database seeding...");

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});

    // Create categories
    console.log("📂 Creating categories...");
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ Created ${createdCategories.length} categories`);

    // Assign category IDs to products
    const menCategory = createdCategories.find(cat => cat.slug === "men");
    const womenCategory = createdCategories.find(cat => cat.slug === "women");
    const accessoriesCategory = createdCategories.find(cat => cat.slug === "accessories");

    // Assign categories to products
    products[0].categoryId = menCategory?._id; // Cotton T-Shirt -> Men
    products[1].categoryId = menCategory?._id; // Denim Jeans -> Men  
    products[2].categoryId = womenCategory?._id; // Summer Dress -> Women
    products[3].categoryId = accessoriesCategory?._id; // Casual Sneakers -> Accessories
    products[4].categoryId = womenCategory?._id; // Floral Blouse -> Women
    products[5].categoryId = menCategory?._id; // Winter Jacket -> Men
    products[6].categoryId = accessoriesCategory?._id; // Running Shoes -> Accessories
    products[7].categoryId = accessoriesCategory?._id; // Leather Handbag -> Accessories
    products[8].categoryId = womenCategory?._id; // Wool Sweater -> Women

    // Create products
    console.log("🛍️ Creating products...");
    const createdProducts = await Product.insertMany(products);
    console.log(`✅ Created ${createdProducts.length} products`);

    // Create admin user
    console.log("👤 Creating admin user...");
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await User.create({
      email: "admin@fashionfusion.com",
      password: hashedPassword,
      firstName: "Admin",
      lastName: "User",
      role: "admin"
    });

    // Create test user
    const testUserPassword = await bcrypt.hash("test123", 10);
    await User.create({
      email: "test@fashionfusion.com", 
      password: testUserPassword,
      firstName: "Test",
      lastName: "User",
      role: "user"
    });

    console.log("✅ Created admin and test users");
    console.log("🎉 Database seeding completed successfully!");
    console.log("\n📋 Login credentials:");
    console.log("Admin: admin@fashionfusion.com / admin123");
    console.log("Test User: test@fashionfusion.com / test123");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
