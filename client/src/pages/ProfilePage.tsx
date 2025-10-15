import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useUpdateProfile, useChangePassword, useAddresses, useAddAddress, useUpdateAddress, useDeleteAddress } from "@/hooks/useProfile";
import { useOrders } from "@/hooks/useOrders";
import { useWishlist } from "@/hooks/useWishlist";
import { Link } from "wouter";
import { toast } from "@/hooks/use-toast";
import { 
  User, 
  MapPin, 
  Package, 
  Heart, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Truck,
  CheckCircle,
  Clock,
  X,
  Camera,
  Upload,
  Shield,
  Bell,
  Palette,
  Loader2
} from "lucide-react";

export default function ProfilePage() {
  const { data: authData } = useAuth();
  const { data: addressesData } = useAddresses();
  const { data: ordersData } = useOrders();
  const { data: wishlistData } = useWishlist();
  
  // Mutations
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();
  const addAddress = useAddAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();
  
  // State
  const [isEditing, setIsEditing] = useState(false);
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    bio: "",
    profileImage: "",
  });
  
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [showImageViewer, setShowImageViewer] = useState(false);
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  const [addressForm, setAddressForm] = useState({
    label: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
    phone: "",
    isDefault: false,
  });

  const user = authData?.user;
  const addresses = addressesData?.addresses || [];
  const orders = ordersData?.orders || [];
  const wishlist = wishlistData?.wishlist?.productIds || [];

  // Initialize form data when user data loads
  React.useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: (user as any).phone || "",
        bio: (user as any).bio || "",
        profileImage: (user as any).profileImage || "",
      });
      setImageUrl((user as any).profileImage || "");
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
            <p className="text-muted-foreground mb-6">You need to be logged in to view your profile.</p>
            <Link href="/login">
              <Button>Sign In</Button>
            </Link>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const handleSaveProfile = async () => {
    try {
      await updateProfile.mutateAsync(profileForm);
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match.",
        variant: "destructive",
      });
      return;
    }

    try {
      await changePassword.mutateAsync({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast({
        title: "Password Changed",
        description: "Your password has been changed successfully.",
      });
      setShowPasswordDialog(false);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to change password. Please check your current password.",
        variant: "destructive",
      });
    }
  };

  const handleAddAddress = async () => {
    try {
      await addAddress.mutateAsync(addressForm);
      toast({
        title: "Address Added",
        description: "Your address has been added successfully.",
      });
      setShowAddressDialog(false);
      setAddressForm({
        label: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "India",
        phone: "",
        isDefault: false,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add address. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateAddress = async () => {
    if (!editingAddress) return;
    
    try {
      await updateAddress.mutateAsync({
        id: editingAddress._id,
        ...addressForm,
      });
      toast({
        title: "Address Updated",
        description: "Your address has been updated successfully.",
      });
      setEditingAddress(null);
      setShowAddressDialog(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update address. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await deleteAddress.mutateAsync(id);
      toast({
        title: "Address Deleted",
        description: "Your address has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete address. Please try again.",
        variant: "destructive",
      });
    }
  };

  const openEditAddress = (address: any) => {
    setEditingAddress(address);
    setAddressForm({
      label: address.label,
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      phone: address.phone,
      isDefault: address.isDefault,
    });
    setShowAddressDialog(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image size should be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'fashionfusion'); // Must be unsigned preset in Cloudinary
    
    try {
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/dfm7ifrkh/image/upload',
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Cloudinary error:', errorData);
        throw new Error(errorData.error?.message || 'Upload failed');
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error('Failed to upload image to Cloudinary');
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleImageUpload = async () => {
    setUploadingImage(true);

    try {
      let finalImageUrl = imageUrl;

      // If user selected a file, upload it
      if (selectedFile) {
        // Upload to Cloudinary (no API key required for unsigned uploads)
        finalImageUrl = await uploadToCloudinary(selectedFile);
        
        // Fallback to base64 if Cloudinary fails
        // finalImageUrl = await convertToBase64(selectedFile);
      }

      if (!finalImageUrl) {
        toast({
          title: "Error",
          description: "Please select an image or enter an image URL",
          variant: "destructive",
        });
        setUploadingImage(false);
        return;
      }

      const response = await fetch("/api/user/profile/image", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ profileImage: finalImageUrl }),
      });

      if (!response.ok) throw new Error("Failed to update image");

      toast({
        title: "Success!",
        description: "Profile image updated successfully",
      });
      
      setShowImageUpload(false);
      setProfileForm({ ...profileForm, profileImage: finalImageUrl });
      setSelectedFile(null);
      setPreviewUrl("");
      setImageUrl("");
      
      // Reload to show new image
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile image",
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const getOrderStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'shipped': return <Truck className="h-4 w-4 text-purple-500" />;
      case 'delivered': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled': return <X className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
            <div className="relative group">
              <div 
                className="cursor-pointer"
                onClick={() => setShowImageViewer(true)}
              >
                <Avatar className="h-24 w-24 sm:h-32 sm:w-32 ring-4 ring-primary/10 hover:ring-primary/30 transition-all">
                  <AvatarImage 
                    src={(user as any).profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.firstName}`}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-2xl">
                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              {/* Image Viewer Dialog */}
              <Dialog open={showImageViewer} onOpenChange={setShowImageViewer}>
                <DialogContent className="sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Profile Picture</DialogTitle>
                  </DialogHeader>
                  <div className="flex justify-center items-center p-4">
                    <img
                      src={(user as any).profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.firstName}`}
                      alt="Profile"
                      className="max-w-full max-h-[70vh] rounded-lg object-contain"
                    />
                  </div>
                </DialogContent>
              </Dialog>

              {/* Upload Dialog */}
              <Dialog open={showImageUpload} onOpenChange={setShowImageUpload}>
                <DialogTrigger asChild>
                  <Button
                    size="icon"
                    className="absolute bottom-0 right-0 rounded-full h-10 w-10 shadow-lg"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Update Profile Picture</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    {/* File Upload */}
                    <div>
                      <Label htmlFor="fileUpload" className="block mb-2">
                        Upload from Device
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="fileUpload"
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="cursor-pointer"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        JPG, PNG, GIF up to 5MB
                      </p>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                          Or
                        </span>
                      </div>
                    </div>

                    {/* URL Input */}
                    <div>
                      <Label htmlFor="imageUrl">Image URL</Label>
                      <Input
                        id="imageUrl"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        disabled={!!selectedFile}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Or paste a direct image URL
                      </p>
                    </div>

                    {/* Preview */}
                    {(previewUrl || imageUrl) && (
                      <div className="flex flex-col items-center gap-2 p-4 border rounded-lg bg-muted/30">
                        <p className="text-sm font-medium">Preview</p>
                        <Avatar className="h-32 w-32 ring-2 ring-primary/20">
                          <AvatarImage src={previewUrl || imageUrl} />
                          <AvatarFallback>Preview</AvatarFallback>
                        </Avatar>
                        {selectedFile && (
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground">
                              {selectedFile.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {(selectedFile.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button 
                        onClick={handleImageUpload} 
                        className="flex-1"
                        disabled={uploadingImage || (!selectedFile && !imageUrl)}
                      >
                        {uploadingImage ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Update Image
                          </>
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setShowImageUpload(false);
                          setSelectedFile(null);
                          setPreviewUrl("");
                          setImageUrl("");
                        }} 
                        className="flex-1"
                        disabled={uploadingImage}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold mb-1">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-muted-foreground">{user.email}</p>
              {(user as any).bio && (
                <p className="text-sm text-muted-foreground mt-2 max-w-md">
                  {(user as any).bio}
                </p>
              )}
              <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
                {user.role === 'admin' && (
                  <Badge variant="default">
                    <Shield className="h-3 w-3 mr-1" />
                    Admin
                  </Badge>
                )}
                <Badge variant="secondary">
                  <User className="h-3 w-3 mr-1" />
                  Member since {new Date((user as any).createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </Badge>
              </div>
            </div>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="mb-6 grid w-full grid-cols-5">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="addresses" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Addresses
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Orders
              </TabsTrigger>
              <TabsTrigger value="wishlist" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Wishlist
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Security
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Personal Information</CardTitle>
                  <Button
                    variant={isEditing ? "default" : "outline"}
                    onClick={() => {
                      if (isEditing) {
                        handleSaveProfile();
                      } else {
                        setIsEditing(true);
                      }
                    }}
                    disabled={updateProfile.isPending}
                  >
                    {updateProfile.isPending ? "Saving..." : isEditing ? "Save Changes" : "Edit Profile"}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profileForm.firstName}
                        onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profileForm.lastName}
                        onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user.email}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Tell us about yourself..."
                      rows={4}
                      className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {profileForm.bio.length}/200 characters
                    </p>
                  </div>

                  <Separator />

                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      Member since {new Date((user as any).createdAt || Date.now()).toLocaleDateString()}
                    </Badge>
                    {user.role === 'admin' && (
                      <Badge variant="default">
                        <Shield className="h-3 w-3 mr-1" />
                        Admin Account
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="addresses">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Saved Addresses</CardTitle>
                  <Dialog open={showAddressDialog} onOpenChange={setShowAddressDialog}>
                    <DialogTrigger asChild>
                      <Button onClick={() => {
                        setEditingAddress(null);
                        setAddressForm({
                          label: "",
                          street: "",
                          city: "",
                          state: "",
                          zipCode: "",
                          country: "India",
                          phone: "",
                          isDefault: false,
                        });
                      }}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Address
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {editingAddress ? "Edit Address" : "Add New Address"}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="addressLabel">Label</Label>
                          <Input
                            id="addressLabel"
                            value={addressForm.label}
                            onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                            placeholder="Home, Office, etc."
                          />
                        </div>
                        <div>
                          <Label htmlFor="street">Street Address</Label>
                          <Input
                            id="street"
                            value={addressForm.street}
                            onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                            placeholder="123 Main Street, Apt 4B"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="city">City</Label>
                            <Input
                              id="city"
                              value={addressForm.city}
                              onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                              placeholder="New York"
                            />
                          </div>
                          <div>
                            <Label htmlFor="state">State</Label>
                            <Input
                              id="state"
                              value={addressForm.state}
                              onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                              placeholder="NY"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="zipCode">ZIP Code</Label>
                            <Input
                              id="zipCode"
                              value={addressForm.zipCode}
                              onChange={(e) => setAddressForm({ ...addressForm, zipCode: e.target.value })}
                              placeholder="10001"
                            />
                          </div>
                          <div>
                            <Label htmlFor="country">Country</Label>
                            <Select
                              value={addressForm.country}
                              onValueChange={(value) => setAddressForm({ ...addressForm, country: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="India">India</SelectItem>
                                <SelectItem value="USA">United States</SelectItem>
                                <SelectItem value="UK">United Kingdom</SelectItem>
                                <SelectItem value="Canada">Canada</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="addressPhone">Phone</Label>
                          <Input
                            id="addressPhone"
                            value={addressForm.phone}
                            onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                            placeholder="(555) 123-4567"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="isDefault"
                            checked={addressForm.isDefault}
                            onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                          />
                          <Label htmlFor="isDefault">Set as default address</Label>
                        </div>
                        <div className="flex gap-2 pt-4">
                          <Button
                            onClick={editingAddress ? handleUpdateAddress : handleAddAddress}
                            disabled={addAddress.isPending || updateAddress.isPending}
                            className="flex-1"
                          >
                            {addAddress.isPending || updateAddress.isPending
                              ? "Saving..."
                              : editingAddress
                              ? "Update Address"
                              : "Add Address"}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setShowAddressDialog(false)}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {addresses.length === 0 ? (
                    <div className="text-center py-8">
                      <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No addresses saved</h3>
                      <p className="text-muted-foreground">Add your first address to get started</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {addresses.map((address) => (
                        <Card key={address._id} className="p-4 hover-elevate">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium">{address.label}</span>
                                {address.isDefault && (
                                  <Badge variant="secondary" className="text-xs">Default</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {address.street}<br />
                                {address.city}, {address.state} {address.zipCode}<br />
                                {address.country}<br />
                                Phone: {address.phone}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditAddress(address)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteAddress(address._id)}
                                disabled={deleteAddress.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                      <p className="text-muted-foreground mb-4">Start shopping to see your orders here</p>
                      <Link href="/">
                        <Button>Start Shopping</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <Card key={order._id} className="p-4">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium">Order #{order.orderNumber}</span>
                                <div className="flex items-center gap-1">
                                  {getOrderStatusIcon(order.status)}
                                  <span className="text-sm capitalize">{order.status}</span>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Placed on {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">${order.total.toFixed(2)}</p>
                              <p className="text-sm text-muted-foreground">
                                {order.items.length} item{order.items.length > 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                          
                          <div className="space-y-2 mb-4">
                            {order.items.slice(0, 2).map((item, index) => (
                              <div key={index} className="flex items-center gap-3">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-12 h-12 object-cover rounded"
                                />
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{item.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    Qty: {item.quantity} • Size: {item.size} • Color: {item.color}
                                  </p>
                                </div>
                                <p className="text-sm font-medium">${item.price.toFixed(2)}</p>
                              </div>
                            ))}
                            {order.items.length > 2 && (
                              <p className="text-sm text-muted-foreground">
                                +{order.items.length - 2} more items
                              </p>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                            {order.status === 'delivered' && (
                              <Button variant="outline" size="sm">
                                Reorder
                              </Button>
                            )}
                            {order.trackingNumber && (
                              <Button variant="outline" size="sm">
                                <Truck className="h-4 w-4 mr-2" />
                                Track Order
                              </Button>
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="wishlist">
              <Card>
                <CardHeader>
                  <CardTitle>My Wishlist</CardTitle>
                </CardHeader>
                <CardContent>
                  {wishlist.length === 0 ? (
                    <div className="text-center py-8">
                      <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Your wishlist is empty</h3>
                      <p className="text-muted-foreground mb-4">Save items you love for later</p>
                      <Link href="/">
                        <Button>Browse Products</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {wishlist.map((item) => (
                        <Card key={item._id} className="p-4 hover-elevate">
                          <div className="aspect-square mb-3 overflow-hidden rounded-lg bg-muted">
                            <img
                              src={item.images[0]}
                              alt={item.name}
                              className="h-full w-full object-cover transition-transform hover:scale-105"
                            />
                          </div>
                          <div className="space-y-2">
                            <h3 className="font-medium text-sm line-clamp-2">{item.name}</h3>
                            <div className="flex items-center gap-2">
                              <span className="font-bold">${item.price}</span>
                              {item.originalPrice && (
                                <span className="text-sm text-muted-foreground line-through">
                                  ${item.originalPrice}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="flex items-center">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <span
                                    key={i}
                                    className={`text-xs ${
                                      i < Math.floor(item.rating) ? 'text-yellow-400' : 'text-gray-300'
                                    }`}
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                              <span className="text-xs text-muted-foreground">
                                ({item.reviewCount})
                              </span>
                            </div>
                            <div className="flex gap-2 pt-2">
                              <Button size="sm" className="flex-1">
                                Add to Cart
                              </Button>
                              <Button variant="outline" size="sm">
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          <Settings className="h-4 w-4 mr-2" />
                          Change Password
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Change Password</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <Input
                              id="currentPassword"
                              type="password"
                              value={passwordForm.currentPassword}
                              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                              placeholder="Enter your current password"
                            />
                          </div>
                          <div>
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input
                              id="newPassword"
                              type="password"
                              value={passwordForm.newPassword}
                              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                              placeholder="Enter new password"
                            />
                          </div>
                          <div>
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <Input
                              id="confirmPassword"
                              type="password"
                              value={passwordForm.confirmPassword}
                              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                              placeholder="Confirm new password"
                            />
                          </div>
                          <div className="flex gap-2 pt-4">
                            <Button
                              onClick={handleChangePassword}
                              disabled={changePassword.isPending}
                              className="flex-1"
                            >
                              {changePassword.isPending ? "Changing..." : "Change Password"}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setShowPasswordDialog(false)}
                              className="flex-1"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Account Security</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Two-Factor Authentication</h4>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                      </div>
                      <Button variant="outline" disabled>
                        Coming Soon
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Login Notifications</h4>
                        <p className="text-sm text-muted-foreground">Get notified when someone logs into your account</p>
                      </div>
                      <Button variant="outline" disabled>
                        Coming Soon
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Account Activity</h4>
                        <p className="text-sm text-muted-foreground">View recent login activity and sessions</p>
                      </div>
                      <Button variant="outline" disabled>
                        Coming Soon
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg">
                      <div>
                        <h4 className="font-medium text-destructive">Delete Account</h4>
                        <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                      </div>
                      <Button variant="destructive" disabled>
                        Delete Account
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
