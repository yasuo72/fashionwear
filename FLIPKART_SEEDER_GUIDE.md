# 📦 Flipkart Products Seeder Guide

## 🎯 What This Does

Imports women's/girls' fashion products from the Flipkart dataset into your MongoDB database.

## 🚀 Quick Start

### **Step 1: Run the Seeder**

```bash
npm run seed-flipkart
```

This will:
- ✅ Connect to your MongoDB database
- ✅ Filter women's products from the dataset
- ✅ Create/find the "Women" category
- ✅ Import 50 products (by default)
- ✅ Generate variants (sizes & colors)
- ✅ Set random stock levels
- ✅ Calculate ratings and reviews

### **Step 2: Check Results**

You should see output like:
```
✅ Connected to MongoDB
📂 Reading dataset from: /path/to/flipkart_fashion_products_dataset.json
📦 Loaded 1974388 products from dataset
👗 Found 15234 women's products
✅ Created Women category
✅ Imported 10 products...
✅ Imported 20 products...
...
✅ Imported 50 products...

📊 Import Summary:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Successfully imported: 50 products
❌ Failed: 0 products
📦 Total women's products in dataset: 15234
🎯 Imported: 50/50
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## ⚙️ Customization

### **Import More Products**

Edit `server/seedFlipkartProducts.ts` line ~115:

```typescript
// Import 50 products (default)
const productsToImport = womenProducts.slice(0, 50);

// Import 200 products
const productsToImport = womenProducts.slice(0, 200);

// Import ALL women's products (~15,000+)
const productsToImport = womenProducts;
```

### **Filter by Category**

Add additional filters in the script:

```typescript
const womenProducts = flipkartProducts.filter((product: any) => 
  isWomenProduct(product.title, product.description, product.sub_category) &&
  product.sub_category === 'Topwear' // Only tops
);
```

### **Change Stock Levels**

Edit line ~140:

```typescript
stock: Math.floor(Math.random() * 50) + 10, // Random 10-60
// Change to:
stock: 100, // Fixed stock
```

## 📊 What Gets Imported

### **Product Fields Mapped:**

| Flipkart Field | Our Schema Field | Transformation |
|----------------|------------------|----------------|
| `title` | `name` | Direct |
| `description` | `description` | Direct |
| `selling_price` | `price` | Clean & parse |
| `actual_price` | `originalPrice` | Clean & parse |
| `discount` | `discount` | Extract % |
| `images` | `images` | Array (max 5) |
| `brand` | `brand` | Direct |
| `average_rating` | `rating` | Parse float |
| `product_details` | `variants` | Extract colors/sizes |

### **Generated Fields:**

- **slug** - Auto-generated from title
- **variants** - Created for S, M, L, XL, XXL sizes
- **stock** - Random 10-60 per variant
- **reviewCount** - Random 10-110
- **tags** - From sub_category, brand, etc.
- **isFeatured** - If rating >= 4.0
- **isActive** - If not out_of_stock

## 🎨 Product Categories Detected

The seeder automatically detects women's products by keywords:
- women, woman, girl, girls
- ladies, lady, female
- womens, women's
- feminine, her, she

## 🔧 Troubleshooting

### **Error: Dataset file not found**

Make sure `flipkart_fashion_products_dataset.json` is in the project root:
```
FashionFusion/
├── flipkart_fashion_products_dataset.json  ← Here
├── server/
├── client/
└── package.json
```

### **Error: Duplicate slug**

The script handles this automatically by appending timestamp.

### **Error: Category not found**

The script creates the "Women" category automatically.

### **Too many products imported**

Adjust the slice limit:
```typescript
const productsToImport = womenProducts.slice(0, 20); // Only 20
```

### **Want to clear existing products first?**

Uncomment line ~110 in the script:
```typescript
await Product.deleteMany({ categoryId: womenCategory._id });
```

## 📈 Performance

- **50 products**: ~10-15 seconds
- **200 products**: ~30-45 seconds
- **1000 products**: ~3-5 minutes
- **All products**: ~20-30 minutes

## 🎯 Recommended Workflow

1. **Test with 10 products first:**
   ```typescript
   const productsToImport = womenProducts.slice(0, 10);
   ```

2. **Check your website** - Verify products look good

3. **Import more gradually:**
   - 50 products
   - 100 products
   - 200 products
   - etc.

4. **Monitor database size** - MongoDB Atlas free tier has 512MB limit

## 💡 Tips

### **For Better Product Quality:**

1. **Filter by rating:**
   ```typescript
   const womenProducts = flipkartProducts.filter((product: any) => 
     isWomenProduct(...) && 
     parseFloat(product.average_rating) >= 4.0
   );
   ```

2. **Filter by price range:**
   ```typescript
   const womenProducts = flipkartProducts.filter((product: any) => {
     const price = cleanPrice(product.selling_price);
     return isWomenProduct(...) && price >= 500 && price <= 5000;
   });
   ```

3. **Filter by brand:**
   ```typescript
   const popularBrands = ['Nike', 'Adidas', 'Puma', 'Levi\'s'];
   const womenProducts = flipkartProducts.filter((product: any) => 
     isWomenProduct(...) && 
     popularBrands.includes(product.brand)
   );
   ```

## 🗄️ Database Impact

### **Storage per product:** ~2-3 KB
- 50 products = ~150 KB
- 200 products = ~600 KB
- 1000 products = ~3 MB
- 10000 products = ~30 MB

### **MongoDB Atlas Free Tier:** 512 MB
- Can store ~150,000 products (plenty!)

## ✅ After Import

1. **Check your website:**
   - Go to Women category
   - Browse products
   - Check product details

2. **Verify in database:**
   - MongoDB Atlas → Browse Collections
   - Check `products` collection
   - Verify data looks correct

3. **Test features:**
   - Add to cart
   - Search products
   - Filter by price/brand
   - Product details page

## 🎉 Success!

You now have real product data in your e-commerce store!

---

**Need Help?**
- Check logs for errors
- Verify MongoDB connection
- Ensure dataset file exists
- Contact: Rohit Singh (@yasuo72)
