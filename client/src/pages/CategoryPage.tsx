import { useState } from "react";
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

const products = [
  { id: "1", name: "Classic White T-Shirt", price: 29.99, originalPrice: 49.99, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop", rating: 4.5, reviews: 128, discount: 40 },
  { id: "2", name: "Blue Denim Jeans", price: 69.99, originalPrice: 99.99, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop", rating: 4.7, reviews: 95, discount: 30 },
  { id: "3", name: "Summer Floral Dress", price: 59.99, image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop", rating: 4.8, reviews: 203 },
  { id: "4", name: "Leather Biker Jacket", price: 149.99, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop", rating: 4.6, reviews: 76 },
  { id: "5", name: "Casual Sneakers", price: 79.99, image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=400&fit=crop", rating: 4.9, reviews: 342 },
  { id: "6", name: "Striped Polo Shirt", price: 39.99, image: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=400&h=400&fit=crop", rating: 4.4, reviews: 89 },
  { id: "7", name: "Wool Winter Coat", price: 199.99, image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&h=400&fit=crop", rating: 4.7, reviews: 156 },
  { id: "8", name: "Sports Watch", price: 129.99, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop", rating: 4.8, reviews: 234 },
];

export default function CategoryPage() {
  const [sortBy, setSortBy] = useState("popularity");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className="bg-muted py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-sm text-muted-foreground">
              Home / Men / <span className="text-foreground font-medium">T-Shirts</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold mb-1">Men's T-Shirts</h1>
              <p className="text-muted-foreground">Showing 248 products</p>
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
                    <FilterSidebar />
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
                <FilterSidebar />
              </div>
            </aside>

            <div className="flex-1">
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>

              <div className="mt-8 flex justify-center">
                <Button variant="outline" size="lg" data-testid="button-load-more">
                  Load More Products
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
