import { ThemeProvider } from "@/lib/theme-provider";
import { ProductCard } from "../ProductCard";

export default function ProductCardExample() {
  return (
    <ThemeProvider>
      <div className="p-8 max-w-xs">
        <ProductCard
          id="1"
          name="Classic Cotton T-Shirt - Comfortable Fit"
          price={29.99}
          originalPrice={49.99}
          image="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop"
          rating={4.5}
          reviews={128}
          discount={40}
          badge="Trending"
        />
      </div>
    </ThemeProvider>
  );
}
