import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Store, Truck, Tag, DollarSign, Share2, Settings as SettingsIcon } from "lucide-react";
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Site Settings</h2>
          <p className="text-muted-foreground">Configure your store settings and preferences</p>
        </div>
        <Button type="submit" disabled={isLoading}>
          <SettingsIcon className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>

      {/* Store Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Store Information
          </CardTitle>
          <CardDescription>Basic information about your store</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="storeName">Store Name</Label>
              <Input
                id="storeName"
                value={form.storeName}
                onChange={(e) => updateField('storeName', e.target.value)}
                placeholder="FashionHub"
              />
            </div>
            <div>
              <Label htmlFor="storeEmail">Store Email</Label>
              <Input
                id="storeEmail"
                type="email"
                value={form.storeEmail}
                onChange={(e) => updateField('storeEmail', e.target.value)}
                placeholder="contact@fashionhub.com"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="storePhone">Store Phone</Label>
              <Input
                id="storePhone"
                value={form.storePhone || ''}
                onChange={(e) => updateField('storePhone', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <Label htmlFor="storeAddress">Store Address</Label>
              <Input
                id="storeAddress"
                value={form.storeAddress || ''}
                onChange={(e) => updateField('storeAddress', e.target.value)}
                placeholder="123 Fashion Street, NY 10001"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shipping Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Shipping Settings
          </CardTitle>
          <CardDescription>Configure shipping costs and free delivery threshold</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="freeDeliveryThreshold">Free Delivery Threshold ($)</Label>
              <Input
                id="freeDeliveryThreshold"
                type="number"
                value={form.freeDeliveryThreshold}
                onChange={(e) => updateField('freeDeliveryThreshold', Number(e.target.value))}
                min="0"
                step="1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Orders above this amount get free delivery
              </p>
            </div>
            <div>
              <Label htmlFor="standardShippingCost">Standard Shipping ($)</Label>
              <Input
                id="standardShippingCost"
                type="number"
                value={form.standardShippingCost}
                onChange={(e) => updateField('standardShippingCost', Number(e.target.value))}
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <Label htmlFor="expressShippingCost">Express Shipping ($)</Label>
              <Input
                id="expressShippingCost"
                type="number"
                value={form.expressShippingCost}
                onChange={(e) => updateField('expressShippingCost', Number(e.target.value))}
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sale Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Sale Settings
          </CardTitle>
          <CardDescription>Configure site-wide sales and promotions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="saleEnabled">Enable Site-Wide Sale</Label>
              <p className="text-xs text-muted-foreground">
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
              <Separator />
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="salePercentage">Sale Discount (%)</Label>
                  <Input
                    id="salePercentage"
                    type="number"
                    value={form.salePercentage || 0}
                    onChange={(e) => updateField('salePercentage', Number(e.target.value))}
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <Label htmlFor="saleStartDate">Sale Start Date</Label>
                  <Input
                    id="saleStartDate"
                    type="date"
                    value={form.saleStartDate ? new Date(form.saleStartDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => updateField('saleStartDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="saleEndDate">Sale End Date</Label>
                  <Input
                    id="saleEndDate"
                    type="date"
                    value={form.saleEndDate ? new Date(form.saleEndDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => updateField('saleEndDate', e.target.value)}
                  />
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Tax Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Tax Settings
          </CardTitle>
          <CardDescription>Configure tax calculation for orders</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="taxEnabled">Enable Tax Calculation</Label>
              <p className="text-xs text-muted-foreground">
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
              <Separator />
              <div>
                <Label htmlFor="taxPercentage">Tax Rate (%)</Label>
                <Input
                  id="taxPercentage"
                  type="number"
                  value={form.taxPercentage}
                  onChange={(e) => updateField('taxPercentage', Number(e.target.value))}
                  min="0"
                  max="100"
                  step="0.01"
                  className="max-w-xs"
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Social Media */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Social Media Links
          </CardTitle>
          <CardDescription>Connect your social media profiles</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="facebookUrl">Facebook URL</Label>
              <Input
                id="facebookUrl"
                value={form.facebookUrl || ''}
                onChange={(e) => updateField('facebookUrl', e.target.value)}
                placeholder="https://facebook.com/..."
              />
            </div>
            <div>
              <Label htmlFor="instagramUrl">Instagram URL</Label>
              <Input
                id="instagramUrl"
                value={form.instagramUrl || ''}
                onChange={(e) => updateField('instagramUrl', e.target.value)}
                placeholder="https://instagram.com/..."
              />
            </div>
            <div>
              <Label htmlFor="twitterUrl">Twitter URL</Label>
              <Input
                id="twitterUrl"
                value={form.twitterUrl || ''}
                onChange={(e) => updateField('twitterUrl', e.target.value)}
                placeholder="https://twitter.com/..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Maintenance Mode */}
      <Card>
        <CardHeader>
          <CardTitle>Maintenance Mode</CardTitle>
          <CardDescription>Enable maintenance mode to temporarily close your store</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="maintenanceMode">Enable Maintenance Mode</Label>
              <p className="text-xs text-muted-foreground">
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
              <Separator />
              <div>
                <Label htmlFor="maintenanceMessage">Maintenance Message</Label>
                <Textarea
                  id="maintenanceMessage"
                  value={form.maintenanceMessage || ''}
                  onChange={(e) => updateField('maintenanceMessage', e.target.value)}
                  placeholder="We are currently under maintenance..."
                  rows={3}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={isLoading}>
          <SettingsIcon className="h-4 w-4 mr-2" />
          Save All Settings
        </Button>
      </div>
    </form>
  );
}
