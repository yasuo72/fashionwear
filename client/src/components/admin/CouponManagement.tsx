import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Search, Tag, Calendar, Percent, DollarSign, Sparkles, Ticket } from "lucide-react";
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
    description: "",
    discountType: "percentage",
    discountValue: 0,
    minPurchase: 0,
    maxDiscount: 0,
    usageLimit: 0,
    validFrom: "",
    validUntil: "",
    isActive: true,
  });

  const resetForm = () => {
    setCouponForm({
      code: "",
      description: "",
      discountType: "percentage",
      discountValue: 0,
      minPurchase: 0,
      maxDiscount: 0,
      usageLimit: 0,
      validFrom: "",
      validUntil: "",
      isActive: true,
    });
    setEditingCoupon(null);
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!couponForm.code || !couponForm.description || !couponForm.discountValue || !couponForm.validFrom || !couponForm.validUntil) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields: code, description, discount value, valid from, and valid until.",
          variant: "destructive"
        });
        return;
      }

      const formData = {
        ...couponForm,
        code: couponForm.code.toUpperCase(),
        discountValue: Number(couponForm.discountValue),
        minPurchase: Number(couponForm.minPurchase) || undefined,
        maxDiscount: Number(couponForm.maxDiscount) || undefined,
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
      description: coupon.description || "",
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minPurchase: coupon.minPurchase || 0,
      maxDiscount: coupon.maxDiscount || 0,
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
    if (!coupon.isActive) return { label: "Inactive", variant: "secondary" as const, color: "#64748b" };
    
    const now = new Date();
    const validFrom = new Date(coupon.validFrom);
    const validUntil = new Date(coupon.validUntil);
    
    if (now < validFrom) return { label: "Scheduled", variant: "outline" as const, color: "#3b82f6" };
    if (now > validUntil) return { label: "Expired", variant: "destructive" as const, color: "#ef4444" };
    
    return { label: "Active", variant: "default" as const, color: "#10b981" };
  };

  const couponStats = [
    { label: "Total Coupons", value: coupons.length, color: "#6366f1", gradient: "from-indigo-500 to-violet-600" },
    { label: "Active", value: coupons.filter(c => getCouponStatus(c).label === "Active").length, color: "#10b981", gradient: "from-emerald-500 to-green-600" },
    { label: "Expired", value: coupons.filter(c => getCouponStatus(c).label === "Expired").length, color: "#ef4444", gradient: "from-red-500 to-rose-600" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="group" style={{ perspective: '1000px' }}>
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold px-3 py-1.5 rounded-full mb-2">
            <Sparkles className="w-3 h-3" />
            Discount Center
          </div>
          <h2 className="text-2xl font-black bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Coupon Management
          </h2>
          <p className="text-muted-foreground text-sm">Create and manage discount coupons</p>
        </div>
        
        <Dialog open={showCouponDialog} onOpenChange={setShowCouponDialog}>
          <DialogTrigger asChild>
            <Button 
              onClick={resetForm}
              className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white border-0 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all duration-300"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Coupon
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg font-bold">
                <Ticket className="h-5 w-5 text-indigo-600" />
                {editingCoupon ? "Edit Coupon" : "Create New Coupon"}
              </DialogTitle>
              <DialogDescription className="text-sm">
                {editingCoupon ? "Update coupon settings and discount details." : "Create a new discount coupon for your customers."}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="code" className="text-xs font-medium">Coupon Code *</Label>
                  <Input
                    id="code"
                    value={couponForm.code}
                    onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                    placeholder="SAVE20"
                    required
                    className="h-9 text-sm border-border/50 focus:border-indigo-500/50 transition-colors font-mono"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description" className="text-xs font-medium">Description *</Label>
                  <Input
                    id="description"
                    value={couponForm.description}
                    onChange={(e) => setCouponForm({ ...couponForm, description: e.target.value })}
                    placeholder="Get 20% off on all items"
                    required
                    className="h-9 text-sm border-border/50 focus:border-indigo-500/50 transition-colors"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="discountType" className="text-xs font-medium">Discount Type</Label>
                    <Select
                      value={couponForm.discountType}
                      onValueChange={(value) => setCouponForm({ ...couponForm, discountType: value })}
                    >
                      <SelectTrigger className="h-9 text-sm border-border/50 hover:border-indigo-500/50 transition-colors">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="discountValue" className="text-xs font-medium">
                      Value {couponForm.discountType === 'percentage' ? '(%)' : '(₹)'} *
                    </Label>
                    <Input
                      id="discountValue"
                      type="number"
                      value={couponForm.discountValue}
                      onChange={(e) => setCouponForm({ ...couponForm, discountValue: parseFloat(e.target.value) || 0 })}
                      placeholder={couponForm.discountType === 'percentage' ? '20' : '10.00'}
                      required
                      className="h-9 text-sm border-border/50 focus:border-indigo-500/50 transition-colors"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="minPurchase" className="text-xs font-medium">Min Purchase (₹)</Label>
                    <Input
                      id="minPurchase"
                      type="number"
                      value={couponForm.minPurchase}
                      onChange={(e) => setCouponForm({ ...couponForm, minPurchase: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                      className="h-9 text-sm border-border/50 focus:border-indigo-500/50 transition-colors"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="maxDiscount" className="text-xs font-medium">Max Discount (₹)</Label>
                    <Input
                      id="maxDiscount"
                      type="number"
                      value={couponForm.maxDiscount}
                      onChange={(e) => setCouponForm({ ...couponForm, maxDiscount: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                      className="h-9 text-sm border-border/50 focus:border-indigo-500/50 transition-colors"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="usageLimit" className="text-xs font-medium">Usage Limit</Label>
                  <Input
                    id="usageLimit"
                    type="number"
                    value={couponForm.usageLimit}
                    onChange={(e) => setCouponForm({ ...couponForm, usageLimit: parseInt(e.target.value) || 0 })}
                    placeholder="0 (unlimited)"
                    className="h-9 text-sm border-border/50 focus:border-indigo-500/50 transition-colors"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="validFrom" className="text-xs font-medium flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Valid From *
                    </Label>
                    <Input
                      id="validFrom"
                      type="date"
                      value={couponForm.validFrom}
                      onChange={(e) => setCouponForm({ ...couponForm, validFrom: e.target.value })}
                      className="h-9 text-sm border-border/50 focus:border-indigo-500/50 transition-colors"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="validUntil" className="text-xs font-medium flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Valid Until *
                    </Label>
                    <Input
                      id="validUntil"
                      type="date"
                      value={couponForm.validUntil}
                      onChange={(e) => setCouponForm({ ...couponForm, validUntil: e.target.value })}
                      className="h-9 text-sm border-border/50 focus:border-indigo-500/50 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <label className="flex items-center gap-2 cursor-pointer pt-4 border-t border-border/40">
              <input
                type="checkbox"
                id="isActive"
                checked={couponForm.isActive}
                onChange={(e) => setCouponForm({ ...couponForm, isActive: e.target.checked })}
                className="w-4 h-4 rounded border-border/50 text-indigo-600 focus:ring-indigo-500"
              />
              <Label htmlFor="isActive" className="text-xs font-medium cursor-pointer">Active Coupon</Label>
            </label>
            
            <div className="flex gap-2 pt-4 border-t border-border/40">
              <Button 
                onClick={handleSubmit} 
                disabled={isLoading}
                className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white border-0"
              >
                {isLoading ? "Saving..." : editingCoupon ? "Update Coupon" : "Create Coupon"}
              </Button>
              <Button variant="outline" onClick={() => setShowCouponDialog(false)} className="border-border/50 hover:border-border transition-colors">
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {couponStats.map((stat) => (
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
            placeholder="Search coupons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-9 border-border/50 focus:border-indigo-500/50 transition-colors"
          />
        </div>
        <Badge variant="secondary" className="h-9 px-3">{filteredCoupons.length} coupons</Badge>
      </div>

      {/* Coupons List */}
      <div className="grid gap-3">
        {filteredCoupons.map((coupon) => {
          const status = getCouponStatus(coupon);
          return (
            <div 
              key={coupon._id}
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
                        <Tag className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-sm font-mono">{coupon.code}</h3>
                          <Badge 
                            variant={status.variant}
                            className="text-[10px] font-bold h-5"
                            style={status.label === "Active" ? { backgroundColor: `${status.color}10`, color: status.color, borderColor: `${status.color}20` } : {}}
                          >
                            {status.label}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted/30">
                            {coupon.discountType === 'percentage' ? (
                              <Percent className="h-3 w-3" />
                            ) : (
                              <DollarSign className="h-3 w-3" />
                            )}
                            <span className="font-medium">
                              {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                            </span>
                          </div>
                          
                          {coupon.minPurchase > 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-muted/30">Min: ₹{coupon.minPurchase}</span>
                          )}
                          
                          {coupon.maxDiscount > 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-muted/30">Max: ₹{coupon.maxDiscount}</span>
                          )}
                          
                          {coupon.usageLimit > 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-muted/30">Uses: {coupon.usedCount || 0}/{coupon.usageLimit}</span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {new Date(coupon.validFrom).toLocaleDateString()} - {new Date(coupon.validUntil).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 shrink-0">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="h-8 w-8 p-0 border-border/50 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all"
                        onClick={() => openEditCoupon(coupon)}
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="h-8 w-8 p-0 border-border/50 hover:border-red-500/50 hover:bg-red-500/5 transition-all"
                        onClick={() => handleDeleteCoupon(coupon._id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredCoupons.length === 0 && (
        <Card className="border-dashed border-border/40">
          <CardContent className="p-12 text-center">
            <div className="p-4 rounded-full bg-muted/50 w-fit mx-auto mb-4">
              <Tag className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold mb-2">No coupons found</h3>
            <p className="text-sm text-muted-foreground">
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
