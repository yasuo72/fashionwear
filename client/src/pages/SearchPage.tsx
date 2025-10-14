import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { useProducts } from "@/hooks/useProducts";
import { Search } from "lucide-react";

export default function SearchPage() {
  // Get query parameter from URL
  const searchParams = new URLSearchParams(window.location.search);
  const query = searchParams.get('q') || '';
  
  const { data, isLoading } = useProducts({ search: query });
  const products = data?.products || [];

  console.log('Search query:', query);
  console.log('Products found:', products.length);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className="bg-muted py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold mb-2">Search Results</h1>
            <p className="text-muted-foreground">
              {query ? `Showing results for "${query}"` : 'Enter a search query'}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Searching...</p>
            </div>
          ) : products.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground mb-6">
                Found {products.length} {products.length === 1 ? 'product' : 'products'}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {products.map((product) => (
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
            </>
          ) : (
            <Card className="p-12 text-center">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">No products found</h2>
              <p className="text-muted-foreground">
                {query 
                  ? `We couldn't find any products matching "${query}". Try a different search term.`
                  : 'Enter a search query to find products.'
                }
              </p>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
