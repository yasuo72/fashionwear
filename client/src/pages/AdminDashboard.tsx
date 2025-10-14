import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
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
  Plus,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package2,
  UserCheck,
  Clock,
  CheckCircle,
  Truck,
  X,
  Search,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { useCategories } from "@/hooks/useCategories";
import { 
  useAdminStats, 
  useAdminOrders, 
  useAdminProducts, 
  useAdminUsers,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useUpdateOrderStatus,
  useTopProducts,
  useAdminCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useAdminCoupons,
  useCreateCoupon,
  useUpdateCoupon,
  useDeleteCoupon
} from "@/hooks/useAdmin";
import { toast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { ProductManagement } from "@/components/admin/ProductManagement";
import { OrderManagement } from "@/components/admin/OrderManagement";
import { CategoryManagement } from "@/components/admin/CategoryManagement";
import { CouponManagement } from "@/components/admin/CouponManagement";
import { SalesAnalytics } from "@/components/admin/SalesAnalytics";
import { useQuery } from "@tanstack/react-query";

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, id: "dashboard" },
  { title: "Sales Analytics", icon: TrendingUp, id: "sales" },
  { title: "Products", icon: Package, id: "products" },
  { title: "Categories", icon: FolderTree, id: "categories" },
  { title: "Orders", icon: ShoppingCart, id: "orders" },
  { title: "Customers", icon: Users, id: "customers" },
  { title: "Coupons", icon: Tag, id: "coupons" },
  { title: "Settings", icon: Settings, id: "settings" },
];

