import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Search, Eye } from "lucide-react";
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Product Management</h2>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>
        
        <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Edit Product" : "Add New Product"}
              </DialogTitle>
              <DialogDescription>
                {editingProduct ? "Update product information and inventory details." : "Create a new product with images, pricing, and variants."}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="Enter product name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    placeholder="Enter product description"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="originalPrice">Original Price (₹)</Label>
                    <Input
                      id="originalPrice"
                      type="number"
                      value={productForm.originalPrice}
                      onChange={(e) => setProductForm({ ...productForm, originalPrice: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="discount">Discount (%)</Label>
                    <Input
                      id="discount"
                      type="number"
                      value={productForm.discount}
                      onChange={(e) => setProductForm({ ...productForm, discount: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="brand">Brand</Label>
                    <Input
                      id="brand"
                      value={productForm.brand}
                      onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                      placeholder="Enter brand name"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={productForm.categoryId}
                    onValueChange={(value) => setProductForm({ ...productForm, categoryId: value })}
                  >
                    <SelectTrigger>
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
                  <Label>Product Images</Label>
                  {productForm.images.map((image, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        value={image}
                        onChange={(e) => updateImage(index, e.target.value)}
                        placeholder="Enter image URL"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeImage(index)}
                        disabled={productForm.images.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={addImage}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Image
                  </Button>
                </div>
                
                <div>
                  <Label>Product Tags</Label>
                  {productForm.tags.map((tag, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <Input
                        value={tag}
                        onChange={(e) => updateTag(index, e.target.value)}
                        placeholder="Enter tag"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeTag(index)}
                        disabled={productForm.tags.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={addTag}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Tag
                  </Button>
                </div>
                
                <div>
                  <Label>Product Variants</Label>
                  {productForm.variants.map((variant, index) => (
                    <div key={index} className="grid grid-cols-4 gap-2 mb-2">
                      <Input
                        value={variant.size}
                        onChange={(e) => updateVariant(index, 'size', e.target.value)}
                        placeholder="Size"
                      />
                      <Input
                        value={variant.color}
                        onChange={(e) => updateVariant(index, 'color', e.target.value)}
                        placeholder="Color"
                      />
                      <Input
                        type="number"
                        value={variant.stock}
                        onChange={(e) => updateVariant(index, 'stock', parseInt(e.target.value) || 0)}
                        placeholder="Stock"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeVariant(index)}
                        disabled={productForm.variants.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={addVariant}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Variant
                  </Button>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      checked={productForm.isFeatured}
                      onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                    />
                    <Label htmlFor="isFeatured">Featured Product</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={productForm.isActive}
                      onChange={(e) => setProductForm({ ...productForm, isActive: e.target.checked })}
                    />
                    <Label htmlFor="isActive">Active</Label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? "Saving..." : editingProduct ? "Update Product" : "Create Product"}
              </Button>
              <Button variant="outline" onClick={() => setShowProductDialog(false)}>
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Badge variant="secondary">{filteredProducts.length} products</Badge>
      </div>

      <div className="grid gap-4">
        {filteredProducts.map((product) => (
          <Card key={product._id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">₹{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          ₹{product.originalPrice}
                        </span>
                      )}
                      {product.discount && (
                        <Badge variant="destructive">{product.discount}% OFF</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={product.isActive ? "default" : "secondary"}>
                        {product.isActive ? "Active" : "Inactive"}
                      </Badge>
                      {product.isFeatured && (
                        <Badge variant="outline">Featured</Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => openEditProduct(product)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onDeleteProduct(product._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
