import { Navbar } from "@/components/Navbar";
import { OrderCard } from "@/components/OrderCard";
import { Footer } from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const orders = [
  { id: "1", orderNumber: "ORD-2024-1234", date: "March 15, 2024", status: "delivered" as const, items: 3, total: 149.99, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop" },
  { id: "2", orderNumber: "ORD-2024-1235", date: "March 18, 2024", status: "shipped" as const, items: 2, total: 89.99, image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=200&h=200&fit=crop" },
  { id: "3", orderNumber: "ORD-2024-1236", date: "March 20, 2024", status: "processing" as const, items: 1, total: 59.99, image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=200&h=200&fit=crop" },
  { id: "4", orderNumber: "ORD-2024-1237", date: "March 22, 2024", status: "delivered" as const, items: 4, total: 199.99, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop" },
];

export default function OrdersPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold mb-8">My Orders</h1>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="all" data-testid="tab-all-orders">All Orders</TabsTrigger>
              <TabsTrigger value="processing" data-testid="tab-processing">Processing</TabsTrigger>
              <TabsTrigger value="shipped" data-testid="tab-shipped">Shipped</TabsTrigger>
              <TabsTrigger value="delivered" data-testid="tab-delivered">Delivered</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {orders.map((order) => (
                <OrderCard key={order.id} {...order} />
              ))}
            </TabsContent>

            <TabsContent value="processing" className="space-y-4">
              {orders.filter(o => o.status === "processing").map((order) => (
                <OrderCard key={order.id} {...order} />
              ))}
            </TabsContent>

            <TabsContent value="shipped" className="space-y-4">
              {orders.filter(o => o.status === "shipped").map((order) => (
                <OrderCard key={order.id} {...order} />
              ))}
            </TabsContent>

            <TabsContent value="delivered" className="space-y-4">
              {orders.filter(o => o.status === "delivered").map((order) => (
                <OrderCard key={order.id} {...order} />
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
