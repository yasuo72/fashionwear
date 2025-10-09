import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Search, Tag, Calendar, Percent, DollarSign } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CouponManagementProps {
  coupons: any[];
  onCreateCoupon: (data: any) => Promise<void>;
  onUpdateCoupon: (data: any) => Promise<void>;
  onDeleteCoupon: (id: string) => Promise<void>;
  isLoading?: boolean;
}

export function CouponManagement({
  coupons,
  onCreateCoupon,
  onUpdateCoupon,
  onDeleteCoupon,
  isLoading = false
}: CouponManagementProps) {
  const [showCouponDialog, setShowCouponDialog] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [couponForm, setCouponForm] = useState({
    code: "",
    type: "percentage",
    value: 0,
    minOrderAmount: 0,
    maxDiscountAmount: 0,
    usageLimit: 0,
    validFrom: "",
    validUntil: "",
    isActive: true,
  });

  const resetForm = () => {
    setCouponForm({
      code: "",
      type: "percentage",
      value: 0,
      minOrderAmount: 0,
      maxDiscountAmount: 0,
      usageLimit: 0,
      validFrom: "",
      validUntil: "",
      isActive: true,
    });
    setEditingCoupon(null);
  };

  const handleSubmit = async () => {
    try {
      const formData = {
        ...couponForm,
        code: couponForm.code.toUpperCase(),
        value: Number(couponForm.value),
        minOrderAmount: Number(couponForm.minOrderAmount) || undefined,
        maxDiscountAmount: Number(couponForm.maxDiscountAmount) || undefined,
        usageLimit: Number(couponForm.usageLimit) || undefined,
      };

      if (editingCoupon) {
        await onUpdateCoupon({ _id: editingCoupon._id, ...formData });
      } else {
        await onCreateCoupon(formData);
      }
      
      setShowCouponDialog(false);
      resetForm();
    } catch (error) {
      // Error handling is done in parent component
    }
  };

  const openEditCoupon = (coupon: any) => {
    setEditingCoupon(coupon);
    setCouponForm({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      minOrderAmount: coupon.minOrderAmount || 0,
      maxDiscountAmount: coupon.maxDiscountAmount || 0,
      usageLimit: coupon.usageLimit || 0,
      validFrom: coupon.validFrom ? new Date(coupon.validFrom).toISOString().split('T')[0] : "",
      validUntil: coupon.validUntil ? new Date(coupon.validUntil).toISOString().split('T')[0] : "",
      isActive: coupon.isActive,
    });
    setShowCouponDialog(true);
  };

  const handleDeleteCoupon = async (couponId: string) => {
    if (!confirm("Are you sure you want to delete this coupon? This action cannot be undone.")) return;
    
    try {
      await onDeleteCoupon(couponId);
    } catch (error) {
      // Error handling is done in parent component
    }
  };

  const filteredCoupons = coupons.filter(coupon =>
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCouponStatus = (coupon: any) => {
    if (!coupon.isActive) return { label: "Inactive", variant: "secondary" as const };
    
    const now = new Date();
    const validFrom = new Date(coupon.validFrom);
    const validUntil = new Date(coupon.validUntil);
    
    if (now < validFrom) return { label: "Scheduled", variant: "outline" as const };
    if (now > validUntil) return { label: "Expired", variant: "destructive" as const };
    
    return { label: "Active", variant: "default" as const };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Coupon Management</h2>
          <p className="text-muted-foreground">Create and manage discount coupons</p>
        </div>
        
        <Dialog open={showCouponDialog} onOpenChange={setShowCouponDialog}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Create Coupon
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCoupon ? "Edit Coupon" : "Create New Coupon"}
              </DialogTitle>
              <DialogDescription>
                {editingCoupon ? "Update coupon settings and discount details." : "Create a new discount coupon for your customers."}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="code">Coupon Code</Label>
                  <Input
                    id="code"
                    value={couponForm.code}
                    onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                    placeholder="SAVE20"
                  />
                </div>
                
                <div>
                  <Label htmlFor="type">Discount Type</Label>
                  <Select
                    value={couponForm.type}
                    onValueChange={(value) => setCouponForm({ ...couponForm, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select discount type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="value">
                    Discount Value {couponForm.type === 'percentage' ? '(%)' : '(₹)'}
                  </Label>
                  <Input
                    id="value"
                    type="number"
                    value={couponForm.value}
                    onChange={(e) => setCouponForm({ ...couponForm, value: parseFloat(e.target.value) || 0 })}
                    placeholder={couponForm.type === 'percentage' ? '20' : '10.00'}
                  />
                </div>
                
                <div>
                  <Label htmlFor="minOrderAmount">Minimum Order Amount (₹)</Label>
                  <Input
                    id="minOrderAmount"
                    type="number"
                    value={couponForm.minOrderAmount}
                    onChange={(e) => setCouponForm({ ...couponForm, minOrderAmount: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="maxDiscountAmount">Max Discount Amount (₹)</Label>
                  <Input
                    id="maxDiscountAmount"
                    type="number"
                    value={couponForm.maxDiscountAmount}
                    onChange={(e) => setCouponForm({ ...couponForm, maxDiscountAmount: parseFloat(e.target.value) || 0 })}
                    placeholder="0.00 (unlimited)"
                  />
                </div>
                
                <div>
                  <Label htmlFor="usageLimit">Usage Limit</Label>
                  <Input
                    id="usageLimit"
                    type="number"
                    value={couponForm.usageLimit}
                    onChange={(e) => setCouponForm({ ...couponForm, usageLimit: parseInt(e.target.value) || 0 })}
                    placeholder="0 (unlimited)"
                  />
                </div>
                
                <div>
                  <Label htmlFor="validFrom">Valid From</Label>
                  <Input
                    id="validFrom"
                    type="date"
                    value={couponForm.validFrom}
                    onChange={(e) => setCouponForm({ ...couponForm, validFrom: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="validUntil">Valid Until</Label>
                  <Input
                    id="validUntil"
                    type="date"
                    value={couponForm.validUntil}
                    onChange={(e) => setCouponForm({ ...couponForm, validUntil: e.target.value })}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 pt-4">
              <input
                type="checkbox"
                id="isActive"
                checked={couponForm.isActive}
                onChange={(e) => setCouponForm({ ...couponForm, isActive: e.target.checked })}
              />
              <Label htmlFor="isActive">Active Coupon</Label>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? "Saving..." : editingCoupon ? "Update Coupon" : "Create Coupon"}
              </Button>
              <Button variant="outline" onClick={() => setShowCouponDialog(false)}>
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
            placeholder="Search coupons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Badge variant="secondary">{filteredCoupons.length} coupons</Badge>
      </div>

      <div className="grid gap-4">
        {filteredCoupons.map((coupon) => {
          const status = getCouponStatus(coupon);
          return (
            <Card key={coupon._id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Tag className="h-5 w-5 text-primary" />
                        <h3 className="font-bold text-lg">{coupon.code}</h3>
                      </div>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        {coupon.type === 'percentage' ? (
                          <Percent className="h-4 w-4" />
                        ) : (
                          <DollarSign className="h-4 w-4" />
                        )}
                        <span>
                          {coupon.type === 'percentage' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
                        </span>
                      </div>
                      
                      {coupon.minOrderAmount > 0 && (
                        <span>Min: ₹{coupon.minOrderAmount}</span>
                      )}
                      
                      {coupon.maxDiscountAmount > 0 && (
                        <span>Max: ₹{coupon.maxDiscountAmount}</span>
                      )}
                      
                      {coupon.usageLimit > 0 && (
                        <span>Uses: {coupon.usedCount || 0}/{coupon.usageLimit}</span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(coupon.validFrom).toLocaleDateString()} - {new Date(coupon.validUntil).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEditCoupon(coupon)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDeleteCoupon(coupon._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredCoupons.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No coupons found</h3>
            <p className="text-muted-foreground">
              {searchTerm 
                ? "Try adjusting your search terms" 
                : "Create your first coupon to offer discounts to customers"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
