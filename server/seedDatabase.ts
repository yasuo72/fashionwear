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
  },
  {
    name: "Sneakers",
    slug: "sneakers",
    description: "Trendy sneakers and footwear",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
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
  },
  // Kids Products
  {
    name: "Kids Cartoon T-Shirt",
    slug: "kids-cartoon-tshirt",
    description: "Fun cartoon print t-shirt for kids",
    price: 799,
    originalPrice: 1499,
    discount: 47,
    images: ["https://images.unsplash.com/photo-1519238263530-99bdd11bf5a2?w=400&h=400&fit=crop"],
    variants: [
      { size: "3-4Y", color: "Blue", stock: 15 },
      { size: "5-6Y", color: "Blue", stock: 12 },
      { size: "7-8Y", color: "Blue", stock: 10 },
      { size: "3-4Y", color: "Red", stock: 8 },
      { size: "5-6Y", color: "Red", stock: 14 }
    ],
    brand: "KidsWear",
    tags: ["kids", "tshirt", "cartoon", "casual"],
    rating: 4.6,
    reviewCount: 89,
    isFeatured: true,
    isActive: true
  },
  {
    name: "Kids Denim Shorts",
    slug: "kids-denim-shorts",
    description: "Comfortable denim shorts for active kids",
    price: 999,
    originalPrice: 1799,
    discount: 44,
    images: ["https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400&h=400&fit=crop"],
    variants: [
      { size: "3-4Y", color: "Blue", stock: 10 },
      { size: "5-6Y", color: "Blue", stock: 15 },
      { size: "7-8Y", color: "Blue", stock: 12 },
      { size: "9-10Y", color: "Blue", stock: 8 }
    ],
    brand: "LittleDenim",
    tags: ["kids", "shorts", "denim", "summer"],
    rating: 4.4,
    reviewCount: 67,
    isFeatured: false,
    isActive: true
  },
  {
    name: "Kids Party Dress",
    slug: "kids-party-dress",
    description: "Beautiful party dress for special occasions",
    price: 1499,
    originalPrice: 2999,
    discount: 50,
    images: ["https://images.unsplash.com/photo-1518831959646-4b1a3d8769b8?w=400&h=400&fit=crop"],
    variants: [
      { size: "3-4Y", color: "Pink", stock: 8 },
      { size: "5-6Y", color: "Pink", stock: 12 },
      { size: "7-8Y", color: "Pink", stock: 10 },
      { size: "3-4Y", color: "Purple", stock: 6 },
      { size: "5-6Y", color: "Purple", stock: 9 }
    ],
    brand: "PrincessWear",
    tags: ["kids", "dress", "party", "occasion"],
    rating: 4.8,
    reviewCount: 124,
    isFeatured: true,
    isActive: true
  },
  {
    name: "Kids Hoodie",
    slug: "kids-hoodie",
    description: "Warm and cozy hoodie for kids",
    price: 1299,
    originalPrice: 2499,
    discount: 48,
    images: ["https://images.unsplash.com/photo-1519457431-44ccd64a1d29?w=400&h=400&fit=crop"],
    variants: [
      { size: "3-4Y", color: "Gray", stock: 12 },
      { size: "5-6Y", color: "Gray", stock: 15 },
      { size: "7-8Y", color: "Navy", stock: 10 },
      { size: "9-10Y", color: "Navy", stock: 8 }
    ],
    brand: "CozyKids",
    tags: ["kids", "hoodie", "winter", "warm"],
    rating: 4.7,
    reviewCount: 98,
    isFeatured: false,
    isActive: true
  },
  // Accessories Products
  {
    name: "Classic Watch",
    slug: "classic-watch",
    description: "Elegant classic watch for everyday wear",
    price: 2999,
    originalPrice: 5999,
    discount: 50,
    images: ["https://images.unsplash.com/photo-1524592094714-8627d29489c1?w=400&h=400&fit=crop"],
    variants: [
      { size: "One Size", color: "Silver", stock: 20 },
      { size: "One Size", color: "Gold", stock: 15 },
      { size: "One Size", color: "Black", stock: 12 }
    ],
    brand: "TimeMaster",
    tags: ["accessories", "watch", "classic", "elegant"],
    rating: 4.6,
    reviewCount: 156,
    isFeatured: true,
    isActive: true
  },
  {
    name: "Sunglasses",
    slug: "stylish-sunglasses",
    description: "Trendy sunglasses with UV protection",
    price: 1499,
    originalPrice: 2999,
    discount: 50,
    images: ["https://images.unsplash.com/photo-1572635196237-14b59a4e6b29?w=400&h=400&fit=crop"],
    variants: [
      { size: "One Size", color: "Black", stock: 25 },
      { size: "One Size", color: "Tortoise", stock: 18 },
      { size: "One Size", color: "Clear", stock: 12 }
    ],
    brand: "SunStyle",
    tags: ["accessories", "sunglasses", "summer", "UV protection"],
    rating: 4.5,
    reviewCount: 201,
    isFeatured: true,
    isActive: true
  },
  {
    name: "Leather Belt",
    slug: "leather-belt",
    description: "Premium leather belt for formal and casual wear",
    price: 899,
    originalPrice: 1799,
    discount: 50,
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop"],
    variants: [
      { size: "32", color: "Brown", stock: 15 },
      { size: "34", color: "Brown", stock: 12 },
      { size: "36", color: "Black", stock: 18 },
      { size: "38", color: "Black", stock: 10 }
    ],
    brand: "LeatherCraft",
    tags: ["accessories", "belt", "leather", "formal"],
    rating: 4.4,
    reviewCount: 87,
    isFeatured: false,
    isActive: true
  },
  {
    name: "Canvas Backpack",
    slug: "canvas-backpack",
    description: "Durable canvas backpack for daily use",
    price: 1799,
    originalPrice: 3599,
    discount: 50,
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a45?w=400&h=400&fit=crop"],
    variants: [
      { size: "One Size", color: "Olive", stock: 20 },
      { size: "One Size", color: "Navy", stock: 15 },
      { size: "One Size", color: "Black", stock: 18 }
    ],
    brand: "PackMate",
    tags: ["accessories", "backpack", "canvas", "travel"],
    rating: 4.7,
    reviewCount: 143,
    isFeatured: false,
    isActive: true
  },
  // Sneakers Products
  {
    name: "Nike Air Max",
    slug: "nike-air-max",
    description: "Iconic Nike Air Max sneakers with cushioned sole",
    price: 8999,
    originalPrice: 14999,
    discount: 40,
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop"],
    variants: [
      { size: "7", color: "Red", stock: 8 },
      { size: "8", color: "Red", stock: 12 },
      { size: "9", color: "Red", stock: 10 },
      { size: "10", color: "White", stock: 15 },
      { size: "11", color: "White", stock: 8 }
    ],
    brand: "Nike",
    tags: ["sneakers", "nike", "air max", "sports"],
    rating: 4.9,
    reviewCount: 456,
    isFeatured: true,
    isTrending: true,
    isActive: true
  },
  {
    name: "Adidas Ultraboost",
    slug: "adidas-ultraboost",
    description: "Premium running sneakers with boost technology",
    price: 12999,
    originalPrice: 17999,
    discount: 28,
    images: ["https://images.unsplash.com/photo-1608231387042-66d6d06e1c5f?w=400&h=400&fit=crop"],
    variants: [
      { size: "7", color: "Black", stock: 10 },
      { size: "8", color: "Black", stock: 15 },
      { size: "9", color: "White", stock: 12 },
      { size: "10", color: "White", stock: 18 },
      { size: "11", color: "Gray", stock: 8 }
    ],
    brand: "Adidas",
    tags: ["sneakers", "adidas", "ultraboost", "running"],
    rating: 4.8,
    reviewCount: 389,
    isFeatured: true,
    isTrending: true,
    isActive: true
  },
  {
    name: "Jordan Retro",
    slug: "jordan-retro",
    description: "Classic Jordan Retro basketball sneakers",
    price: 14999,
    originalPrice: 19999,
    discount: 25,
    images: ["https://images.unsplash.com/photo-1600185365926-3a2ce3cdbbdd?w=400&h=400&fit=crop"],
    variants: [
      { size: "8", color: "Black/Red", stock: 8 },
      { size: "9", color: "Black/Red", stock: 10 },
      { size: "10", color: "White/Red", stock: 12 },
      { size: "11", color: "White/Red", stock: 6 }
    ],
    brand: "Jordan",
    tags: ["sneakers", "jordan", "retro", "basketball"],
    rating: 4.9,
    reviewCount: 567,
    isFeatured: true,
    isBestSelling: true,
    isActive: true
  },
  {
    name: "Converse Chuck Taylor",
    slug: "converse-chuck-taylor",
    description: "Classic Converse Chuck Taylor All Star",
    price: 3999,
    originalPrice: 5999,
    discount: 33,
    images: ["https://images.unsplash.com/photo-1607522360279-263310a8a8e4?w=400&h=400&fit=crop"],
    variants: [
      { size: "6", color: "White", stock: 15 },
      { size: "7", color: "White", stock: 20 },
      { size: "8", color: "Black", stock: 18 },
      { size: "9", color: "Black", stock: 12 },
      { size: "10", color: "Navy", stock: 10 }
    ],
    brand: "Converse",
    tags: ["sneakers", "converse", "casual", "classic"],
    rating: 4.6,
    reviewCount: 234,
    isFeatured: false,
    isActive: true
  },
  {
    name: "Puma RS-X",
    slug: "puma-rsx",
    description: "Bold and chunky Puma RS-X sneakers",
    price: 7499,
    originalPrice: 11999,
    discount: 38,
    images: ["https://images.unsplash.com/photo-1606107557195-0e29faa4f6a3?w=400&h=400&fit=crop"],
    variants: [
      { size: "7", color: "Multi-color", stock: 10 },
      { size: "8", color: "Multi-color", stock: 12 },
      { size: "9", color: "White", stock: 15 },
      { size: "10", color: "Black", stock: 8 }
    ],
    brand: "Puma",
    tags: ["sneakers", "puma", "chunky", "trendy"],
    rating: 4.5,
    reviewCount: 178,
    isFeatured: false,
    isTrending: true,
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
    const kidsCategory = createdCategories.find(cat => cat.slug === "kids");
    const accessoriesCategory = createdCategories.find(cat => cat.slug === "accessories");
    const sneakersCategory = createdCategories.find(cat => cat.slug === "sneakers");

    // Assign categories to products (index matches position in products array)
    // 0-8: Original products
    products[0].categoryId = menCategory?._id; // Cotton T-Shirt -> Men
    products[1].categoryId = menCategory?._id; // Denim Jeans -> Men  
    products[2].categoryId = womenCategory?._id; // Summer Dress -> Women
    products[3].categoryId = sneakersCategory?._id; // Casual Sneakers -> Sneakers
    products[4].categoryId = womenCategory?._id; // Floral Blouse -> Women
    products[5].categoryId = menCategory?._id; // Winter Jacket -> Men
    products[6].categoryId = sneakersCategory?._id; // Running Shoes -> Sneakers
    products[7].categoryId = accessoriesCategory?._id; // Leather Handbag -> Accessories
    products[8].categoryId = womenCategory?._id; // Wool Sweater -> Women
    // 9-12: Kids Products
    products[9].categoryId = kidsCategory?._id; // Kids Cartoon T-Shirt -> Kids
    products[10].categoryId = kidsCategory?._id; // Kids Denim Shorts -> Kids
    products[11].categoryId = kidsCategory?._id; // Kids Party Dress -> Kids
    products[12].categoryId = kidsCategory?._id; // Kids Hoodie -> Kids
    // 13-16: Accessories Products
    products[13].categoryId = accessoriesCategory?._id; // Classic Watch -> Accessories
    products[14].categoryId = accessoriesCategory?._id; // Sunglasses -> Accessories
    products[15].categoryId = accessoriesCategory?._id; // Leather Belt -> Accessories
    products[16].categoryId = accessoriesCategory?._id; // Canvas Backpack -> Accessories
    // 17-21: Sneakers Products
    products[17].categoryId = sneakersCategory?._id; // Nike Air Max -> Sneakers
    products[18].categoryId = sneakersCategory?._id; // Adidas Ultraboost -> Sneakers
    products[19].categoryId = sneakersCategory?._id; // Jordan Retro -> Sneakers
    products[20].categoryId = sneakersCategory?._id; // Converse Chuck Taylor -> Sneakers
    products[21].categoryId = sneakersCategory?._id; // Puma RS-X -> Sneakers

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
