import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Search, FolderTree, Sparkles, Layers } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CategoryManagementProps {
  categories: any[];
  onCreateCategory: (data: any) => Promise<void>;
  onUpdateCategory: (data: any) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
  isLoading?: boolean;
}

export function CategoryManagement({
  categories,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
  isLoading = false
}: CategoryManagementProps) {
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    slug: "",
    image: "",
    isActive: true,
  });

  const resetForm = () => {
    setCategoryForm({
      name: "",
      description: "",
      slug: "",
      image: "",
      isActive: true,
    });
    setEditingCategory(null);
  };

  const handleSubmit = async () => {
    try {
      const formData = {
        ...categoryForm,
        slug: categoryForm.slug || categoryForm.name.toLowerCase().replace(/\s+/g, '-'),
      };

      if (editingCategory) {
        await onUpdateCategory({ _id: editingCategory._id, ...formData });
      } else {
        await onCreateCategory(formData);
      }
      
      setShowCategoryDialog(false);
      resetForm();
    } catch (error) {
      // Error handling is done in parent component
    }
  };

  const openEditCategory = (category: any) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description || "",
      slug: category.slug,
      image: category.image || "",
      isActive: category.isActive,
    });
    setShowCategoryDialog(true);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm("Are you sure you want to delete this category? This action cannot be undone.")) return;
    
    try {
      await onDeleteCategory(categoryId);
    } catch (error) {
      // Error handling is done in parent component
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categoryStats = [
    { label: "Total Categories", value: categories.length, color: "#6366f1", gradient: "from-indigo-500 to-violet-600" },
    { label: "Active", value: categories.filter(c => c.isActive).length, color: "#10b981", gradient: "from-emerald-500 to-green-600" },
    { label: "Inactive", value: categories.filter(c => !c.isActive).length, color: "#64748b", gradient: "from-slate-500 to-gray-600" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="group" style={{ perspective: '1000px' }}>
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold px-3 py-1.5 rounded-full mb-2">
            <Sparkles className="w-3 h-3" />
            Organization Hub
          </div>
          <h2 className="text-2xl font-black bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Category Management
          </h2>
          <p className="text-muted-foreground text-sm">Organize your products into categories</p>
        </div>
        
        <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
          <DialogTrigger asChild>
            <Button 
              onClick={resetForm}
              className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white border-0 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all duration-300"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg font-bold">
                <Layers className="h-5 w-5 text-indigo-600" />
                {editingCategory ? "Edit Category" : "Add New Category"}
              </DialogTitle>
              <DialogDescription className="text-sm">
                {editingCategory ? "Update category information and settings." : "Create a new category to organize your products."}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-xs font-medium">Category Name</Label>
                <Input
                  id="name"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="Enter category name"
                  className="h-9 text-sm border-border/50 focus:border-indigo-500/50 transition-colors"
                />
              </div>
              
              <div>
                <Label htmlFor="slug" className="text-xs font-medium">Slug (URL-friendly name)</Label>
                <Input
                  id="slug"
                  value={categoryForm.slug}
                  onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                  placeholder="category-slug (auto-generated if empty)"
                  className="h-9 text-sm border-border/50 focus:border-indigo-500/50 transition-colors"
                />
              </div>
              
              <div>
                <Label htmlFor="description" className="text-xs font-medium">Description</Label>
                <Textarea
                  id="description"
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  placeholder="Enter category description"
                  rows={3}
                  className="text-sm border-border/50 focus:border-indigo-500/50 transition-colors"
                />
              </div>
              
              <div>
                <Label htmlFor="image" className="text-xs font-medium">Image URL</Label>
                <Input
                  id="image"
                  value={categoryForm.image}
                  onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                  placeholder="https://example.com/category-image.jpg"
                  className="h-9 text-sm border-border/50 focus:border-indigo-500/50 transition-colors"
                />
              </div>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={categoryForm.isActive}
                  onChange={(e) => setCategoryForm({ ...categoryForm, isActive: e.target.checked })}
                  className="w-4 h-4 rounded border-border/50 text-indigo-600 focus:ring-indigo-500"
                />
                <Label htmlFor="isActive" className="text-xs font-medium cursor-pointer">Active Category</Label>
              </label>
            </div>
            
            <div className="flex gap-2 pt-4 border-t border-border/40">
              <Button 
                onClick={handleSubmit} 
                disabled={isLoading}
                className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white border-0"
              >
                {isLoading ? "Saving..." : editingCategory ? "Update Category" : "Create Category"}
              </Button>
              <Button variant="outline" onClick={() => setShowCategoryDialog(false)} className="border-border/50 hover:border-border transition-colors">
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {categoryStats.map((stat) => (
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
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-9 border-border/50 focus:border-indigo-500/50 transition-colors"
          />
        </div>
        <Badge variant="secondary" className="h-9 px-3">{filteredCategories.length} categories</Badge>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.map((category) => (
          <div 
            key={category._id}
            className="group relative"
            style={{ perspective: '1000px' }}
          >
            <div 
              className="absolute -inset-[1px] rounded-xl opacity-0 group-hover:opacity-100 blur-[1px] transition-all duration-300 bg-gradient-to-r from-indigo-500/20 to-violet-500/20"
            />
            <Card className="relative overflow-hidden rounded-xl border border-border/40 hover:border-border/60 transition-all duration-300 group-hover:shadow-lg group-hover:scale-[1.02] transform-gpu h-full flex flex-col">
              <CardContent className="p-4 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="relative overflow-hidden rounded-lg shrink-0">
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-12 h-12 object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 rounded-lg flex items-center justify-center">
                          <FolderTree className="h-6 w-6 text-indigo-600" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm">{category.name}</h3>
                      <p className="text-xs text-muted-foreground">/{category.slug}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-1 shrink-0">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="h-7 w-7 p-0 border-border/50 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all"
                      onClick={() => openEditCategory(category)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="h-7 w-7 p-0 border-border/50 hover:border-red-500/50 hover:bg-red-500/5 transition-all"
                      onClick={() => handleDeleteCategory(category._id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                {category.description && (
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2 flex-1">
                    {category.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between pt-2 border-t border-border/30">
                  <Badge 
                    variant={category.isActive ? "default" : "secondary"}
                    className={`text-[10px] font-bold h-5 ${category.isActive ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : ''}`}
                  >
                    {category.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(category.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCategories.length === 0 && (
        <Card className="border-dashed border-border/40">
          <CardContent className="p-12 text-center">
            <div className="p-4 rounded-full bg-muted/50 w-fit mx-auto mb-4">
              <FolderTree className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold mb-2">No categories found</h3>
            <p className="text-sm text-muted-foreground">
              {searchTerm 
                ? "Try adjusting your search terms" 
                : "Create your first category to organize products"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
