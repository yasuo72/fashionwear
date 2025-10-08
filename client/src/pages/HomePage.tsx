import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { CategoryCard } from "@/components/CategoryCard";
import { ProductCard } from "@/components/ProductCard";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const categories = [
  { id: "men", name: "Men", image: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=400&h=400&fit=crop", productCount: 245 },
  { id: "women", name: "Women", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=400&fit=crop", productCount: 312 },
  { id: "kids", name: "Kids", image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400&h=400&fit=crop", productCount: 156 },
  { id: "accessories", name: "Accessories", image: "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=400&h=400&fit=crop", productCount: 89 },
];

const flashSale = [
  { id: "1", name: "Cotton T-Shirt", price: 19.99, originalPrice: 39.99, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop", rating: 4.5, reviews: 128, discount: 50 },
  { id: "2", name: "Denim Jeans", price: 49.99, originalPrice: 99.99, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop", rating: 4.7, reviews: 95, discount: 50 },
  { id: "3", name: "Summer Dress", price: 39.99, originalPrice: 79.99, image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop", rating: 4.8, reviews: 203, discount: 50 },
  { id: "4", name: "Leather Jacket", price: 89.99, originalPrice: 179.99, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop", rating: 4.6, reviews: 76, discount: 50 },
];

const trending = [
  { id: "5", name: "Casual Sneakers", price: 79.99, image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=400&fit=crop", rating: 4.9, reviews: 342, badge: "Trending" },
  { id: "6", name: "Floral Blouse", price: 34.99, image: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&h=400&fit=crop", rating: 4.4, reviews: 89, badge: "New" },
  { id: "7", name: "Wool Coat", price: 129.99, image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&h=400&fit=crop", rating: 4.7, reviews: 156, badge: "Trending" },
  { id: "8", name: "Sports Watch", price: 199.99, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop", rating: 4.8, reviews: 234 },
  { id: "9", name: "Canvas Backpack", price: 59.99, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop", rating: 4.6, reviews: 123, badge: "New" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <HeroSection />

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-semibold">Shop by Category</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} {...category} />
            ))}
          </div>
        </section>

        <section className="bg-destructive/5 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold mb-2">Flash Sale</h2>
                <p className="text-muted-foreground">Limited time offers - Up to 50% off!</p>
              </div>
              <Badge className="bg-destructive text-white text-lg px-4 py-2">Ending Soon</Badge>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {flashSale.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-semibold">Trending Now</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {trending.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </section>

        <section className="bg-card py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-6 text-center">
                <div className="text-4xl mb-4">🚚</div>
                <h3 className="font-semibold mb-2">Free Shipping</h3>
                <p className="text-sm text-muted-foreground">On orders over $50</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl mb-4">🔄</div>
                <h3 className="font-semibold mb-2">Easy Returns</h3>
                <p className="text-sm text-muted-foreground">30-day return policy</p>
              </Card>
              <Card className="p-6 text-center">
                <div className="text-4xl mb-4">💳</div>
                <h3 className="font-semibold mb-2">Secure Payment</h3>
                <p className="text-sm text-muted-foreground">100% secure transactions</p>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
