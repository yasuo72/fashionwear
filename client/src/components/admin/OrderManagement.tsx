import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { 
  Clock, 
  CheckCircle, 
  Truck, 
  X, 
  Eye, 
  Search,
  Package,
  User,
  MapPin,
  Calendar,
  Sparkles,
  ShoppingBag
} from "lucide-react";

interface OrderManagementProps {
  orders: any[];
  onUpdateOrderStatus: (orderId: string, status: string) => Promise<void>;
  isLoading?: boolean;
}

export function OrderManagement({ orders, onUpdateOrderStatus, isLoading = false }: OrderManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showOrderDialog, setShowOrderDialog] = useState(false);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'processing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'shipped': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await onUpdateOrderStatus(orderId, newStatus);
    } catch (error) {
      // Error handling is done in parent component
    }
  };

  const openOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setShowOrderDialog(true);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${order.userId?.firstName || ''} ${order.userId?.lastName || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.userId?.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const orderStats = [
    { label: "Total Orders", value: orders.length, color: "#6366f1", gradient: "from-indigo-500 to-violet-600" },
    { label: "Pending", value: orders.filter(o => o.status === 'pending').length, color: "#eab308", gradient: "from-yellow-500 to-amber-600" },
    { label: "Processing", value: orders.filter(o => o.status === 'processing').length, color: "#3b82f6", gradient: "from-blue-500 to-cyan-600" },
    { label: "Shipped", value: orders.filter(o => o.status === 'shipped').length, color: "#8b5cf6", gradient: "from-violet-500 to-purple-600" },
    { label: "Delivered", value: orders.filter(o => o.status === 'delivered').length, color: "#10b981", gradient: "from-emerald-500 to-green-600" },
    { label: "Cancelled", value: orders.filter(o => o.status === 'cancelled').length, color: "#ef4444", gradient: "from-red-500 to-rose-600" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="group" style={{ perspective: '1000px' }}>
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold px-3 py-1.5 rounded-full mb-2">
          <Sparkles className="w-3 h-3" />
          Order Center
        </div>
        <h2 className="text-2xl font-black bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Order Management
        </h2>
        <p className="text-muted-foreground text-sm">Track and manage customer orders</p>
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {orderStats.map((stat, index) => (
          <div 
            key={stat.label}
            className="group relative"
            style={{ perspective: '1000px' }}
          >
            <div 
              className="absolute -inset-[1px] rounded-xl opacity-0 group-hover:opacity-100 blur-[1px] transition-all duration-300"
              style={{ background: `linear-gradient(135deg, ${stat.color}40, ${stat.color}20)` }}
            />
            <Card className="relative overflow-hidden rounded-xl border border-border/40 hover:border-border/60 transition-all duration-300 group-hover:shadow-lg group-hover:scale-[1.02] transform-gpu h-full">
              <div 
                className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-10`}
              />
              <CardContent className="relative p-4 text-center">
                <div className="text-2xl font-black" style={{ color: stat.color }}>{stat.value}</div>
                <div className="text-xs text-muted-foreground font-medium">{stat.label}</div>
              </CardContent>
              
              {/* Shine effect */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 group-hover:left-[150%] transition-all duration-700" />
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-9 border-border/50 focus:border-indigo-500/50 transition-colors"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px] h-9 border-border/50 hover:border-indigo-500/50 transition-colors">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Badge variant="secondary" className="h-9 px-3">{filteredOrders.length} orders</Badge>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filteredOrders.map((order) => (
          <div 
            key={order._id}
            className="group relative"
            style={{ perspective: '1000px' }}
          >
            <div 
              className="absolute -inset-[1px] rounded-xl opacity-0 group-hover:opacity-100 blur-[1px] transition-all duration-300 bg-gradient-to-r from-indigo-500/20 to-violet-500/20"
            />
            <Card className="relative overflow-hidden rounded-xl border border-border/40 hover:border-border/60 transition-all duration-300 group-hover:shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-indigo-500/10">
                        <ShoppingBag className="h-4 w-4 text-indigo-600" />
                      </div>
                      <h3 className="font-bold text-sm">Order #{order.orderNumber}</h3>
                      <div className="flex items-center gap-1">
                        {getOrderStatusIcon(order.status)}
                        <Badge className={`text-[10px] font-bold ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3.5 w-3.5" />
                        {order.userId?.firstName || 'Unknown'} {order.userId?.lastName || 'User'}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Package className="h-3.5 w-3.5" />
                        {order.items.length} items
                      </div>
                    </div>
                    
                    <div className="text-lg font-bold text-indigo-600">
                      ₹{order.total.toFixed(0)}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 shrink-0">
                    <Select
                      value={order.status}
                      onValueChange={(value) => handleStatusUpdate(order._id, value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="w-[120px] h-8 text-xs border-border/50 hover:border-indigo-500/50 transition-colors">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 border-border/50 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all"
                      onClick={() => openOrderDetails(order)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
        
        {filteredOrders.length === 0 && (
          <Card className="border-dashed border-border/40">
            <CardContent className="p-12 text-center">
              <div className="p-4 rounded-full bg-muted/50 w-fit mx-auto mb-4">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-bold mb-2">No orders found</h3>
              <p className="text-sm text-muted-foreground">
                {searchTerm || statusFilter !== "all" 
                  ? "Try adjusting your search or filters" 
                  : "Orders will appear here when customers place them"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Order Details Dialog */}
      <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-indigo-600" />
              Order Details - #{selectedOrder?.orderNumber}
            </DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-4">
              {/* Order Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border border-border/40">
                  <CardHeader className="border-b border-border/40 pb-3">
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <User className="h-4 w-4 text-indigo-600" />
                      Customer Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="font-medium">{selectedOrder.userId?.firstName || 'Unknown'} {selectedOrder.userId?.lastName || 'User'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-medium">{selectedOrder.userId?.email || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Order Date:</span>
                      <span className="font-medium">{new Date(selectedOrder.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Status:</span>
                      <div className="flex items-center gap-1">
                        {getOrderStatusIcon(selectedOrder.status)}
                        <Badge className={`text-[10px] font-bold ${getStatusColor(selectedOrder.status)}`}>
                          {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border border-border/40">
                  <CardHeader className="border-b border-border/40 pb-3">
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-indigo-600" />
                      Shipping Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                      <div className="text-muted-foreground">
                        <div className="font-medium text-foreground">{selectedOrder.shippingAddress.street}</div>
                        <div>
                          {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}
                        </div>
                        <div>{selectedOrder.shippingAddress.country}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Order Items */}
              <Card className="border border-border/40">
                <CardHeader className="border-b border-border/40 pb-3">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Package className="h-4 w-4 text-indigo-600" />
                    Order Items
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    {selectedOrder.items.map((item: any, index: number) => (
                      <div 
                        key={index} 
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/30"
                      >
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center shrink-0">
                          <Package className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{item.name}</h4>
                          <div className="text-xs text-muted-foreground">
                            Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="font-bold text-sm text-indigo-600">₹{item.price.toFixed(0)}</div>
                          <div className="text-xs text-muted-foreground">each</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span className="font-medium">₹{(selectedOrder.total - 830 - selectedOrder.total * 0.08).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping:</span>
                      <span className="font-medium">₹830</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax:</span>
                      <span className="font-medium">₹{(selectedOrder.total * 0.08).toFixed(0)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-base">
                      <span>Total:</span>
                      <span className="text-indigo-600">₹{selectedOrder.total.toFixed(0)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
