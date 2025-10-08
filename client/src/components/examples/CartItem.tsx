import { ThemeProvider } from "@/lib/theme-provider";
import { CartItem } from "../CartItem";

export default function CartItemExample() {
  return (
    <ThemeProvider>
      <div className="p-8 max-w-2xl">
        <CartItem
          id="1"
          name="Classic Cotton T-Shirt"
          price={29.99}
          image="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop"
          size="M"
          color="Blue"
          initialQuantity={2}
        />
      </div>
    </ThemeProvider>
  );
}
