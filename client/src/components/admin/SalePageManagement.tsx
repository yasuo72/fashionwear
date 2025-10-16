import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Flame, Plus, Trash2, ShoppingBag } from "lucide-react";
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Sale Page Configuration</h2>
          <p className="text-muted-foreground">Customize your sale page content and appearance</p>
        </div>
        <Button type="submit" disabled={isLoading}>
          <Flame className="h-4 w-4 mr-2" />
          Save Configuration
        </Button>
      </div>

      {/* Hero Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5" />
            Hero Section
          </CardTitle>
          <CardDescription>Main banner at the top of the sale page</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="heroTitle">Hero Title</Label>
            <Input
              id="heroTitle"
              value={form.heroTitle}
              onChange={(e) => updateField('heroTitle', e.target.value)}
              placeholder="MEGA SALE"
            />
          </div>
          
          <div>
            <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
            <Input
              id="heroSubtitle"
              value={form.heroSubtitle}
              onChange={(e) => updateField('heroSubtitle', e.target.value)}
              placeholder="Up to 70% OFF on Fashion Essentials"
            />
          </div>

          <div>
            <Label htmlFor="heroBadgeText">Badge Text</Label>
            <Input
              id="heroBadgeText"
              value={form.heroBadgeText}
              onChange={(e) => updateField('heroBadgeText', e.target.value)}
              placeholder="Limited Time Only"
            />
          </div>

          <div>
            <Label htmlFor="heroGradient">Gradient Classes</Label>
            <Input
              id="heroGradient"
              value={form.heroGradient}
              onChange={(e) => updateField('heroGradient', e.target.value)}
              placeholder="from-red-500 via-pink-500 to-orange-500"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Tailwind gradient classes (e.g., from-red-500 to-pink-500)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Flash Sale Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Flash Sale Settings</CardTitle>
          <CardDescription>Configure the flash sale section with countdown timer</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="flashSaleEnabled">Enable Flash Sale Section</Label>
              <p className="text-xs text-muted-foreground">
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
              <Separator />
              <div>
                <Label htmlFor="flashSaleTitle">Flash Sale Title</Label>
                <Input
                  id="flashSaleTitle"
                  value={form.flashSaleTitle}
                  onChange={(e) => updateField('flashSaleTitle', e.target.value)}
                  placeholder="⚡ Flash Sale"
                />
              </div>

              <div>
                <Label htmlFor="flashSaleDescription">Flash Sale Description</Label>
                <Input
                  id="flashSaleDescription"
                  value={form.flashSaleDescription}
                  onChange={(e) => updateField('flashSaleDescription', e.target.value)}
                  placeholder="Grab these deals before they're gone!"
                />
              </div>

              <div>
                <Label htmlFor="flashSaleCountdownHours">Countdown Duration (Hours)</Label>
                <Input
                  id="flashSaleCountdownHours"
                  type="number"
                  value={form.flashSaleCountdownHours}
                  onChange={(e) => updateField('flashSaleCountdownHours', Number(e.target.value))}
                  min="1"
                  max="168"
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Sale Categories */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Sale Categories</CardTitle>
              <CardDescription>Promotional category cards displayed on the page</CardDescription>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={addCategory}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {form.saleCategories.map((category, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-start justify-between mb-4">
                <Badge variant={category.isActive ? "default" : "secondary"}>
                  {category.isActive ? "Active" : "Inactive"}
                </Badge>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCategory(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={category.title}
                    onChange={(e) => updateCategory(index, 'title', e.target.value)}
                    placeholder="Fashion Sale"
                  />
                </div>

                <div>
                  <Label>Discount</Label>
                  <Input
                    value={category.discount}
                    onChange={(e) => updateCategory(index, 'discount', e.target.value)}
                    placeholder="60%"
                  />
                </div>

                <div className="col-span-2">
                  <Label>Description</Label>
                  <Input
                    value={category.description}
                    onChange={(e) => updateCategory(index, 'description', e.target.value)}
                    placeholder="Up to 60% off on clothing"
                  />
                </div>

                <div>
                  <Label>Badge Text</Label>
                  <Input
                    value={category.badge}
                    onChange={(e) => updateCategory(index, 'badge', e.target.value)}
                    placeholder="2000+ Items"
                  />
                </div>

                <div>
                  <Label>Gradient</Label>
                  <Input
                    value={category.gradient}
                    onChange={(e) => updateCategory(index, 'gradient', e.target.value)}
                    placeholder="from-blue-500 to-purple-600"
                  />
                </div>

                <div className="col-span-2 flex items-center justify-between">
                  <Label>Active</Label>
                  <Switch
                    checked={category.isActive}
                    onCheckedChange={(checked) => updateCategory(index, 'isActive', checked)}
                  />
                </div>
              </div>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Stats Section */}
      <Card>
        <CardHeader>
          <CardTitle>Stats Section</CardTitle>
          <CardDescription>Statistics displayed at the bottom of the page</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="maxDiscount">Max Discount</Label>
              <Input
                id="maxDiscount"
                value={form.maxDiscount}
                onChange={(e) => updateField('maxDiscount', e.target.value)}
                placeholder="70%"
              />
            </div>

            <div>
              <Label htmlFor="flashSaleDuration">Flash Sale Duration</Label>
              <Input
                id="flashSaleDuration"
                value={form.flashSaleDuration}
                onChange={(e) => updateField('flashSaleDuration', e.target.value)}
                placeholder="24h"
              />
            </div>

            <div>
              <Label htmlFor="freeShippingThreshold">Free Shipping Threshold</Label>
              <Input
                id="freeShippingThreshold"
                value={form.freeShippingThreshold}
                onChange={(e) => updateField('freeShippingThreshold', e.target.value)}
                placeholder="₹50"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={isLoading}>
          <Flame className="h-4 w-4 mr-2" />
          Save All Changes
        </Button>
      </div>
    </form>
  );
}
