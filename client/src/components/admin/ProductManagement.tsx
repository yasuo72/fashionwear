import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Search, Eye, Sparkles, Package, Tag, Image, Layers } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ProductManagementProps {
  products: any[];
  categories: any[];
  onCreateProduct: (data: any) => Promise<void>;
  onUpdateProduct: (data: any) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
  isLoading?: boolean;
}

export function ProductManagement({
  products,
  categories,
  onCreateProduct,
  onUpdateProduct,
  onDeleteProduct,
  isLoading = false
}: ProductManagementProps) {
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
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

  const resetForm = () => {
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
    setEditingProduct(null);
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!productForm.name || !productForm.description || !productForm.price || !productForm.categoryId) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields: name, description, price, and category.",
          variant: "destructive"
        });
        return;
      }

      if (productForm.images.filter(img => img.trim() !== '').length === 0) {
        toast({
          title: "Validation Error",
          description: "Please add at least one product image.",
          variant: "destructive"
        });
        return;
      }

      if (productForm.variants.length === 0 || !productForm.variants[0].size || !productForm.variants[0].color) {
        toast({
          title: "Validation Error",
          description: "Please add at least one product variant with size and color.",
          variant: "destructive"
        });
        return;
      }

      const formData = {
        ...productForm,
        slug: productForm.slug || productForm.name.toLowerCase().replace(/\s+/g, '-'),
        tags: productForm.tags.filter(tag => tag.trim() !== ''),
        images: productForm.images.filter(img => img.trim() !== ''),
        variants: productForm.variants.filter(variant => variant.size && variant.color),
        price: Number(productForm.price),
        originalPrice: Number(productForm.originalPrice) > 0 ? Number(productForm.originalPrice) : undefined,
        discount: Number(productForm.discount) > 0 ? Number(productForm.discount) : undefined,
      };

      console.log("Submitting product data:", formData);

      if (editingProduct) {
        await onUpdateProduct({ _id: editingProduct._id, ...formData });
      } else {
        await onCreateProduct(formData);
      }
      
      setShowProductDialog(false);
      resetForm();
    } catch (error) {
      console.error("Product submission error:", error);
      // Error handling is done in parent component
    }
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
      images: product.images || [""],
      categoryId: product.categoryId,
      variants: product.variants || [{ size: "", color: "", stock: 0 }],
      brand: product.brand,
      tags: product.tags || [""],
      isFeatured: product.isFeatured,
      isActive: product.isActive,
    });
    setShowProductDialog(true);
  };

  const addVariant = () => {
    setProductForm({
      ...productForm,
      variants: [...productForm.variants, { size: "", color: "", stock: 0 }]
    });
  };

  const removeVariant = (index: number) => {
    setProductForm({
      ...productForm,
      variants: productForm.variants.filter((_, i) => i !== index)
    });
  };

  const updateVariant = (index: number, field: string, value: any) => {
    const newVariants = [...productForm.variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setProductForm({ ...productForm, variants: newVariants });
  };

  const addImage = () => {
    setProductForm({
      ...productForm,
      images: [...productForm.images, ""]
    });
  };

  const removeImage = (index: number) => {
    setProductForm({
      ...productForm,
      images: productForm.images.filter((_, i) => i !== index)
    });
  };

  const updateImage = (index: number, value: string) => {
    const newImages = [...productForm.images];
    newImages[index] = value;
    setProductForm({ ...productForm, images: newImages });
  };

  const addTag = () => {
    setProductForm({
      ...productForm,
      tags: [...productForm.tags, ""]
    });
  };

  const removeTag = (index: number) => {
    setProductForm({
      ...productForm,
      tags: productForm.tags.filter((_, i) => i !== index)
    });
  };

  const updateTag = (index: number, value: string) => {
    const newTags = [...productForm.tags];
    newTags[index] = value;
    setProductForm({ ...productForm, tags: newTags });
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const productStats = [
    { label: "Total Products", value: products.length, color: "#6366f1", gradient: "from-indigo-500 to-violet-600" },
    { label: "Active", value: products.filter(p => p.isActive).length, color: "#10b981", gradient: "from-emerald-500 to-green-600" },
    { label: "Featured", value: products.filter(p => p.isFeatured).length, color: "#f59e0b", gradient: "from-amber-500 to-orange-600" },
    { label: "On Sale", value: products.filter(p => p.discount > 0).length, color: "#ef4444", gradient: "from-red-500 to-rose-600" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="group" style={{ perspective: '1000px' }}>
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold px-3 py-1.5 rounded-full mb-2">
            <Sparkles className="w-3 h-3" />
            Inventory Control
          </div>
          <h2 className="text-2xl font-black bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Product Management
          </h2>
          <p className="text-muted-foreground text-sm">Manage your product inventory</p>
        </div>
        
        <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
          <DialogTrigger asChild>
            <Button 
              onClick={resetForm}
              className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white border-0 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all duration-300"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg font-bold">
                <Package className="h-5 w-5 text-indigo-600" />
                {editingProduct ? "Edit Product" : "Add New Product"}
              </DialogTitle>
              <DialogDescription className="text-sm">
                {editingProduct ? "Update product information and inventory details." : "Create a new product with images, pricing, and variants."}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-xs font-medium">Product Name</Label>
                  <Input
                    id="name"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="Enter product name"
                    className="h-9 text-sm border-border/50 focus:border-indigo-500/50 transition-colors"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description" className="text-xs font-medium">Description</Label>
                  <Textarea
                    id="description"
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    placeholder="Enter product description"
                    rows={3}
                    className="text-sm border-border/50 focus:border-indigo-500/50 transition-colors"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="price" className="text-xs font-medium">Price (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={productForm.price || ''}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value === '' ? 0 : parseFloat(e.target.value) })}
                      placeholder="0.00"
                      className="h-9 text-sm border-border/50 focus:border-indigo-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <Label htmlFor="originalPrice" className="text-xs font-medium">Original Price (₹)</Label>
                    <Input
                      id="originalPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      value={productForm.originalPrice || ''}
                      onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value === '' ? 0 : parseFloat(e.target.value) })}
                      placeholder="0.00"
                      className="h-9 text-sm border-border/50 focus:border-indigo-500/50 transition-colors"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="discount" className="text-xs font-medium">Discount (%)</Label>
                    <Input
                      id="discount"
                      type="number"
                      min="0"
                      max="100"
                      value={productForm.discount || ''}
                      onChange={(e) => setProductForm({ ...productForm, discount: e.target.value === '' ? 0 : parseInt(e.target.value) })}
                      placeholder="0"
                      className="h-9 text-sm border-border/50 focus:border-indigo-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <Label htmlFor="brand" className="text-xs font-medium">Brand</Label>
                    <Input
                      id="brand"
                      value={productForm.brand}
                      onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                      placeholder="Enter brand name"
                      className="h-9 text-sm border-border/50 focus:border-indigo-500/50 transition-colors"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="category" className="text-xs font-medium">Category</Label>
                  <Select
                    value={productForm.categoryId}
                    onValueChange={(value) => setProductForm({ ...productForm, categoryId: value })}
                  >
                    <SelectTrigger className="h-9 text-sm border-border/50 hover:border-indigo-500/50 transition-colors">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-xs font-medium flex items-center gap-1">
                    <Image className="h-3 w-3" />
                    Product Images
                  </Label>
                  {productForm.images.map((image, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        value={image}
                        onChange={(e) => updateImage(index, e.target.value)}
                        placeholder="Enter image URL"
                        className="h-8 text-xs border-border/50 focus:border-indigo-500/50 transition-colors"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 border-border/50 hover:border-red-500/50 hover:bg-red-500/5 transition-all"
                        onClick={() => removeImage(index)}
                        disabled={productForm.images.length === 1}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" className="h-8 text-xs border-border/50 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all" onClick={addImage}>
                    <Plus className="h-3 w-3 mr-1" />
                    Add Image
                  </Button>
                </div>
                
                <div>
                  <Label className="text-xs font-medium flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    Product Tags
                  </Label>
                  {productForm.tags.map((tag, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        value={tag}
                        onChange={(e) => updateTag(index, e.target.value)}
                        placeholder="Enter tag"
                        className="h-8 text-xs border-border/50 focus:border-indigo-500/50 transition-colors"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 border-border/50 hover:border-red-500/50 hover:bg-red-500/5 transition-all"
                        onClick={() => removeTag(index)}
                        disabled={productForm.tags.length === 1}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" className="h-8 text-xs border-border/50 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all" onClick={addTag}>
                    <Plus className="h-3 w-3 mr-1" />
                    Add Tag
                  </Button>
                </div>
                
                <div>
                  <Label className="text-xs font-medium flex items-center gap-1">
                    <Layers className="h-3 w-3" />
                    Product Variants
                  </Label>
                  {productForm.variants.map((variant, index) => (
                    <div key={index} className="grid grid-cols-4 gap-2 mb-2">
                      <Input
                        value={variant.size}
                        onChange={(e) => updateVariant(index, 'size', e.target.value)}
                        placeholder="Size"
                        className="h-8 text-xs border-border/50 focus:border-indigo-500/50 transition-colors"
                      />
                      <Input
                        value={variant.color}
                        onChange={(e) => updateVariant(index, 'color', e.target.value)}
                        placeholder="Color"
                        className="h-8 text-xs border-border/50 focus:border-indigo-500/50 transition-colors"
                      />
                      <Input
                        type="number"
                        min="0"
                        value={variant.stock || ''}
                        onChange={(e) => updateVariant(index, 'stock', e.target.value === '' ? 0 : parseInt(e.target.value))}
                        placeholder="Stock"
                        className="h-8 text-xs border-border/50 focus:border-indigo-500/50 transition-colors"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 border-border/50 hover:border-red-500/50 hover:bg-red-500/5 transition-all"
                        onClick={() => removeVariant(index)}
                        disabled={productForm.variants.length === 1}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" className="h-8 text-xs border-border/50 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all" onClick={addVariant}>
                    <Plus className="h-3 w-3 mr-1" />
                    Add Variant
                  </Button>
                </div>
                
                <div className="flex items-center gap-4 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      checked={productForm.isFeatured}
                      onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                      className="w-4 h-4 rounded border-border/50 text-indigo-600 focus:ring-indigo-500"
                    />
                    <Label htmlFor="isFeatured" className="text-xs font-medium cursor-pointer">Featured Product</Label>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={productForm.isActive}
                      onChange={(e) => setProductForm({ ...productForm, isActive: e.target.checked })}
                      className="w-4 h-4 rounded border-border/50 text-indigo-600 focus:ring-indigo-500"
                    />
                    <Label htmlFor="isActive" className="text-xs font-medium cursor-pointer">Active</Label>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 pt-4 border-t border-border/40">
              <Button 
                onClick={handleSubmit} 
                disabled={isLoading}
                className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white border-0"
              >
                {isLoading ? "Saving..." : editingProduct ? "Update Product" : "Create Product"}
              </Button>
              <Button variant="outline" onClick={() => setShowProductDialog(false)} className="border-border/50 hover:border-border transition-colors">
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {productStats.map((stat) => (
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

      {/* Search */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-9 border-border/50 focus:border-indigo-500/50 transition-colors"
          />
        </div>
        <Badge variant="secondary" className="h-9 px-3">{filteredProducts.length} products</Badge>
      </div>

      {/* Products List */}
      <div className="grid gap-3">
        {filteredProducts.map((product) => (
          <div 
            key={product._id}
            className="group relative"
            style={{ perspective: '1000px' }}
          >
            <div 
              className="absolute -inset-[1px] rounded-xl opacity-0 group-hover:opacity-100 blur-[1px] transition-all duration-300 bg-gradient-to-r from-indigo-500/20 to-violet-500/20"
            />
            <Card className="relative overflow-hidden rounded-xl border border-border/40 hover:border-border/60 transition-all duration-300 group-hover:shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="relative overflow-hidden rounded-lg shrink-0">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-14 h-14 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm truncate">{product.name}</h3>
                    <p className="text-xs text-muted-foreground">{product.brand}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-bold text-sm text-indigo-600">₹{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-muted-foreground line-through">
                          ₹{product.originalPrice}
                        </span>
                      )}
                      {product.discount && (
                        <Badge variant="destructive" className="text-[10px] font-bold h-5">{product.discount}% OFF</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={product.isActive ? "default" : "secondary"}
                      className={`text-[10px] font-bold h-5 ${product.isActive ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : ''}`}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </Badge>
                    {product.isFeatured && (
                      <Badge variant="outline" className="text-[10px] font-bold h-5 border-amber-500/30 text-amber-600">Featured</Badge>
                    )}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="h-8 w-8 p-0 border-border/50 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="h-8 w-8 p-0 border-border/50 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all"
                      onClick={() => openEditProduct(product)}
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="h-8 w-8 p-0 border-border/50 hover:border-red-500/50 hover:bg-red-500/5 transition-all"
                      onClick={() => onDeleteProduct(product._id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
        
        {filteredProducts.length === 0 && (
          <Card className="border-dashed border-border/40">
            <CardContent className="p-12 text-center">
              <div className="p-4 rounded-full bg-muted/50 w-fit mx-auto mb-4">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-bold mb-2">No products found</h3>
              <p className="text-sm text-muted-foreground">
                {searchTerm ? "Try adjusting your search" : "Add your first product to get started"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
