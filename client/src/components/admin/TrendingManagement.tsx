import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { TrendingUp, Search, Package, Flame } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  isTrending?: boolean;
  categoryId?: { name: string };
}

interface TrendingManagementProps {
  products: Product[];
  onToggleTrending: (id: string, isTrending: boolean) => Promise<void>;
  onBulkToggleTrending: (productIds: string[], isTrending: boolean) => Promise<void>;
  isLoading?: boolean;
}

export function TrendingManagement({
  products,
  onToggleTrending,
  onBulkToggleTrending,
  isLoading = false
}: TrendingManagementProps) {
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

  const handleBulkAddToTrending = async () => {
    if (selectedProducts.length === 0) return;
    await onBulkToggleTrending(selectedProducts, true);
    setSelectedProducts([]);
  };

  const handleBulkRemoveFromTrending = async () => {
    if (selectedProducts.length === 0) return;
    await onBulkToggleTrending(selectedProducts, false);
    setSelectedProducts([]);
  };

  const trendingProducts = products.filter(p => p.isTrending).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Trending Products</h2>
          <p className="text-muted-foreground">
            Manage which products appear in the trending section ({trendingProducts} products trending)
          </p>
        </div>
      </div>

      {/* Search and Bulk Actions */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {selectedProducts.length > 0 && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {selectedProducts.length} selected
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkAddToTrending}
              disabled={isLoading}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Mark as Trending
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkRemoveFromTrending}
              disabled={isLoading}
            >
              Remove from Trending
            </Button>
          </div>
        )}
      </div>

      {/* Products Table Header */}
      <Card className="p-4">
        <div className="flex items-center gap-4 mb-4 pb-4 border-b">
          <Checkbox
            checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
            onCheckedChange={toggleAllProducts}
          />
          <span className="font-semibold flex-1">Product</span>
          <span className="font-semibold w-24">Price</span>
          <span className="font-semibold w-32">Status</span>
          <span className="font-semibold w-32">Action</span>
        </div>

        {/* Products List */}
        <div className="space-y-2">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors"
            >
              <Checkbox
                checked={selectedProducts.includes(product._id)}
                onCheckedChange={() => toggleProductSelection(product._id)}
              />
              
              <div className="flex items-center gap-3 flex-1">
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : (
                  <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                    <Package className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <div>
                  <h4 className="font-medium">{product.name}</h4>
                  {product.categoryId && (
                    <p className="text-sm text-muted-foreground">
                      {product.categoryId.name}
                    </p>
                  )}
                </div>
              </div>

              <div className="w-24">
                <span className="font-semibold">₹{product.price.toFixed(2)}</span>
              </div>

              <div className="w-32">
                {product.isTrending ? (
                  <Badge className="bg-orange-500 hover:bg-orange-600">
                    <Flame className="h-3 w-3 mr-1" />
                    Trending
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    Regular
                  </Badge>
                )}
              </div>

              <div className="w-32">
                <Button
                  size="sm"
                  variant={product.isTrending ? "outline" : "default"}
                  onClick={() => onToggleTrending(product._id, !product.isTrending)}
                  disabled={isLoading}
                >
                  {product.isTrending ? "Remove" : "Mark Trending"}
                </Button>
              </div>
            </div>
          ))}

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Products Found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? "Try a different search term" : "No products available"}
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
