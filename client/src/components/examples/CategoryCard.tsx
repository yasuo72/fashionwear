import { ThemeProvider } from "@/lib/theme-provider";
import { CategoryCard } from "../CategoryCard";

export default function CategoryCardExample() {
  return (
    <ThemeProvider>
      <div className="p-8 max-w-sm">
        <CategoryCard
          id="men"
          name="Men's Fashion"
          image="https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=400&h=400&fit=crop"
          productCount={245}
        />
      </div>
    </ThemeProvider>
  );
}
