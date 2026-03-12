import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tag, Search, Package, Sparkles, Percent } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  isOnSale?: boolean;
  categoryId?: { name: string };
}

interface SaleManagementProps {
  products: Product[];
  onToggleSale: (id: string, isOnSale: boolean) => Promise<void>;
  onBulkToggleSale: (productIds: string[], isOnSale: boolean) => Promise<void>;
  isLoading?: boolean;
}

export function SaleManagement({
  products,
  onToggleSale,
  onBulkToggleSale,
  isLoading = false
}: SaleManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleAllProducts = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p._id));
    }
  };

  const handleBulkAddToSale = async () => {
    if (selectedProducts.length === 0) return;
    await onBulkToggleSale(selectedProducts, true);
    setSelectedProducts([]);
  };

  const handleBulkRemoveFromSale = async () => {
    if (selectedProducts.length === 0) return;
    await onBulkToggleSale(selectedProducts, false);
    setSelectedProducts([]);
  };

  const onSaleProducts = products.filter(p => p.isOnSale).length;
  const regularProducts = products.filter(p => !p.isOnSale).length;

  const saleStats = [
    { label: "Total Products", value: products.length, color: "#6366f1", gradient: "from-indigo-500 to-violet-600" },
    { label: "On Sale", value: onSaleProducts, color: "#ef4444", gradient: "from-red-500 to-rose-600" },
    { label: "Regular Price", value: regularProducts, color: "#10b981", gradient: "from-emerald-500 to-green-600" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="group" style={{ perspective: '1000px' }}>
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500/10 to-rose-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold px-3 py-1.5 rounded-full mb-2">
            <Sparkles className="w-3 h-3" />
            Promotions Hub
          </div>
          <h2 className="text-2xl font-black bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Sale Management
          </h2>
          <p className="text-muted-foreground text-sm">
            Manage which products appear on the sale page ({onSaleProducts} products on sale)
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {saleStats.map((stat) => (
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

      {/* Search and Bulk Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-9 border-border/50 focus:border-red-500/50 transition-colors"
          />
        </div>

        {selectedProducts.length > 0 && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="h-9 px-3">
              {selectedProducts.length} selected
            </Badge>
            <Button
              variant="outline"
              size="sm"
              className="h-9 border-border/50 hover:border-red-500/50 hover:bg-red-500/5 transition-all"
              onClick={handleBulkAddToSale}
              disabled={isLoading}
            >
              <Tag className="h-3.5 w-3.5 mr-1.5" />
              Add to Sale
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-9 border-border/50 hover:border-border transition-all"
              onClick={handleBulkRemoveFromSale}
              disabled={isLoading}
            >
              Remove from Sale
            </Button>
          </div>
        )}
      </div>

      {/* Products Table Header */}
      <Card className="border-border/40 overflow-hidden">
        <div className="p-4 border-b border-border/40 bg-muted/20">
          <div className="flex items-center gap-4">
            <Checkbox
              checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
              onCheckedChange={toggleAllProducts}
            />
            <span className="font-bold text-xs text-muted-foreground flex-1">Product</span>
            <span className="font-bold text-xs text-muted-foreground w-24">Price</span>
            <span className="font-bold text-xs text-muted-foreground w-32">Status</span>
            <span className="font-bold text-xs text-muted-foreground w-32">Action</span>
          </div>
        </div>

        {/* Products List */}
        <div className="divide-y divide-border/30">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="group flex items-center gap-4 p-3 hover:bg-muted/30 transition-colors"
            >
              <Checkbox
                checked={selectedProducts.includes(product._id)}
                onCheckedChange={() => toggleProductSelection(product._id)}
              />
              
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="relative overflow-hidden rounded-lg shrink-0">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-12 h-12 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 rounded-lg flex items-center justify-center">
                      <Package className="h-6 w-6 text-indigo-600" />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-sm truncate">{product.name}</h4>
                  {product.categoryId && (
                    <p className="text-xs text-muted-foreground">
                      {product.categoryId.name}
                    </p>
                  )}
                </div>
              </div>

              <div className="w-24">
                <span className="font-bold text-sm">₹{product.price.toFixed(2)}</span>
              </div>

              <div className="w-32">
                {product.isOnSale ? (
                  <Badge className="bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/20 text-[10px] font-bold h-6">
                    <Percent className="h-3 w-3 mr-1" />
                    On Sale
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-[10px] font-bold h-6">
                    Regular
                  </Badge>
                )}
              </div>

              <div className="w-32">
                <Button
                  size="sm"
                  className={`h-8 text-xs font-bold ${product.isOnSale 
                    ? 'border-border/50 hover:border-red-500/50 hover:bg-red-500/5 hover:text-red-600' 
                    : 'bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white border-0'}`}
                  variant={product.isOnSale ? "outline" : "default"}
                  onClick={() => onToggleSale(product._id, !product.isOnSale)}
                  disabled={isLoading}
                >
                  {product.isOnSale ? "Remove" : "Add to Sale"}
                </Button>
              </div>
            </div>
          ))}

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <div className="p-4 rounded-full bg-muted/50 w-fit mx-auto mb-4">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-bold mb-2">No Products Found</h3>
              <p className="text-sm text-muted-foreground">
                {searchTerm ? "Try a different search term" : "No products available"}
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
