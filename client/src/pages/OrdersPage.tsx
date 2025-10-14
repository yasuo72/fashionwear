import { Navbar } from "@/components/Navbar";
import { OrderCard } from "@/components/OrderCard";
import { Footer } from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useOrders } from "@/hooks/useOrders";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";

export default function OrdersPage() {
  const { data: authData } = useAuth();
  const { data: ordersData, isLoading } = useOrders();

  const user = authData?.user;
  const orders = ordersData?.orders || [];

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
            <p className="text-muted-foreground mb-6">You need to be logged in to view your orders.</p>
            <Link href="/login">
              <Button>Sign In</Button>
            </Link>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
          <h1 className="text-3xl font-bold mb-8">My Orders</h1>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <Card className="p-12 text-center">
              <h2 className="text-2xl font-semibold mb-4">No orders yet</h2>
              <p className="text-muted-foreground mb-6">Start shopping to see your orders here!</p>
              <Link href="/">
                <Button>Start Shopping</Button>
              </Link>
            </Card>
          ) : (
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="all" data-testid="tab-all-orders">
                  All Orders ({orders.length})
                </TabsTrigger>
                <TabsTrigger value="pending" data-testid="tab-pending">
                  Pending ({orders.filter(o => o.status === "pending").length})
                </TabsTrigger>
                <TabsTrigger value="processing" data-testid="tab-processing">
                  Processing ({orders.filter(o => o.status === "processing").length})
                </TabsTrigger>
                <TabsTrigger value="shipped" data-testid="tab-shipped">
                  Shipped ({orders.filter(o => o.status === "shipped").length})
                </TabsTrigger>
                <TabsTrigger value="delivered" data-testid="tab-delivered">
                  Delivered ({orders.filter(o => o.status === "delivered").length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {orders.map((order) => (
                  <OrderCard 
                    key={order._id} 
                    id={order._id}
                    orderNumber={order.orderNumber}
                    date={new Date(order.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                    status={order.status}
                    items={order.items.length}
                    total={order.total}
                    image={order.items[0]?.image || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop"}
                  />
                ))}
              </TabsContent>

              <TabsContent value="pending" className="space-y-4">
                {orders.filter(o => o.status === "pending").map((order) => (
                  <OrderCard 
                    key={order._id} 
                    id={order._id}
                    orderNumber={order.orderNumber}
                    date={new Date(order.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                    status={order.status}
                    items={order.items.length}
                    total={order.total}
                    image={order.items[0]?.image || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop"}
                  />
                ))}
                {orders.filter(o => o.status === "pending").length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No pending orders</p>
                )}
              </TabsContent>

              <TabsContent value="processing" className="space-y-4">
                {orders.filter(o => o.status === "processing").map((order) => (
                  <OrderCard 
                    key={order._id} 
                    id={order._id}
                    orderNumber={order.orderNumber}
                    date={new Date(order.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                    status={order.status}
                    items={order.items.length}
                    total={order.total}
                    image={order.items[0]?.image || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop"}
                  />
                ))}
                {orders.filter(o => o.status === "processing").length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No processing orders</p>
                )}
              </TabsContent>

              <TabsContent value="shipped" className="space-y-4">
                {orders.filter(o => o.status === "shipped").map((order) => (
                  <OrderCard 
                    key={order._id} 
                    id={order._id}
                    orderNumber={order.orderNumber}
                    date={new Date(order.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                    status={order.status}
                    items={order.items.length}
                    total={order.total}
                    image={order.items[0]?.image || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop"}
                  />
                ))}
                {orders.filter(o => o.status === "shipped").length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No shipped orders</p>
                )}
              </TabsContent>

              <TabsContent value="delivered" className="space-y-4">
                {orders.filter(o => o.status === "delivered").map((order) => (
                  <OrderCard 
                    key={order._id} 
                    id={order._id}
                    orderNumber={order.orderNumber}
                    date={new Date(order.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                    status={order.status}
                    items={order.items.length}
                    total={order.total}
                    image={order.items[0]?.image || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop"}
                  />
                ))}
                {orders.filter(o => o.status === "delivered").length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No delivered orders</p>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