export default function AdminDashboard() {
  const { data: authData } = useAuth();
  const { data: statsData } = useAdminStats();
  const { data: ordersData } = useAdminOrders();
  const { data: productsData } = useAdminProducts();
  const { data: usersData } = useAdminUsers();
  const { data: categoriesData } = useCategories();
  const { data: adminCategoriesData } = useAdminCategories();
  const { data: couponsData } = useAdminCoupons();
  const { data: topProductsData } = useTopProducts();
  
  // Mutations
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const updateOrderStatus = useUpdateOrderStatus();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  const createCoupon = useCreateCoupon();
  const updateCoupon = useUpdateCoupon();
  const deleteCoupon = useDeleteCoupon();
  
  // State
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [timeRange, setTimeRange] = useState("7days");
  
  // Sales Analytics
  const { data: salesData, isLoading: salesLoading, refetch: refetchSales } = useQuery<any>({
    queryKey: [`/api/admin/sales-analytics?timeRange=${timeRange}`],
    enabled: activeTab === "sales",
  });
  
  const [productForm, setProductForm] = useState({
    name: "",
    slug: "",
    description: "",
    price: 0,
    originalPrice: 0,
    discount: 0,
    images: [""],
    categoryId: "",
    variants: [{ size: "", color: "", stock: 0 }],
    brand: "",
    tags: [""],
    isFeatured: false,
    isActive: true,
  });

  const user = authData?.user;
  const stats = statsData || { 
    totalRevenue: 0, 
    totalOrders: 0, 
    activeUsers: 0, 
    totalProducts: 0, 
    revenueGrowth: 0, 
    ordersGrowth: 0, 
    usersGrowth: 0 
  };
  const orders = ordersData?.orders || [];
  const products = productsData?.products || [];
  const users = usersData?.users || [];
  const categories = categoriesData?.categories || [];
  const adminCategories = adminCategoriesData?.categories || [];
  const coupons = couponsData?.coupons || [];
  const topProducts = topProductsData?.products || [];

  // Check if user is admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-muted-foreground mb-6">You need admin privileges to access this page.</p>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const handleCreateProduct = async (data: any) => {
    try {
      await createProduct.mutateAsync(data);
      toast({
        title: "Product Created",
        description: "Product has been created successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to create product. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleUpdateProduct = async (data: any) => {
    try {
      await updateProduct.mutateAsync(data);
      toast({
        title: "Product Updated",
        description: "Product has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to update product. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      await deleteProduct.mutateAsync(productId);
      toast({
        title: "Product Deleted",
        description: "Product has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await updateOrderStatus.mutateAsync({ orderId, status });
      toast({
        title: "Order Updated",
        description: "Order status has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCreateCategory = async (data: any) => {
    try {
      await createCategory.mutateAsync(data);
      toast({
        title: "Category Created",
        description: "Category has been created successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create category. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateCategory = async (data: any) => {
    try {
      await updateCategory.mutateAsync(data);
      toast({
        title: "Category Updated",
        description: "Category has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update category. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await deleteCategory.mutateAsync(categoryId);
      toast({
        title: "Category Deleted",
        description: "Category has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete category. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCreateCoupon = async (data: any) => {
    try {
      await createCoupon.mutateAsync(data);
      toast({
        title: "Coupon Created",
        description: "Coupon has been created successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create coupon. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateCoupon = async (data: any) => {
    try {
      await updateCoupon.mutateAsync(data);
      toast({
        title: "Coupon Updated",
        description: "Coupon has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update coupon. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCoupon = async (couponId: string) => {
    try {
      await deleteCoupon.mutateAsync(couponId);
      toast({
        title: "Coupon Deleted",
        description: "Coupon has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete coupon. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetProductForm = () => {
    setProductForm({
      name: "",
      slug: "",
      description: "",
      price: 0,
      originalPrice: 0,
      discount: 0,
      images: [""],
      categoryId: "",
      variants: [{ size: "", color: "", stock: 0 }],
      brand: "",
      tags: [""],
      isFeatured: false,
      isActive: true,
    });
  };

  const openEditProduct = (product: any) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice || 0,
      discount: product.discount || 0,
      images: product.images,
      categoryId: product.categoryId,
      variants: product.variants,
      brand: product.brand,
      tags: product.tags,
      isFeatured: product.isFeatured,
      isActive: product.isActive,
    });
    setShowProductDialog(true);
  };

  const getOrderStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'processing': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'shipped': return <Truck className="h-4 w-4 text-purple-500" />;
      case 'delivered': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled': return <X className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                      <SidebarMenuButton 
                        asChild
                        className={activeTab === item.id ? "bg-accent" : ""}
                      >
                        <button onClick={() => setActiveTab(item.id)}>
                          <item.icon />
                          <span>{item.title}</span>
                        </button>
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
              <SidebarTrigger />
              <h1 className="text-xl font-semibold">
                {menuItems.find(item => item.id === activeTab)?.title || "Dashboard"}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary">Admin: {user.firstName} {user.lastName}</Badge>
              <ThemeToggle />
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6">
            {activeTab === "dashboard" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">₹{(stats.totalRevenue || 0).toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground flex items-center">
                        {(stats.revenueGrowth || 0) >= 0 ? (
                          <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                        )}
                        {Math.abs(stats.revenueGrowth || 0)}% from last month
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                      <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{(stats.totalOrders || 0).toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground flex items-center">
                        {(stats.ordersGrowth || 0) >= 0 ? (
                          <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                        )}
                        {Math.abs(stats.ordersGrowth || 0)}% from last month
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                      <UserCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{(stats.activeUsers || 0).toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground flex items-center">
                        {(stats.usersGrowth || 0) >= 0 ? (
                          <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                        )}
                        {Math.abs(stats.usersGrowth || 0)}% from last month
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Products</CardTitle>
                      <Package2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.totalProducts || 0}</div>
                      <p className="text-xs text-muted-foreground">{categories.length} categories</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {orders.slice(0, 5).map((order) => (
                          <div key={order._id} className="flex items-center justify-between py-3 border-b last:border-0">
                            <div>
                              <div className="font-medium">Order #{order.orderNumber}</div>
                              <div className="text-sm text-muted-foreground">
                                {order.userId.firstName} {order.userId.lastName}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">₹{order.total.toFixed(0)}</div>
                              <div className="flex items-center gap-1 text-sm">
                                {getOrderStatusIcon(order.status)}
                                <span className="capitalize">{order.status}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                        {orders.length === 0 && (
                          <p className="text-muted-foreground text-center py-4">No orders yet</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Top Selling Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {topProducts.slice(0, 5).map((product, i) => (
                          <div key={i} className="flex items-center justify-between py-3 border-b last:border-0">
                            <div className="font-medium">{product.name}</div>
                            <div className="text-muted-foreground">{product.sales} sales</div>
                          </div>
                        ))}
                        {topProducts.length === 0 && (
                          <p className="text-muted-foreground text-center py-4">No sales data yet</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}

            {activeTab === "sales" && (
              <SalesAnalytics
                stats={{
                  totalRevenue: salesData?.totalRevenue || 0,
                  totalOrders: salesData?.totalOrders || 0,
                  averageOrderValue: salesData?.averageOrderValue || 0,
                  totalCustomers: salesData?.totalCustomers || 0,
                  totalProducts: salesData?.totalProducts || 0,
                  revenueGrowth: salesData?.revenueGrowth || 0,
                  ordersGrowth: salesData?.ordersGrowth || 0,
                  topSellingProducts: salesData?.topSellingProducts || [],
                  recentOrders: salesData?.recentOrders || []
                }}
                isLoading={salesLoading}
                onRefresh={() => refetchSales()}
              />
            )}

            {activeTab === "products" && (
              <div>
                <ProductManagement
                  products={products}
                  categories={categories}
                  onCreateProduct={handleCreateProduct}
                  onUpdateProduct={handleUpdateProduct}
                  onDeleteProduct={handleDeleteProduct}
                  isLoading={createProduct.isPending || updateProduct.isPending || deleteProduct.isPending}
                />
              </div>
            )}

            {activeTab === "orders" && (
              <div>
                <OrderManagement
                  orders={orders}
                  onUpdateOrderStatus={handleUpdateOrderStatus}
                  isLoading={updateOrderStatus.isPending}
                />
              </div>
            )}

            {activeTab === "customers" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold">Customer Management</h2>
                  <p className="text-muted-foreground">Manage customer accounts and information</p>
                </div>
                
                <div className="grid gap-4">
                  {users.map((user) => (
                    <Card key={user._id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{user.firstName} {user.lastName}</h3>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                {user.role}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                Joined {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {users.length === 0 && (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No customers yet</h3>
                        <p className="text-muted-foreground">Customer accounts will appear here</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}

            {activeTab === "categories" && (
              <div>
                <CategoryManagement
                  categories={adminCategories}
                  onCreateCategory={handleCreateCategory}
                  onUpdateCategory={handleUpdateCategory}
                  onDeleteCategory={handleDeleteCategory}
                  isLoading={createCategory.isPending || updateCategory.isPending || deleteCategory.isPending}
                />
              </div>
            )}

            {activeTab === "coupons" && (
              <div>
                <CouponManagement
                  coupons={coupons}
                  onCreateCoupon={handleCreateCoupon}
                  onUpdateCoupon={handleUpdateCoupon}
                  onDeleteCoupon={handleDeleteCoupon}
                  isLoading={createCoupon.isPending || updateCoupon.isPending || deleteCoupon.isPending}
                />
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold">Settings</h2>
                  <p className="text-muted-foreground">Manage application settings</p>
                </div>
                
                <div className="grid gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Store Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="storeName">Store Name</Label>
                        <Input id="storeName" defaultValue="FashionHub" />
                      </div>
                      <div>
                        <Label htmlFor="storeEmail">Store Email</Label>
                        <Input id="storeEmail" defaultValue="admin@fashionhub.com" />
                      </div>
                      <div>
                        <Label htmlFor="storePhone">Store Phone</Label>
                        <Input id="storePhone" defaultValue="+1 (555) 123-4567" />
                      </div>
                      <Button>Save Changes</Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Shipping Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="freeShipping">Free Shipping Threshold (₹)</Label>
                        <Input id="freeShipping" type="number" defaultValue="4149" />
                      </div>
                      <div>
                        <Label htmlFor="shippingRate">Standard Shipping Rate (₹)</Label>
                        <Input id="shippingRate" type="number" defaultValue="830" />
                      </div>
                      <Button>Save Changes</Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
