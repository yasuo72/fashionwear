import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Megaphone } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import type { Banner } from "@/hooks/useBanners";

interface BannerManagementProps {
  banners: Banner[];
  onCreateBanner: (data: Partial<Banner>) => Promise<void>;
  onUpdateBanner: (data: { id: string; data: Partial<Banner> }) => Promise<void>;
  onDeleteBanner: (id: string) => Promise<void>;
  isLoading?: boolean;
}

export function BannerManagement({
  banners,
  onCreateBanner,
  onUpdateBanner,
  onDeleteBanner,
  isLoading = false
}: BannerManagementProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  
  const [bannerForm, setBannerForm] = useState({
    text: "",
    type: "badge" as 'badge' | 'announcement' | 'promo',
    location: "hero" as 'hero' | 'navbar' | 'footer' | 'category' | 'brands',
    imageUrl: "",
    isActive: true,
  });

  const resetForm = () => {
    setBannerForm({
      text: "",
      type: "badge",
      location: "hero",
      imageUrl: "",
      isActive: true,
    });
    setEditingBanner(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingBanner) {
        await onUpdateBanner({ id: editingBanner._id, data: bannerForm });
      } else {
        await onCreateBanner(bannerForm);
      }
      
      setShowDialog(false);
      resetForm();
    } catch (error) {
      // Error handling is done in parent component
    }
  };

  const openEditBanner = (banner: Banner) => {
    setEditingBanner(banner);
    setBannerForm({
      text: banner.text,
      type: banner.type,
      location: banner.location,
      imageUrl: banner.imageUrl || "",
      isActive: banner.isActive,
    });
    setShowDialog(true);
  };

  const handleDeleteBanner = async (bannerId: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    
    try {
      await onDeleteBanner(bannerId);
    } catch (error) {
      // Error handling is done in parent component
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Banner Management</h2>
          <p className="text-muted-foreground">Manage promotional badges and announcements</p>
        </div>
        
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingBanner ? "Edit Banner" : "Add New Banner"}
              </DialogTitle>
              <DialogDescription>
                {editingBanner ? "Update banner text and settings." : "Create a new banner for your site."}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="text">Banner Text</Label>
                <Input
                  id="text"
                  value={bannerForm.text}
                  onChange={(e) => setBannerForm({ ...bannerForm, text: e.target.value })}
                  placeholder="e.g., New Collection 2024, Spring Sale"
                  maxLength={255}
                />
              </div>
              
              <div>
                <Label htmlFor="type">Type</Label>
                <Select
                  value={bannerForm.type}
                  onValueChange={(value: any) => setBannerForm({ ...bannerForm, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="badge">Badge</SelectItem>
                    <SelectItem value="announcement">Announcement</SelectItem>
                    <SelectItem value="promo">Promo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="location">Location</Label>
                <Select
                  value={bannerForm.location}
                  onValueChange={(value: any) => setBannerForm({ ...bannerForm, location: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hero">Hero Section</SelectItem>
                    <SelectItem value="navbar">Navbar</SelectItem>
                    <SelectItem value="footer">Footer</SelectItem>
                    <SelectItem value="category">Category Page</SelectItem>
                    <SelectItem value="brands">Brands Row (below Hero)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="imageUrl">Image URL (optional)</Label>
                <Input
                  id="imageUrl"
                  value={bannerForm.imageUrl}
                  onChange={(e) => setBannerForm({ ...bannerForm, imageUrl: e.target.value })}
                  placeholder="https://example.com/hero-model-or-brand-logo.jpg"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="isActive">Active</Label>
                <Switch
                  id="isActive"
                  checked={bannerForm.isActive}
                  onCheckedChange={(checked) => setBannerForm({ ...bannerForm, isActive: checked })}
                />
              </div>
              
              <Button onClick={handleSubmit} className="w-full">
                {editingBanner ? "Update Banner" : "Create Banner"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {banners.map((banner) => (
          <Card key={banner._id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <Megaphone className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg">{banner.text}</h3>
                </div>
                
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline">{banner.type}</Badge>
                  <Badge variant="outline">{banner.location}</Badge>
                  <Badge variant={banner.isActive ? "default" : "secondary"}>
                    {banner.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                
                {banner.imageUrl && (
                  <div className="mt-2 flex items-center gap-3">
                    <img 
                      src={banner.imageUrl} 
                      alt={banner.text} 
                      className="h-10 w-20 object-contain rounded border border-border bg-muted"
                    />
                    <span className="text-xs text-muted-foreground break-all">{banner.imageUrl}</span>
                  </div>
                )}

                <p className="text-sm text-muted-foreground">
                  Created: {new Date(banner.createdAt).toLocaleDateString()}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openEditBanner(banner)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteBanner(banner._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {banners.length === 0 && (
          <Card className="p-12 text-center">
            <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Banners Yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first banner to display promotional messages on your site
            </p>
            <Button onClick={() => setShowDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Banner
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
