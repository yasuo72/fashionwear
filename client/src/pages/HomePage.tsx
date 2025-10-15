import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { CategoryCard } from "@/components/CategoryCard";
import { ProductCard } from "@/components/ProductCard";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCategories } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";
import { Sparkles, TrendingUp, Shield, Truck, Star } from "lucide-react";

export default function HomePage() {
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const { data: productsData, isLoading: productsLoading } = useProducts({ limit: 8 });
  const { data: featuredData, isLoading: featuredLoading } = useProducts({ limit: 4 });

  const categories = categoriesData?.categories || [];
  const products = productsData?.products || [];
  const featured = featuredData?.products || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <HeroSection />

        {/* Categories Section - Enhanced */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full px-4 py-2 mb-4">
              <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-purple-600 dark:text-purple-400">Explore Collections</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Shop by Category
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover your style across our curated collections
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categoriesLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-48 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 animate-pulse rounded-2xl" />
              ))
            ) : (
              categories.map((category, index) => (
                <div 
                  key={category._id}
                  className="group hover:scale-105 transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CategoryCard 
                    id={category.slug}
                    name={category.name}
                    image={category.image}
                    productCount={category.productCount || 0}
                  />
                </div>
              ))
            )}
          </div>
        </section>

        {/* Featured Products - Futuristic Design */}
        <section className="relative py-20 overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 dark:from-purple-950/30 dark:via-pink-950/30 dark:to-yellow-950/30" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-300 dark:bg-pink-600 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between mb-12">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                    <Star className="w-5 h-5 text-white fill-white" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Featured Products
                  </h2>
                </div>
                <p className="text-muted-foreground text-lg">Handpicked treasures just for you</p>
              </div>
              <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg px-6 py-2 shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60 hover:scale-105 transition-all">
                <Sparkles className="w-4 h-4 mr-2" />
                New
              </Badge>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-80 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 animate-pulse rounded-2xl" />
                ))
              ) : (
                featured.map((product, index) => (
                  <div
                    key={product._id}
                    className="group hover:scale-105 hover:rotate-1 transition-all duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <ProductCard 
                      id={product.slug}
                      productId={product._id}
                      name={product.name}
                      price={product.price}
                      originalPrice={product.originalPrice}
                      image={product.images[0]}
                      rating={product.rating}
                      reviews={product.reviewCount}
                      discount={product.discount}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* All Products - Grid with Hover Effects */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-full px-4 py-2 mb-4">
              <TrendingUp className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <span className="text-sm font-medium text-orange-600 dark:text-orange-400">Trending Now</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Latest Arrivals</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Fresh styles added daily - don't miss out!
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {productsLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-80 bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 animate-pulse rounded-2xl" />
              ))
            ) : (
              products.map((product, index) => (
                <div
                  key={product._id}
                  className="group hover:scale-105 transition-all duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ProductCard 
                    id={product.slug}
                    productId={product._id}
                    name={product.name}
                    price={product.price}
                    originalPrice={product.originalPrice}
                    image={product.images[0]}
                    rating={product.rating}
                    reviews={product.reviewCount}
                    discount={product.discount}
                  />
                </div>
              ))
            )}
          </div>
        </section>

        {/* Features Section - Modern Cards */}
        <section className="relative py-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-950 dark:to-gray-900" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="group p-8 text-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 border-0 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <Truck className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Free Shipping</h3>
                <p className="text-sm text-muted-foreground">On all orders over ₹499</p>
              </Card>
              <Card className="group p-8 text-center bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50 border-0 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Easy Returns</h3>
                <p className="text-sm text-muted-foreground">7-day hassle-free returns</p>
              </Card>
              <Card className="group p-8 text-center bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/50 dark:to-orange-950/50 border-0 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-yellow-600 to-orange-600 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2 bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">Secure Payment</h3>
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
