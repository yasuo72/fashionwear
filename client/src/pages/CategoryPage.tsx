import { useState } from "react";
import { useParams } from "wouter";
import { Navbar } from "@/components/Navbar";
import { FilterSidebar } from "@/components/FilterSidebar";
import { ProductCard } from "@/components/ProductCard";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SlidersHorizontal } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";

export default function CategoryPage() {
  const { id: categorySlug } = useParams();
  const [sortBy, setSortBy] = useState("popularity");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  
  const { data: categoriesData } = useCategories();
  const { data: productsData, isLoading } = useProducts({ 
    category: categorySlug,
    limit: 100, // Fetch more products for client-side sorting
  });

  const categories = categoriesData?.categories || [];
  const currentCategory = categories.find(cat => cat.slug === categorySlug);
  let products = productsData?.products || [];
  
  // Apply client-side filters
  products = products.filter(product => {
    // Price filter
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }
    
    // Brand filter
    if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
      return false;
    }
    
    return true;
  });
  
  // Apply client-side sorting
  products = [...products].sort((a, b) => {
    switch (sortBy) {
      case "price-low-high":
        return a.price - b.price;
      case "price-high-low":
        return b.price - a.price;
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "newest":
        // Sort by _id (MongoDB ObjectId contains timestamp)
        return b._id.localeCompare(a._id);
      case "popularity":
      default:
        // Popularity = rating * reviewCount (products with more reviews and higher ratings)
        const popularityA = (a.rating || 0) * (a.reviewCount || 0);
        const popularityB = (b.rating || 0) * (b.reviewCount || 0);
        return popularityB - popularityA;
    }
  });
  
  // Paginate after filtering and sorting
  const displayedProducts = products.slice(0, 20 * page);
  
  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };
  
  const hasMore = products.length > displayedProducts.length;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className="bg-muted py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-sm text-muted-foreground">
              Home / <span className="text-foreground font-medium capitalize">{currentCategory?.name || categorySlug}</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold mb-1 capitalize">
                {currentCategory?.name || categorySlug}
              </h1>
              <p className="text-muted-foreground">
                {isLoading ? "Loading..." : `Showing ${displayedProducts.length} of ${products.length} products`}
              </p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="md:hidden flex-1" data-testid="button-mobile-filters">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterSidebar 
                      priceRange={priceRange}
                      onPriceChange={setPriceRange}
                      selectedBrands={selectedBrands}
                      onBrandsChange={setSelectedBrands}
                    />
                  </div>
                </SheetContent>
              </Sheet>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]" data-testid="select-sort">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                  <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="rating">Customer Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-6">
            <aside className="hidden md:block w-64 flex-shrink-0">
              <div className="sticky top-20">
                <FilterSidebar 
                  priceRange={priceRange}
                  onPriceChange={setPriceRange}
                  selectedBrands={selectedBrands}
                  onBrandsChange={setSelectedBrands}
                />
              </div>
            </aside>

            <div className="flex-1">
              {isLoading ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : displayedProducts.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-lg font-semibold mb-2">No products found</h3>
                  <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {displayedProducts.map((product) => (
                      <ProductCard 
                        key={product._id} 
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
                    ))}
                  </div>

                  {hasMore && (
                    <div className="mt-8 flex justify-center">
                      <Button 
                        variant="outline" 
                        size="lg" 
                        onClick={handleLoadMore}
                        disabled={isLoading}
                        data-testid="button-load-more"
                      >
                        {isLoading ? "Loading..." : "Load More Products"}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
