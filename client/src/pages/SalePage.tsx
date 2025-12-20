import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProducts } from "@/hooks/useProducts";
import { 
  Flame, 
  Clock, 
  TrendingDown, 
  Zap,
  Timer,
  ShoppingBag,
  Percent
} from "lucide-react";

export default function SalePage() {
  const [sortBy, setSortBy] = useState("discount");
  const [page, setPage] = useState(1);
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30
  });

  // Fetch products with discounts
  const { data: saleProductsData, isLoading } = useProducts({ 
    sort: sortBy === "discount" ? "discount" : sortBy === "price-low" ? "price" : "createdAt",
    order: sortBy === "price-high" ? "desc" : "asc",
    limit: 20 * page
  });

  const saleProducts = saleProductsData?.products?.filter(product => 
    product.discount && product.discount > 0
  ) || [];
  
  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };
  
  const hasMore = saleProducts.length >= (20 * page);

  // Flash sale products (highest discounts)
  const flashSaleProducts = saleProducts
    .filter(product => product.discount && product.discount >= 40)
    .slice(0, 6);

  // Regular sale products
  const regularSaleProducts = saleProducts
    .filter(product => product.discount && product.discount < 40)
    .slice(0, 12);

  // Simulate countdown timer
  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (time: number) => time.toString().padStart(2, '0');

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-primary text-black py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Flame className="h-6 w-6 md:h-8 md:w-8" />
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold">MEGA SALE</h1>
              <Flame className="h-6 w-6 md:h-8 md:w-8" />
            </div>
            <p className="text-base md:text-xl lg:text-2xl mb-4 md:mb-6 px-4">Up to 70% OFF on Fashion Essentials</p>
            <div className="flex items-center justify-center gap-4">
              <Badge className="bg-white text-red-500 text-sm md:text-base px-3 py-1.5 md:px-4 md:py-2">
                <Zap className="h-4 w-4 mr-2" />
                Limited Time Only
              </Badge>
            </div>
          </div>
        </div>

        {/* Flash Sale Section */}
        {flashSaleProducts.length > 0 && (
          <section className="bg-muted py-8 md:py-12">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
              <Card className="mb-6 md:mb-8 border border-border bg-card text-foreground overflow-hidden">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="p-1.5 md:p-2 bg-white/20 rounded-full">
                        <Flame className="h-5 w-5 md:h-6 md:w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg md:text-xl lg:text-2xl">⚡ Flash Sale</CardTitle>
                        <p className="text-sm md:text-base text-white/90">Grab these deals before they're gone!</p>
                      </div>
                    </div>
                    <div className="text-center hidden sm:block">
                      <div className="flex items-center gap-1 md:gap-2 text-xl md:text-2xl font-bold mb-1">
                        <div className="bg-white/20 px-3 py-1 rounded">
                          {formatTime(timeLeft.hours)}
                        </div>
                        <span>:</span>
                        <div className="bg-white/20 px-3 py-1 rounded">
                          {formatTime(timeLeft.minutes)}
                        </div>
                        <span>:</span>
                        <div className="bg-white/20 px-3 py-1 rounded">
                          {formatTime(timeLeft.seconds)}
                        </div>
                      </div>
                      <p className="text-xs md:text-sm text-white/80">Hours : Minutes : Seconds</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-3 md:px-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
                    {flashSaleProducts.map((product) => (
                      <div key={product._id} className="bg-white rounded-lg p-3 relative overflow-hidden">
                        <div className="absolute top-2 left-2 z-10">
                          <Badge className="bg-primary text-black">
                            {product.discount}% OFF
                          </Badge>
                        </div>
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
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* Sale Categories */}
        <section className="py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
              <Card className="bg-card text-foreground hover-elevate cursor-pointer overflow-hidden border border-border">
                <CardContent className="p-4 md:p-6 text-center">
                  <ShoppingBag className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-3 md:mb-4" />
                  <h3 className="text-lg md:text-xl font-bold mb-2">Fashion Sale</h3>
                  <p className="text-sm md:text-base text-muted-foreground mb-3 md:mb-4">Up to 60% off on clothing</p>
                  <Badge variant="secondary">2000+ Items</Badge>
                </CardContent>
              </Card>

              <Card className="bg-card text-foreground hover-elevate cursor-pointer overflow-hidden border border-border">
                <CardContent className="p-4 md:p-6 text-center">
                  <Percent className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-3 md:mb-4" />
                  <h3 className="text-lg md:text-xl font-bold mb-2">Clearance Sale</h3>
                  <p className="text-sm md:text-base text-muted-foreground mb-3 md:mb-4">Up to 70% off selected items</p>
                  <Badge variant="secondary">Limited Stock</Badge>
                </CardContent>
              </Card>

              <Card className="bg-card text-foreground hover-elevate cursor-pointer overflow-hidden border border-border">
                <CardContent className="p-4 md:p-6 text-center">
                  <TrendingDown className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-3 md:mb-4" />
                  <h3 className="text-lg md:text-xl font-bold mb-2">End of Season</h3>
                  <p className="text-sm md:text-base text-muted-foreground mb-3 md:mb-4">Up to 50% off winter collection</p>
                  <Badge variant="secondary">Trending</Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* All Sale Products */}
        <section className="py-8 md:py-12 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">All Sale Items</h2>
                <p className="text-muted-foreground">
                  {isLoading ? "Loading..." : `${saleProducts.length} products on sale`}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="discount">Highest Discount</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="popularity">Most Popular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="h-80 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : saleProducts.length === 0 ? (
              <div className="text-center py-12">
                <TrendingDown className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No sale items available</h3>
                <p className="text-muted-foreground">Check back later for amazing deals!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {saleProducts.map((product) => (
                  <div key={product._id} className="relative">
                    <div className="absolute top-2 left-2 z-10">
                      <Badge className="bg-red-500 text-white">
                        {product.discount}% OFF
                      </Badge>
                    </div>
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
                ))}
              </div>
            )}

            {hasMore && (
              <div className="text-center mt-8">
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={handleLoadMore}
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Load More Products"}
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Sale Stats */}
        <section className="py-8 md:py-12 bg-primary text-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
              <div>
                <div className="text-3xl md:text-4xl font-bold mb-2">70%</div>
                <p className="text-sm md:text-base text-white/90">Max Discount</p>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold mb-2">{saleProducts.length}+</div>
                <p className="text-sm md:text-base text-white/90">Items on Sale</p>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold mb-2">24h</div>
                <p className="text-sm md:text-base text-white/90">Flash Sale Duration</p>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold mb-2">Free</div>
                <p className="text-sm md:text-base text-white/90">Shipping on ₹1000+</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
