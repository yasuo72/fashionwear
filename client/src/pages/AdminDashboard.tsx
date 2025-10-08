import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  Tag,
  Settings,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, id: "dashboard" },
  { title: "Products", icon: Package, id: "products" },
  { title: "Categories", icon: FolderTree, id: "categories" },
  { title: "Orders", icon: ShoppingCart, id: "orders" },
  { title: "Customers", icon: Users, id: "customers" },
  { title: "Coupons", icon: Tag, id: "coupons" },
  { title: "Settings", icon: Settings, id: "settings" },
];

export default function AdminDashboard() {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Admin Panel
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton asChild>
                        <a href={`#${item.id}`} data-testid={`link-admin-${item.id}`}>
                          <item.icon />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="flex items-center justify-between h-16 px-6 border-b">
            <div className="flex items-center gap-4">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <h1 className="text-xl font-semibold">Dashboard Overview</h1>
            </div>
            <ThemeToggle />
          </header>

          <main className="flex-1 overflow-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="p-6">
                <div className="text-sm text-muted-foreground mb-2">Total Revenue</div>
                <div className="text-3xl font-bold mb-1" data-testid="text-total-revenue">$48,562</div>
                <div className="text-sm text-chart-3">+12.5% from last month</div>
              </Card>

              <Card className="p-6">
                <div className="text-sm text-muted-foreground mb-2">Total Orders</div>
                <div className="text-3xl font-bold mb-1" data-testid="text-total-orders">1,247</div>
                <div className="text-sm text-chart-3">+8.2% from last month</div>
              </Card>

              <Card className="p-6">
                <div className="text-sm text-muted-foreground mb-2">Active Users</div>
                <div className="text-3xl font-bold mb-1" data-testid="text-active-users">3,892</div>
                <div className="text-sm text-chart-3">+15.3% from last month</div>
              </Card>

              <Card className="p-6">
                <div className="text-sm text-muted-foreground mb-2">Products</div>
                <div className="text-3xl font-bold mb-1" data-testid="text-total-products">542</div>
                <div className="text-sm text-muted-foreground">248 categories</div>
              </Card>
            </div>

            <Tabs defaultValue="recent-orders" className="w-full">
              <TabsList>
                <TabsTrigger value="recent-orders" data-testid="tab-recent-orders">Recent Orders</TabsTrigger>
                <TabsTrigger value="top-products" data-testid="tab-top-products">Top Products</TabsTrigger>
                <TabsTrigger value="analytics" data-testid="tab-analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="recent-orders" className="mt-6">
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Recent Orders</h3>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center justify-between py-3 border-b last:border-0">
                        <div>
                          <div className="font-medium">Order #ORD-2024-{1000 + i}</div>
                          <div className="text-sm text-muted-foreground">Customer Name</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">${(Math.random() * 200 + 50).toFixed(2)}</div>
                          <div className="text-sm text-chart-1">Processing</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="top-products" className="mt-6">
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Top Selling Products</h3>
                  <div className="space-y-4">
                    {[
                      { name: "Classic T-Shirt", sales: 342 },
                      { name: "Denim Jeans", sales: 289 },
                      { name: "Summer Dress", sales: 256 },
                      { name: "Sneakers", sales: 234 },
                      { name: "Leather Jacket", sales: 198 },
                    ].map((product, i) => (
                      <div key={i} className="flex items-center justify-between py-3 border-b last:border-0">
                        <div className="font-medium">{product.name}</div>
                        <div className="text-muted-foreground">{product.sales} sales</div>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="mt-6">
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Analytics Overview</h3>
                  <p className="text-muted-foreground">Analytics charts and data will be displayed here</p>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
