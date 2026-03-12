import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Flame, Plus, Trash2, ShoppingBag, Sparkles, Save, Zap, Tag, Percent } from "lucide-react";
import type { SaleConfig, SaleCategory } from "@/hooks/useSaleConfig";

interface SalePageManagementProps {
  config: SaleConfig;
  onUpdateConfig: (data: Partial<SaleConfig>) => Promise<void>;
  isLoading?: boolean;
}

export function SalePageManagement({
  config,
  onUpdateConfig,
  isLoading = false
}: SalePageManagementProps) {
  const [form, setForm] = useState<SaleConfig>(config);

  useEffect(() => {
    setForm(config);
  }, [config]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdateConfig(form);
  };

  const updateField = (field: keyof SaleConfig, value: any) => {
    setForm({ ...form, [field]: value });
  };

  const updateCategory = (index: number, field: keyof SaleCategory, value: any) => {
    const newCategories = [...form.saleCategories];
    newCategories[index] = { ...newCategories[index], [field]: value };
    setForm({ ...form, saleCategories: newCategories });
  };

  const addCategory = () => {
    setForm({
      ...form,
      saleCategories: [
        ...form.saleCategories,
        {
          title: 'New Sale',
          description: 'Special offer',
          discount: '50%',
          badge: 'Limited',
          gradient: 'from-blue-500 to-purple-600',
          icon: 'ShoppingBag',
          isActive: true,
        },
      ],
    });
  };

  const removeCategory = (index: number) => {
    const newCategories = form.saleCategories.filter((_, i) => i !== index);
    setForm({ ...form, saleCategories: newCategories });
  };

  const activeCategories = form.saleCategories.filter(c => c.isActive).length;

  const saleStats = [
    { label: "Categories", value: form.saleCategories.length, color: "#6366f1", gradient: "from-indigo-500 to-violet-600" },
    { label: "Active", value: activeCategories, color: "#ef4444", gradient: "from-red-500 to-rose-600" },
    { label: "Flash Sale", value: form.flashSaleEnabled ? "ON" : "OFF", color: form.flashSaleEnabled ? "#f97316" : "#64748b", gradient: form.flashSaleEnabled ? "from-orange-500 to-amber-600" : "from-slate-500 to-gray-600" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="group" style={{ perspective: '1000px' }}>
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500/10 to-rose-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold px-3 py-1.5 rounded-full mb-2">
            <Sparkles className="w-3 h-3" />
            Promotions Hub
          </div>
          <h2 className="text-2xl font-black bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Sale Page Configuration
          </h2>
          <p className="text-muted-foreground text-sm">Customize your sale page content and appearance</p>
        </div>
        <Button 
          type="submit" 
          disabled={isLoading}
          className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white border-0 shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-all duration-300"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Configuration
        </Button>
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

      {/* Hero Section */}
      <div 
        className="group relative"
        style={{ perspective: '1000px' }}
      >
        <div 
          className="absolute -inset-[1px] rounded-xl opacity-0 group-hover:opacity-100 blur-[1px] transition-all duration-300"
          style={{ background: 'linear-gradient(135deg, #ef444440, #ef444420)' }}
        />
        <Card className="relative overflow-hidden rounded-xl border border-border/40 hover:border-border/60 transition-all duration-300 group-hover:shadow-lg">
          <CardHeader className="pb-3 border-b border-border/30">
            <CardTitle className="flex items-center gap-2 text-base font-bold">
              <div className="p-2 rounded-lg bg-red-500/10">
                <Flame className="h-4 w-4 text-red-600" />
              </div>
              Hero Section
            </CardTitle>
            <CardDescription className="text-xs">Main banner at the top of the sale page</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div>
              <Label htmlFor="heroTitle" className="text-xs font-medium">Hero Title</Label>
              <Input
                id="heroTitle"
                value={form.heroTitle}
                onChange={(e) => updateField('heroTitle', e.target.value)}
                placeholder="MEGA SALE"
                className="h-9 text-sm border-border/50 focus:border-red-500/50 transition-colors"
              />
            </div>
            
            <div>
              <Label htmlFor="heroSubtitle" className="text-xs font-medium">Hero Subtitle</Label>
              <Input
                id="heroSubtitle"
                value={form.heroSubtitle}
                onChange={(e) => updateField('heroSubtitle', e.target.value)}
                placeholder="Up to 70% OFF on Fashion Essentials"
                className="h-9 text-sm border-border/50 focus:border-red-500/50 transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="heroBadgeText" className="text-xs font-medium">Badge Text</Label>
                <Input
                  id="heroBadgeText"
                  value={form.heroBadgeText}
                  onChange={(e) => updateField('heroBadgeText', e.target.value)}
                  placeholder="Limited Time Only"
                  className="h-9 text-sm border-border/50 focus:border-red-500/50 transition-colors"
                />
              </div>
              <div>
                <Label htmlFor="heroGradient" className="text-xs font-medium">Gradient Classes</Label>
                <Input
                  id="heroGradient"
                  value={form.heroGradient}
                  onChange={(e) => updateField('heroGradient', e.target.value)}
                  placeholder="from-red-500 via-pink-500 to-orange-500"
                  className="h-9 text-sm border-border/50 focus:border-red-500/50 transition-colors"
                />
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Tailwind gradient classes (e.g., from-red-500 to-pink-500)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Flash Sale Settings */}
      <div 
        className="group relative"
        style={{ perspective: '1000px' }}
      >
        <div 
          className="absolute -inset-[1px] rounded-xl opacity-0 group-hover:opacity-100 blur-[1px] transition-all duration-300"
          style={{ background: 'linear-gradient(135deg, #f9731640, #f9731620)' }}
        />
        <Card className="relative overflow-hidden rounded-xl border border-border/40 hover:border-border/60 transition-all duration-300 group-hover:shadow-lg">
          <CardHeader className="pb-3 border-b border-border/30">
            <CardTitle className="flex items-center gap-2 text-base font-bold">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Zap className="h-4 w-4 text-orange-600" />
              </div>
              Flash Sale Settings
            </CardTitle>
            <CardDescription className="text-xs">Configure the flash sale section with countdown timer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/30">
              <div className="space-y-0.5">
                <Label htmlFor="flashSaleEnabled" className="text-xs font-medium">Enable Flash Sale Section</Label>
                <p className="text-[10px] text-muted-foreground">
                  Show flash sale section with countdown timer
                </p>
              </div>
              <Switch
                id="flashSaleEnabled"
                checked={form.flashSaleEnabled}
                onCheckedChange={(checked) => updateField('flashSaleEnabled', checked)}
              />
            </div>

            {form.flashSaleEnabled && (
              <>
                <Separator className="bg-border/30" />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="flashSaleTitle" className="text-xs font-medium">Flash Sale Title</Label>
                    <Input
                      id="flashSaleTitle"
                      value={form.flashSaleTitle}
                      onChange={(e) => updateField('flashSaleTitle', e.target.value)}
                      placeholder="⚡ Flash Sale"
                      className="h-9 text-sm border-border/50 focus:border-orange-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <Label htmlFor="flashSaleCountdownHours" className="text-xs font-medium">Countdown Duration (Hours)</Label>
                    <Input
                      id="flashSaleCountdownHours"
                      type="number"
                      value={form.flashSaleCountdownHours}
                      onChange={(e) => updateField('flashSaleCountdownHours', Number(e.target.value))}
                      min="1"
                      max="168"
                      className="h-9 text-sm border-border/50 focus:border-orange-500/50 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="flashSaleDescription" className="text-xs font-medium">Flash Sale Description</Label>
                  <Input
                    id="flashSaleDescription"
                    value={form.flashSaleDescription}
                    onChange={(e) => updateField('flashSaleDescription', e.target.value)}
                    placeholder="Grab these deals before they're gone!"
                    className="h-9 text-sm border-border/50 focus:border-orange-500/50 transition-colors"
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sale Categories */}
      <div 
        className="group relative"
        style={{ perspective: '1000px' }}
      >
        <div 
          className="absolute -inset-[1px] rounded-xl opacity-0 group-hover:opacity-100 blur-[1px] transition-all duration-300"
          style={{ background: 'linear-gradient(135deg, #6366f140, #6366f120)' }}
        />
        <Card className="relative overflow-hidden rounded-xl border border-border/40 hover:border-border/60 transition-all duration-300 group-hover:shadow-lg">
          <CardHeader className="pb-3 border-b border-border/30">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-base font-bold">
                  <div className="p-2 rounded-lg bg-indigo-500/10">
                    <Tag className="h-4 w-4 text-indigo-600" />
                  </div>
                  Sale Categories
                </CardTitle>
                <CardDescription className="text-xs">Promotional category cards displayed on the page</CardDescription>
              </div>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={addCategory}
                className="h-8 border-border/50 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all"
              >
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Add Category
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            {form.saleCategories.map((category, index) => (
              <div 
                key={index}
                className="group/card relative"
                style={{ perspective: '1000px' }}
              >
                <div 
                  className="absolute -inset-[1px] rounded-lg opacity-0 group-hover/card:opacity-100 blur-[1px] transition-all duration-300"
                  style={{ background: category.isActive ? 'linear-gradient(135deg, #10b98140, #10b98120)' : 'linear-gradient(135deg, #64748b40, #64748b20)' }}
                />
                <Card className="relative rounded-lg border border-border/30 hover:border-border/50 transition-all duration-300 p-4">
                  <div className="flex items-start justify-between mb-3">
                    <Badge 
                      variant={category.isActive ? "default" : "secondary"}
                      className={`text-[10px] font-bold h-5 ${category.isActive ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : ''}`}
                    >
                      {category.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 hover:bg-red-500/10 hover:text-red-600 transition-colors"
                      onClick={() => removeCategory(index)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-[10px] font-medium">Title</Label>
                      <Input
                        value={category.title}
                        onChange={(e) => updateCategory(index, 'title', e.target.value)}
                        placeholder="Fashion Sale"
                        className="h-8 text-xs border-border/50 focus:border-indigo-500/50 transition-colors"
                      />
                    </div>

                    <div>
                      <Label className="text-[10px] font-medium">Discount</Label>
                      <Input
                        value={category.discount}
                        onChange={(e) => updateCategory(index, 'discount', e.target.value)}
                        placeholder="60%"
                        className="h-8 text-xs border-border/50 focus:border-indigo-500/50 transition-colors"
                      />
                    </div>

                    <div className="col-span-2">
                      <Label className="text-[10px] font-medium">Description</Label>
                      <Input
                        value={category.description}
                        onChange={(e) => updateCategory(index, 'description', e.target.value)}
                        placeholder="Up to 60% off on clothing"
                        className="h-8 text-xs border-border/50 focus:border-indigo-500/50 transition-colors"
                      />
                    </div>

                    <div>
                      <Label className="text-[10px] font-medium">Badge Text</Label>
                      <Input
                        value={category.badge}
                        onChange={(e) => updateCategory(index, 'badge', e.target.value)}
                        placeholder="2000+ Items"
                        className="h-8 text-xs border-border/50 focus:border-indigo-500/50 transition-colors"
                      />
                    </div>

                    <div>
                      <Label className="text-[10px] font-medium">Gradient</Label>
                      <Input
                        value={category.gradient}
                        onChange={(e) => updateCategory(index, 'gradient', e.target.value)}
                        placeholder="from-blue-500 to-purple-600"
                        className="h-8 text-xs border-border/50 focus:border-indigo-500/50 transition-colors"
                      />
                    </div>

                    <div className="col-span-2 flex items-center justify-between p-2 rounded-lg bg-muted/20 border border-border/20">
                      <Label className="text-[10px] font-medium">Active</Label>
                      <Switch
                        checked={category.isActive}
                        onCheckedChange={(checked) => updateCategory(index, 'isActive', checked)}
                      />
                    </div>
                  </div>
                </Card>
              </div>
            ))}
            
            {form.saleCategories.length === 0 && (
              <div className="text-center py-8 border border-dashed border-border/40 rounded-lg">
                <Tag className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">No categories yet. Click "Add Category" to create one.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Stats Section */}
      <div 
        className="group relative"
        style={{ perspective: '1000px' }}
      >
        <div 
          className="absolute -inset-[1px] rounded-xl opacity-0 group-hover:opacity-100 blur-[1px] transition-all duration-300"
          style={{ background: 'linear-gradient(135deg, #8b5cf640, #8b5cf620)' }}
        />
        <Card className="relative overflow-hidden rounded-xl border border-border/40 hover:border-border/60 transition-all duration-300 group-hover:shadow-lg">
          <CardHeader className="pb-3 border-b border-border/30">
            <CardTitle className="flex items-center gap-2 text-base font-bold">
              <div className="p-2 rounded-lg bg-violet-500/10">
                <Percent className="h-4 w-4 text-violet-600" />
              </div>
              Stats Section
            </CardTitle>
            <CardDescription className="text-xs">Statistics displayed at the bottom of the page</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="maxDiscount" className="text-xs font-medium">Max Discount</Label>
                <Input
                  id="maxDiscount"
                  value={form.maxDiscount}
                  onChange={(e) => updateField('maxDiscount', e.target.value)}
                  placeholder="70%"
                  className="h-9 text-sm border-border/50 focus:border-violet-500/50 transition-colors"
                />
              </div>

              <div>
                <Label htmlFor="flashSaleDuration" className="text-xs font-medium">Flash Sale Duration</Label>
                <Input
                  id="flashSaleDuration"
                  value={form.flashSaleDuration}
                  onChange={(e) => updateField('flashSaleDuration', e.target.value)}
                  placeholder="24h"
                  className="h-9 text-sm border-border/50 focus:border-violet-500/50 transition-colors"
                />
              </div>

              <div>
                <Label htmlFor="freeShippingThreshold" className="text-xs font-medium">Free Shipping Threshold</Label>
                <Input
                  id="freeShippingThreshold"
                  value={form.freeShippingThreshold}
                  onChange={(e) => updateField('freeShippingThreshold', e.target.value)}
                  placeholder="₹50"
                  className="h-9 text-sm border-border/50 focus:border-violet-500/50 transition-colors"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t border-border/40">
        <Button 
          type="submit" 
          size="lg" 
          disabled={isLoading}
          className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white border-0 shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-all duration-300"
        >
          <Save className="h-4 w-4 mr-2" />
          Save All Changes
        </Button>
      </div>
    </form>
  );
}
