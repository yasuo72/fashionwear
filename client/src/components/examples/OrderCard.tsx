import { ThemeProvider } from "@/lib/theme-provider";
import { OrderCard } from "../OrderCard";

export default function OrderCardExample() {
  return (
    <ThemeProvider>
      <div className="p-8 max-w-3xl space-y-4">
        <OrderCard
          id="1"
          orderNumber="ORD-2024-1234"
          date="March 15, 2024"
          status="delivered"
          items={3}
          total={149.99}
          image="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop"
        />
        <OrderCard
          id="2"
          orderNumber="ORD-2024-1235"
          date="March 18, 2024"
          status="shipped"
          items={2}
          total={89.99}
          image="https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200&h=200&fit=crop"
        />
      </div>
    </ThemeProvider>
  );
}
