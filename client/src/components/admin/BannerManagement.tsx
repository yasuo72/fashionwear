import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Megaphone, Sparkles, Image } from "lucide-react";
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

  const bannerStats = [
    { label: "Total Banners", value: banners.length, color: "#6366f1", gradient: "from-indigo-500 to-violet-600" },
    { label: "Active", value: banners.filter(b => b.isActive).length, color: "#10b981", gradient: "from-emerald-500 to-green-600" },
    { label: "Hero Section", value: banners.filter(b => b.location === 'hero').length, color: "#f59e0b", gradient: "from-amber-500 to-orange-600" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="group" style={{ perspective: '1000px' }}>
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold px-3 py-1.5 rounded-full mb-2">
            <Sparkles className="w-3 h-3" />
            Marketing Hub
          </div>
          <h2 className="text-2xl font-black bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Banner Management
          </h2>
          <p className="text-muted-foreground text-sm">Manage promotional badges and announcements</p>
        </div>
        
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button 
              onClick={resetForm}
              className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white border-0 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all duration-300"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg font-bold">
                <Megaphone className="h-5 w-5 text-indigo-600" />
                {editingBanner ? "Edit Banner" : "Add New Banner"}
              </DialogTitle>
              <DialogDescription className="text-sm">
                {editingBanner ? "Update banner text and settings." : "Create a new banner for your site."}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="text" className="text-xs font-medium">Banner Text</Label>
                <Input
                  id="text"
                  value={bannerForm.text}
                  onChange={(e) => setBannerForm({ ...bannerForm, text: e.target.value })}
                  placeholder="e.g., New Collection 2024, Spring Sale"
                  maxLength={255}
                  className="h-9 text-sm border-border/50 focus:border-indigo-500/50 transition-colors"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="type" className="text-xs font-medium">Type</Label>
                  <Select
                    value={bannerForm.type}
                    onValueChange={(value: any) => setBannerForm({ ...bannerForm, type: value })}
                  >
                    <SelectTrigger className="h-9 text-sm border-border/50 hover:border-indigo-500/50 transition-colors">
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
                  <Label htmlFor="location" className="text-xs font-medium">Location</Label>
                  <Select
                    value={bannerForm.location}
                    onValueChange={(value: any) => setBannerForm({ ...bannerForm, location: value })}
                  >
                    <SelectTrigger className="h-9 text-sm border-border/50 hover:border-indigo-500/50 transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hero">Hero Section</SelectItem>
                      <SelectItem value="navbar">Navbar</SelectItem>
                      <SelectItem value="footer">Footer</SelectItem>
                      <SelectItem value="category">Category Page</SelectItem>
                      <SelectItem value="brands">Brands Row</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="imageUrl" className="text-xs font-medium flex items-center gap-1">
                  <Image className="h-3 w-3" />
                  Image URL (optional)
                </Label>
                <Input
                  id="imageUrl"
                  value={bannerForm.imageUrl}
                  onChange={(e) => setBannerForm({ ...bannerForm, imageUrl: e.target.value })}
                  placeholder="https://example.com/hero-model-or-brand-logo.jpg"
                  className="h-9 text-sm border-border/50 focus:border-indigo-500/50 transition-colors"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/30">
                <Label htmlFor="isActive" className="text-xs font-medium cursor-pointer">Active Status</Label>
                <Switch
                  id="isActive"
                  checked={bannerForm.isActive}
                  onCheckedChange={(checked) => setBannerForm({ ...bannerForm, isActive: checked })}
                />
              </div>
              
              <Button 
                onClick={handleSubmit} 
                className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white border-0"
              >
                {editingBanner ? "Update Banner" : "Create Banner"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {bannerStats.map((stat) => (
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

      {/* Banners List */}
      <div className="grid gap-3">
        {banners.map((banner) => (
          <div 
            key={banner._id}
            className="group relative"
            style={{ perspective: '1000px' }}
          >
            <div 
              className="absolute -inset-[1px] rounded-xl opacity-0 group-hover:opacity-100 blur-[1px] transition-all duration-300 bg-gradient-to-r from-indigo-500/20 to-violet-500/20"
            />
            <Card className="relative overflow-hidden rounded-xl border border-border/40 hover:border-border/60 transition-all duration-300 group-hover:shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="p-2.5 rounded-lg bg-gradient-to-br from-indigo-500/10 to-violet-500/10 shrink-0">
                      <Megaphone className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="space-y-2 flex-1 min-w-0">
                      <h3 className="font-bold text-sm truncate">{banner.text}</h3>
                      
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Badge variant="outline" className="text-[10px] font-bold h-5">{banner.type}</Badge>
                        <Badge variant="outline" className="text-[10px] font-bold h-5">{banner.location}</Badge>
                        <Badge 
                          variant={banner.isActive ? "default" : "secondary"}
                          className={`text-[10px] font-bold h-5 ${banner.isActive ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : ''}`}
                        >
                          {banner.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      
                      {banner.imageUrl && (
                        <div className="flex items-center gap-2">
                          <img 
                            src={banner.imageUrl} 
                            alt={banner.text} 
                            className="h-8 w-16 object-contain rounded border border-border/50 bg-muted/30"
                          />
                          <span className="text-xs text-muted-foreground truncate max-w-[200px]">{banner.imageUrl}</span>
                        </div>
                      )}

                      <p className="text-xs text-muted-foreground">
                        Created: {new Date(banner.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 border-border/50 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all"
                      onClick={() => openEditBanner(banner)}
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 border-border/50 hover:border-red-500/50 hover:bg-red-500/5 transition-all"
                      onClick={() => handleDeleteBanner(banner._id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}

        {banners.length === 0 && (
          <Card className="border-dashed border-border/40">
            <CardContent className="p-12 text-center">
              <div className="p-4 rounded-full bg-muted/50 w-fit mx-auto mb-4">
                <Megaphone className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-bold mb-2">No Banners Yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first banner to display promotional messages on your site
              </p>
              <Button 
                onClick={() => setShowDialog(true)}
                className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white border-0"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Banner
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
