import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Store, Truck, Tag, DollarSign, Share2, Settings as SettingsIcon, Sparkles, Save } from "lucide-react";
import type { SiteSettings } from "@/hooks/useSettings";

interface SettingsManagementProps {
  settings: SiteSettings;
  onUpdateSettings: (data: Partial<SiteSettings>) => Promise<void>;
  isLoading?: boolean;
}

export function SettingsManagement({
  settings,
  onUpdateSettings,
  isLoading = false
}: SettingsManagementProps) {
  const [form, setForm] = useState<SiteSettings>(settings);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdateSettings(form);
  };

  const updateField = (field: keyof SiteSettings, value: any) => {
    setForm({ ...form, [field]: value });
  };

  const settingsSections = [
    { key: 'store', icon: Store, title: 'Store Information', color: '#6366f1' },
    { key: 'shipping', icon: Truck, title: 'Shipping Settings', color: '#3b82f6' },
    { key: 'sale', icon: Tag, title: 'Sale Settings', color: '#ef4444' },
    { key: 'tax', icon: DollarSign, title: 'Tax Settings', color: '#10b981' },
    { key: 'social', icon: Share2, title: 'Social Media', color: '#8b5cf6' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="group" style={{ perspective: '1000px' }}>
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold px-3 py-1.5 rounded-full mb-2">
            <Sparkles className="w-3 h-3" />
            Configuration Hub
          </div>
          <h2 className="text-2xl font-black bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Site Settings
          </h2>
          <p className="text-muted-foreground text-sm">Configure your store settings and preferences</p>
        </div>
        <Button 
          type="submit" 
          disabled={isLoading}
          className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white border-0 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all duration-300"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-5 gap-2">
        {settingsSections.map((section) => {
          const Icon = section.icon;
          return (
            <div 
              key={section.key}
              className="group relative"
              style={{ perspective: '1000px' }}
            >
              <div 
                className="absolute -inset-[1px] rounded-lg opacity-0 group-hover:opacity-100 blur-[1px] transition-all duration-300"
                style={{ background: `linear-gradient(135deg, ${section.color}30, ${section.color}10)` }}
              />
              <div className="relative rounded-lg border border-border/40 hover:border-border/60 transition-all duration-300 group-hover:shadow-md group-hover:scale-[1.02] transform-gpu p-3 text-center bg-card">
                <Icon className="h-4 w-4 mx-auto mb-1" style={{ color: section.color }} />
                <span className="text-[10px] font-bold text-muted-foreground">{section.title}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Store Information */}
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
            <CardTitle className="flex items-center gap-2 text-base font-bold">
              <div className="p-2 rounded-lg bg-indigo-500/10">
                <Store className="h-4 w-4 text-indigo-600" />
              </div>
              Store Information
            </CardTitle>
            <CardDescription className="text-xs">Basic information about your store</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="storeName" className="text-xs font-medium">Store Name</Label>
                <Input
                  id="storeName"
                  value={form.storeName}
                  onChange={(e) => updateField('storeName', e.target.value)}
                  placeholder="FashionHub"
                  className="h-9 text-sm border-border/50 focus:border-indigo-500/50 transition-colors"
                />
              </div>
              <div>
                <Label htmlFor="storeEmail" className="text-xs font-medium">Store Email</Label>
                <Input
                  id="storeEmail"
                  type="email"
                  value={form.storeEmail}
                  onChange={(e) => updateField('storeEmail', e.target.value)}
                  placeholder="contact@fashionhub.com"
                  className="h-9 text-sm border-border/50 focus:border-indigo-500/50 transition-colors"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="storePhone" className="text-xs font-medium">Store Phone</Label>
                <Input
                  id="storePhone"
                  value={form.storePhone || ''}
                  onChange={(e) => updateField('storePhone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="h-9 text-sm border-border/50 focus:border-indigo-500/50 transition-colors"
                />
              </div>
              <div>
                <Label htmlFor="storeAddress" className="text-xs font-medium">Store Address</Label>
                <Input
                  id="storeAddress"
                  value={form.storeAddress || ''}
                  onChange={(e) => updateField('storeAddress', e.target.value)}
                  placeholder="123 Fashion Street, NY 10001"
                  className="h-9 text-sm border-border/50 focus:border-indigo-500/50 transition-colors"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Shipping Settings */}
      <div 
        className="group relative"
        style={{ perspective: '1000px' }}
      >
        <div 
          className="absolute -inset-[1px] rounded-xl opacity-0 group-hover:opacity-100 blur-[1px] transition-all duration-300"
          style={{ background: 'linear-gradient(135deg, #3b82f640, #3b82f620)' }}
        />
        <Card className="relative overflow-hidden rounded-xl border border-border/40 hover:border-border/60 transition-all duration-300 group-hover:shadow-lg">
          <CardHeader className="pb-3 border-b border-border/30">
            <CardTitle className="flex items-center gap-2 text-base font-bold">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Truck className="h-4 w-4 text-blue-600" />
              </div>
              Shipping Settings
            </CardTitle>
            <CardDescription className="text-xs">Configure shipping costs and free delivery threshold</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="freeDeliveryThreshold" className="text-xs font-medium">Free Delivery Threshold (₹)</Label>
                <Input
                  id="freeDeliveryThreshold"
                  type="number"
                  value={form.freeDeliveryThreshold}
                  onChange={(e) => updateField('freeDeliveryThreshold', Number(e.target.value))}
                  min="0"
                  step="1"
                  className="h-9 text-sm border-border/50 focus:border-blue-500/50 transition-colors"
                />
                <p className="text-[10px] text-muted-foreground mt-1">
                  Orders above ₹{form.freeDeliveryThreshold} get free delivery
                </p>
              </div>
              <div>
                <Label htmlFor="standardShippingCost" className="text-xs font-medium">Standard Shipping (₹)</Label>
                <Input
                  id="standardShippingCost"
                  type="number"
                  value={form.standardShippingCost}
                  onChange={(e) => updateField('standardShippingCost', Number(e.target.value))}
                  min="0"
                  step="0.01"
                  className="h-9 text-sm border-border/50 focus:border-blue-500/50 transition-colors"
                />
              </div>
              <div>
                <Label htmlFor="expressShippingCost" className="text-xs font-medium">Express Shipping (₹)</Label>
                <Input
                  id="expressShippingCost"
                  type="number"
                  value={form.expressShippingCost}
                  onChange={(e) => updateField('expressShippingCost', Number(e.target.value))}
                  min="0"
                  step="0.01"
                  className="h-9 text-sm border-border/50 focus:border-blue-500/50 transition-colors"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sale Settings */}
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
                <Tag className="h-4 w-4 text-red-600" />
              </div>
              Sale Settings
            </CardTitle>
            <CardDescription className="text-xs">Configure site-wide sales and promotions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/30">
              <div className="space-y-0.5">
                <Label htmlFor="saleEnabled" className="text-xs font-medium">Enable Site-Wide Sale</Label>
                <p className="text-[10px] text-muted-foreground">
                  Apply automatic discount to all products marked as on sale
                </p>
              </div>
              <Switch
                id="saleEnabled"
                checked={form.saleEnabled}
                onCheckedChange={(checked) => updateField('saleEnabled', checked)}
              />
            </div>

            {form.saleEnabled && (
              <>
                <Separator className="bg-border/30" />
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="salePercentage" className="text-xs font-medium">Sale Discount (%)</Label>
                    <Input
                      id="salePercentage"
                      type="number"
                      value={form.salePercentage || 0}
                      onChange={(e) => updateField('salePercentage', Number(e.target.value))}
                      min="0"
                      max="100"
                      className="h-9 text-sm border-border/50 focus:border-red-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <Label htmlFor="saleStartDate" className="text-xs font-medium">Sale Start Date</Label>
                    <Input
                      id="saleStartDate"
                      type="date"
                      value={form.saleStartDate ? new Date(form.saleStartDate).toISOString().split('T')[0] : ''}
                      onChange={(e) => updateField('saleStartDate', e.target.value)}
                      className="h-9 text-sm border-border/50 focus:border-red-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <Label htmlFor="saleEndDate" className="text-xs font-medium">Sale End Date</Label>
                    <Input
                      id="saleEndDate"
                      type="date"
                      value={form.saleEndDate ? new Date(form.saleEndDate).toISOString().split('T')[0] : ''}
                      onChange={(e) => updateField('saleEndDate', e.target.value)}
                      className="h-9 text-sm border-border/50 focus:border-red-500/50 transition-colors"
                    />
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tax Settings */}
      <div 
        className="group relative"
        style={{ perspective: '1000px' }}
      >
        <div 
          className="absolute -inset-[1px] rounded-xl opacity-0 group-hover:opacity-100 blur-[1px] transition-all duration-300"
          style={{ background: 'linear-gradient(135deg, #10b98140, #10b98120)' }}
        />
        <Card className="relative overflow-hidden rounded-xl border border-border/40 hover:border-border/60 transition-all duration-300 group-hover:shadow-lg">
          <CardHeader className="pb-3 border-b border-border/30">
            <CardTitle className="flex items-center gap-2 text-base font-bold">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <DollarSign className="h-4 w-4 text-emerald-600" />
              </div>
              Tax Settings
            </CardTitle>
            <CardDescription className="text-xs">Configure tax calculation for orders</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/30">
              <div className="space-y-0.5">
                <Label htmlFor="taxEnabled" className="text-xs font-medium">Enable Tax Calculation</Label>
                <p className="text-[10px] text-muted-foreground">
                  Add tax to product prices at checkout
                </p>
              </div>
              <Switch
                id="taxEnabled"
                checked={form.taxEnabled}
                onCheckedChange={(checked) => updateField('taxEnabled', checked)}
              />
            </div>

            {form.taxEnabled && (
              <>
                <Separator className="bg-border/30" />
                <div>
                  <Label htmlFor="taxPercentage" className="text-xs font-medium">Tax Rate (%)</Label>
                  <Input
                    id="taxPercentage"
                    type="number"
                    value={form.taxPercentage}
                    onChange={(e) => updateField('taxPercentage', Number(e.target.value))}
                    min="0"
                    max="100"
                    step="0.01"
                    className="max-w-xs h-9 text-sm border-border/50 focus:border-emerald-500/50 transition-colors"
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Social Media */}
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
                <Share2 className="h-4 w-4 text-violet-600" />
              </div>
              Social Media Links
            </CardTitle>
            <CardDescription className="text-xs">Connect your social media profiles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="facebookUrl" className="text-xs font-medium">Facebook URL</Label>
                <Input
                  id="facebookUrl"
                  value={form.facebookUrl || ''}
                  onChange={(e) => updateField('facebookUrl', e.target.value)}
                  placeholder="https://facebook.com/..."
                  className="h-9 text-sm border-border/50 focus:border-violet-500/50 transition-colors"
                />
              </div>
              <div>
                <Label htmlFor="instagramUrl" className="text-xs font-medium">Instagram URL</Label>
                <Input
                  id="instagramUrl"
                  value={form.instagramUrl || ''}
                  onChange={(e) => updateField('instagramUrl', e.target.value)}
                  placeholder="https://instagram.com/..."
                  className="h-9 text-sm border-border/50 focus:border-violet-500/50 transition-colors"
                />
              </div>
              <div>
                <Label htmlFor="twitterUrl" className="text-xs font-medium">Twitter URL</Label>
                <Input
                  id="twitterUrl"
                  value={form.twitterUrl || ''}
                  onChange={(e) => updateField('twitterUrl', e.target.value)}
                  placeholder="https://twitter.com/..."
                  className="h-9 text-sm border-border/50 focus:border-violet-500/50 transition-colors"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Maintenance Mode */}
      <div 
        className="group relative"
        style={{ perspective: '1000px' }}
      >
        <div 
          className="absolute -inset-[1px] rounded-xl opacity-0 group-hover:opacity-100 blur-[1px] transition-all duration-300"
          style={{ background: 'linear-gradient(135deg, #f59e0b40, #f59e0b20)' }}
        />
        <Card className="relative overflow-hidden rounded-xl border border-border/40 hover:border-border/60 transition-all duration-300 group-hover:shadow-lg">
          <CardHeader className="pb-3 border-b border-border/30">
            <CardTitle className="flex items-center gap-2 text-base font-bold">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <SettingsIcon className="h-4 w-4 text-amber-600" />
              </div>
              Maintenance Mode
            </CardTitle>
            <CardDescription className="text-xs">Enable maintenance mode to temporarily close your store</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/30">
              <div className="space-y-0.5">
                <Label htmlFor="maintenanceMode" className="text-xs font-medium">Enable Maintenance Mode</Label>
                <p className="text-[10px] text-muted-foreground">
                  Users will see a maintenance message instead of the site
                </p>
              </div>
              <Switch
                id="maintenanceMode"
                checked={form.maintenanceMode}
                onCheckedChange={(checked) => updateField('maintenanceMode', checked)}
              />
            </div>

            {form.maintenanceMode && (
              <>
                <Separator className="bg-border/30" />
                <div>
                  <Label htmlFor="maintenanceMessage" className="text-xs font-medium">Maintenance Message</Label>
                  <Textarea
                    id="maintenanceMessage"
                    value={form.maintenanceMessage || ''}
                    onChange={(e) => updateField('maintenanceMessage', e.target.value)}
                    placeholder="We are currently under maintenance..."
                    rows={3}
                    className="text-sm border-border/50 focus:border-amber-500/50 transition-colors"
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t border-border/40">
        <Button 
          type="submit" 
          size="lg" 
          disabled={isLoading}
          className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white border-0 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all duration-300"
        >
          <Save className="h-4 w-4 mr-2" />
          Save All Settings
        </Button>
      </div>
    </form>
  );
}
