import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { Footer } from "@/components/Footer";

const wishlistItems = [
  { id: "1", name: "Classic Cotton T-Shirt", price: 29.99, originalPrice: 49.99, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop", rating: 4.5, reviews: 128, discount: 40 },
  { id: "2", name: "Denim Jeans", price: 69.99, originalPrice: 99.99, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop", rating: 4.7, reviews: 95, discount: 30 },
  { id: "3", name: "Summer Dress", price: 59.99, image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop", rating: 4.8, reviews: 203 },
  { id: "4", name: "Leather Jacket", price: 149.99, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop", rating: 4.6, reviews: 76 },
  { id: "5", name: "Casual Sneakers", price: 79.99, image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=400&fit=crop", rating: 4.9, reviews: 342, badge: "Trending" },
];

export default function WishlistPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
              <p className="text-muted-foreground">{wishlistItems.length} items saved</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {wishlistItems.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
