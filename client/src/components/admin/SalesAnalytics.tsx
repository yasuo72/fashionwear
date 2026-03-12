import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  Users,
  Package,
  Calendar,
  Download,
  RefreshCw,
  Sparkles,
  IndianRupee
} from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface SalesStats {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  totalCustomers: number;
  totalProducts: number;
  revenueGrowth: number;
  ordersGrowth: number;
  topSellingProducts: Array<{
    name: string;
    sales: number;
    revenue: number;
  }>;
  recentOrders: Array<{
    _id: string;
    orderNumber: string;
    total: number;
    status: string;
    createdAt: string;
  }>;
}

interface SalesAnalyticsProps {
  stats: SalesStats;
  isLoading: boolean;
  onRefresh: () => void;
}

export function SalesAnalytics({ stats, isLoading, onRefresh }: SalesAnalyticsProps) {
  const [timeRange, setTimeRange] = useState("7days");
  const [isExporting, setIsExporting] = useState(false);

  const statCards = [
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: IndianRupee,
      trend: stats.revenueGrowth,
      color: "#10b981",
      gradient: "from-emerald-500 to-green-600",
      bgGradient: "from-emerald-500/10 to-green-600/10"
    },
    {
      title: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      icon: ShoppingCart,
      trend: stats.ordersGrowth,
      color: "#3b82f6",
      gradient: "from-blue-500 to-indigo-600",
      bgGradient: "from-blue-500/10 to-indigo-600/10"
    },
    {
      title: "Avg Order Value",
      value: `₹${stats.averageOrderValue.toLocaleString()}`,
      icon: TrendingUp,
      color: "#8b5cf6",
      gradient: "from-violet-500 to-purple-600",
      bgGradient: "from-violet-500/10 to-purple-600/10"
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers.toLocaleString(),
      icon: Users,
      color: "#f59e0b",
      gradient: "from-amber-500 to-orange-600",
      bgGradient: "from-amber-500/10 to-orange-600/10"
    }
  ];

  const handleRefresh = async () => {
    try {
      await onRefresh();
      toast({
        title: "Data Refreshed",
        description: "Sales analytics data has been updated.",
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    if (!stats.recentOrders || stats.recentOrders.length === 0) {
      toast({
        title: "No Data to Export",
        description: "There are no recent orders to export.",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);

    try {
      // Export sales data to CSV
      const headers = ['Order Number', 'Total', 'Status', 'Date'];
      const csvData = stats.recentOrders.map(order => [
        order.orderNumber,
        order.total.toString(),
        order.status,
        new Date(order.createdAt).toLocaleDateString()
      ]);

      const csv = [
        headers.join(','),
        ...csvData.map(row => row.join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sales-report-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: "Sales report has been downloaded.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="group" style={{ perspective: '1000px' }}>
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-amber-600 text-xs font-bold px-3 py-1.5 rounded-full mb-2">
            <Sparkles className="w-3 h-3" />
            Analytics Dashboard
          </div>
          <h2 className="text-2xl font-black bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Sales Analytics
          </h2>
          <p className="text-muted-foreground text-sm">Track your sales performance in real-time</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px] h-9 text-sm border-border/50 hover:border-amber-500/50 transition-colors">
              <Calendar className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh} 
            disabled={isLoading}
            className="h-9 border-border/50 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all duration-300"
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            size="sm"
            onClick={handleExport}
            disabled={isExporting || !stats.recentOrders?.length}
            className="h-9 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all duration-300"
          >
            <Download className={`h-3.5 w-3.5 mr-1.5 ${isExporting ? 'animate-bounce' : ''}`} />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <div 
            key={index} 
            className="group relative"
            style={{ perspective: '1000px' }}
          >
            {/* Glow border on hover */}
            <div 
              className="absolute -inset-[1px] rounded-xl opacity-0 group-hover:opacity-100 blur-[1px] transition-all duration-300"
              style={{ background: `linear-gradient(135deg, ${stat.color}40, ${stat.color}20)` }}
            />
            
            <Card className="relative overflow-hidden rounded-xl border border-border/40 hover:border-border/60 transition-all duration-300 group-hover:shadow-xl group-hover:scale-[1.02] transform-gpu group-hover:rotateY-1 group-hover:rotateX-1 h-full flex flex-col">
              {/* Background gradient */}
              <div 
                className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-50`}
              />
              
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2 shrink-0">
                <CardTitle className="text-xs font-medium text-muted-foreground">{stat.title}</CardTitle>
                <div 
                  className="p-2 rounded-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"
                  style={{ background: `${stat.color}20` }}
                >
                  <stat.icon className="h-4 w-4" style={{ color: stat.color }} />
                </div>
              </CardHeader>
              <CardContent className="relative flex-1 flex flex-col justify-center">
                <div className="text-2xl font-black" style={{ color: stat.color }}>{stat.value}</div>
                <div className="flex items-center text-xs text-muted-foreground mt-1.5 min-h-[20px]">
                  {stat.trend !== undefined ? (
                    stat.trend >= 0 ? (
                      <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-green-500/10">
                        <TrendingUp className="h-3 w-3 text-green-600" />
                        <span className="text-green-600 font-semibold">+{stat.trend}%</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-red-500/10">
                        <TrendingDown className="h-3 w-3 text-red-600" />
                        <span className="text-red-600 font-semibold">{stat.trend}%</span>
                      </div>
                    )
                  ) : (
                    <span className="text-transparent">placeholder</span>
                  )}
                  <span className="ml-1.5">vs last period</span>
                </div>
              </CardContent>
              
              {/* Shine effect */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 group-hover:left-[150%] transition-all duration-700" />
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* Top Selling Products */}
      <div className="group relative" style={{ perspective: '1000px' }}>
        <div className="absolute -inset-[1px] rounded-xl opacity-0 group-hover:opacity-100 blur-[1px] transition-all duration-300 bg-gradient-to-r from-violet-500/30 to-purple-500/30" />
        
        <Card className="relative overflow-hidden rounded-xl border border-border/40 hover:border-border/60 transition-all duration-300 group-hover:shadow-xl">
          <CardHeader className="border-b border-border/40">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-violet-500/10">
                <Package className="h-4 w-4 text-violet-600" />
              </div>
              <CardTitle className="text-base font-bold">Top Selling Products</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              {stats.topSellingProducts.map((product, index) => (
                <div 
                  key={index} 
                  className="group/item flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 border border-transparent hover:border-border/40 transition-all duration-300 hover:scale-[1.01]"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="flex h-9 w-9 items-center justify-center rounded-lg font-bold text-sm transition-all duration-300 group-hover/item:scale-110 group-hover/item:rotate-6"
                      style={{ 
                        background: index === 0 ? 'linear-gradient(135deg, #f59e0b, #ea580c)' :
                                   index === 1 ? 'linear-gradient(135deg, #94a3b8, #64748b)' :
                                   index === 2 ? 'linear-gradient(135deg, #cd7f32, #a0522d)' :
                                   'linear-gradient(135deg, #6366f1, #4f46e5)',
                        color: 'white'
                      }}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.sales} units sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-emerald-600">₹{product.revenue.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <div className="group relative" style={{ perspective: '1000px' }}>
        <div className="absolute -inset-[1px] rounded-xl opacity-0 group-hover:opacity-100 blur-[1px] transition-all duration-300 bg-gradient-to-r from-blue-500/30 to-indigo-500/30" />
        
        <Card className="relative overflow-hidden rounded-xl border border-border/40 hover:border-border/60 transition-all duration-300 group-hover:shadow-xl">
          <CardHeader className="border-b border-border/40">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <ShoppingCart className="h-4 w-4 text-blue-600" />
              </div>
              <CardTitle className="text-base font-bold">Recent Orders</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-2">
              {stats.recentOrders.map((order) => (
                <div 
                  key={order._id} 
                  className="group/order flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 border border-transparent hover:border-border/40 transition-all duration-300 hover:scale-[1.01]"
                >
                  <div>
                    <p className="font-semibold text-sm">{order.orderNumber}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant={
                        order.status === 'delivered' ? 'default' :
                        order.status === 'pending' ? 'secondary' :
                        order.status === 'cancelled' ? 'destructive' : 'outline'
                      }
                      className="text-[10px] font-bold"
                    >
                      {order.status}
                    </Badge>
                    <p className="font-bold text-sm text-blue-600">₹{order.total.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
