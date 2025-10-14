import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Check, Plus } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useAddresses, useCreateAddress } from "@/hooks/useAddress";
import { useCreateOrder } from "@/hooks/useOrders";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { RazorpayPayment } from "@/components/RazorpayPayment";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function CheckoutPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { data: authData } = useAuth();
  const { data: cartData, isLoading: cartLoading } = useCart();
  const { data: addressData, isLoading: addressLoading } = useAddresses();
  const createOrder = useCreateOrder();
  
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  
  // Card payment form state
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });
  
  // Add new address form state
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
    phone: "",
    isDefault: false,
  });
  const createAddress = useCreateAddress();

  const user = authData?.user;
  const cart = cartData?.cart;
  const cartItems = cart?.items || [];
  const addresses = addressData?.addresses || [];

  // Calculate totals
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal >= 499 ? 0 : 40;
  const tax = subtotal * 0.08;
  const discount = 0;
  const total = subtotal + shipping + tax - discount;

  // Set default selected address
  if (!selectedAddressId && addresses.length > 0) {
    const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
    setSelectedAddressId(defaultAddr._id);
  }

  // Card validation functions
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.slice(0, 19); // Max 16 digits + 3 spaces
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const validateCardDetails = () => {
    const cardNumberClean = cardDetails.cardNumber.replace(/\s/g, '');
    
    if (cardNumberClean.length !== 16) {
      toast({
        title: "Invalid Card Number",
        description: "Card number must be 16 digits",
        variant: "destructive",
      });
      return false;
    }

    if (!cardDetails.cardName.trim()) {
      toast({
        title: "Invalid Card Name",
        description: "Please enter the name on card",
        variant: "destructive",
      });
      return false;
    }

    const expiryParts = cardDetails.expiryDate.split('/');
    if (expiryParts.length !== 2 || expiryParts[0].length !== 2 || expiryParts[1].length !== 2) {
      toast({
        title: "Invalid Expiry Date",
        description: "Please enter expiry date in MM/YY format",
        variant: "destructive",
      });
      return false;
    }

    const month = parseInt(expiryParts[0]);
    const year = parseInt('20' + expiryParts[1]);
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    if (month < 1 || month > 12) {
      toast({
        title: "Invalid Month",
        description: "Month must be between 01 and 12",
        variant: "destructive",
      });
      return false;
    }

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      toast({
        title: "Card Expired",
        description: "This card has expired",
        variant: "destructive",
      });
      return false;
    }

    if (cardDetails.cvv.length !== 3) {
      toast({
        title: "Invalid CVV",
        description: "CVV must be 3 digits",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleAddAddress = async () => {
    if (!newAddress.label || !newAddress.street || !newAddress.city || !newAddress.state || !newAddress.zipCode || !newAddress.phone) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      await createAddress.mutateAsync(newAddress);
      toast({
        title: "Success",
        description: "Address added successfully",
      });
      setShowAddressDialog(false);
      setNewAddress({
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
        description: "Failed to add address",
        variant: "destructive",
      });
    }
  };

  const handleRazorpaySuccess = async (razorpayDetails: any) => {
    setPaymentDetails(razorpayDetails);
    await createOrderWithPayment(razorpayDetails);
  };

  const handleRazorpayError = (error: any) => {
    toast({
      title: "Payment Failed",
      description: error.message || "Payment was not completed",
      variant: "destructive",
    });
    setIsPlacingOrder(false);
  };

  const createOrderWithPayment = async (razorpayDetails?: any) => {
    try {
      const selectedAddress = addresses.find(a => a._id === selectedAddressId);
      if (!selectedAddress) {
        throw new Error("Selected address not found");
      }

      const orderData = {
        items: cartItems.map(item => ({
          productId: item.productId._id,
          name: item.productId.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          image: item.productId.images[0],
        })),
        shippingAddress: {
          label: selectedAddress.label,
          street: selectedAddress.street,
          city: selectedAddress.city,
          state: selectedAddress.state,
          zipCode: selectedAddress.zipCode,
          country: selectedAddress.country,
          phone: selectedAddress.phone,
        },
        paymentMethod,
        ...(razorpayDetails && {
          razorpayOrderId: razorpayDetails.razorpayOrderId,
          razorpayPaymentId: razorpayDetails.razorpayPaymentId,
          razorpaySignature: razorpayDetails.razorpaySignature,
        }),
        subtotal,
        shipping,
        tax,
        discount,
        total,
      };

      const result = await createOrder.mutateAsync(orderData);
      
      toast({
        title: "Success!",
        description: `Order ${result.order.orderNumber} placed successfully!`,
      });

      setLocation("/orders");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to place order",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast({
        title: "Error",
        description: "Please select a delivery address",
        variant: "destructive",
      });
      return;
    }

    if (cartItems.length === 0) {
      toast({
        title: "Error",
        description: "Your cart is empty",
        variant: "destructive",
      });
      return;
    }

    // For Razorpay, the payment button will handle the flow
    if (paymentMethod === "razorpay") {
      return; // RazorpayPayment component handles this
    }

    // Validate card details if card payment is selected
    if (paymentMethod === "card") {
      if (!validateCardDetails()) {
        return;
      }
    }

    setIsPlacingOrder(true);

    try {
      // Simulate card payment processing
      if (paymentMethod === "card") {
        toast({
          title: "Processing Payment",
          description: "Please wait while we process your card payment...",
        });
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        const paymentSuccess = true;
        
        if (!paymentSuccess) {
          throw new Error("Payment failed. Please check your card details and try again.");
        }
      }

      await createOrderWithPayment();
      
      if (paymentMethod === "card") {
        setCardDetails({
          cardNumber: "",
          cardName: "",
          expiryDate: "",
          cvv: "",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to place order",
        variant: "destructive",
      });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
            <p className="text-muted-foreground mb-6">You need to be logged in to checkout.</p>
            <Link href="/login">
              <Button>Sign In</Button>
            </Link>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (cartLoading || addressLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Add some items to checkout.</p>
            <Link href="/">
              <Button>Continue Shopping</Button>
            </Link>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                  <Check className="h-5 w-5" />
                </div>
                <span className="font-medium">Cart</span>
              </div>
              <Separator className="w-16" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                  2
                </div>
                <span className="font-medium">Checkout</span>
              </div>
              <Separator className="w-16" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
                  3
                </div>
                <span className="text-muted-foreground">Complete</span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
                
                {addresses.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No addresses found. Please add one.</p>
                  </div>
                ) : (
                  <RadioGroup value={selectedAddressId} onValueChange={setSelectedAddressId}>
                    <div className="space-y-3">
                      {addresses.map((address) => (
                        <div key={address._id} className="flex items-start space-x-3 p-4 border rounded-lg hover-elevate cursor-pointer">
                          <RadioGroupItem value={address._id} id={`address-${address._id}`} />
                          <Label htmlFor={`address-${address._id}`} className="flex-1 cursor-pointer">
                            <div className="font-medium">{address.label}</div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {address.street}<br />
                              {address.city}, {address.state} {address.zipCode}<br />
                              {address.country}<br />
                              Phone: {address.phone}
                            </div>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                )}

                <Dialog open={showAddressDialog} onOpenChange={setShowAddressDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full mt-4" data-testid="button-add-address">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Address
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Address</DialogTitle>
                      <DialogDescription>
                        Enter your delivery address details below.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="label">Label (e.g., Home, Office)</Label>
                        <Input
                          id="label"
                          value={newAddress.label}
                          onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                          placeholder="Home"
                        />
                      </div>
                      <div>
                        <Label htmlFor="street">Street Address</Label>
                        <Input
                          id="street"
                          value={newAddress.street}
                          onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                          placeholder="123 Main Street, Apt 4B"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            value={newAddress.city}
                            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                            placeholder="Mumbai"
                          />
                        </div>
                        <div>
                          <Label htmlFor="state">State</Label>
                          <Input
                            id="state"
                            value={newAddress.state}
                            onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                            placeholder="Maharashtra"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="zipCode">ZIP Code</Label>
                          <Input
                            id="zipCode"
                            value={newAddress.zipCode}
                            onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                            placeholder="400001"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            value={newAddress.phone}
                            onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                            placeholder="+91 98765 43210"
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowAddressDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddAddress} disabled={createAddress.isPending}>
                        {createAddress.isPending ? "Adding..." : "Add Address"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover-elevate cursor-pointer">
                      <RadioGroupItem value="razorpay" id="payment-razorpay" data-testid="radio-payment-razorpay" />
                      <Label htmlFor="payment-razorpay" className="flex-1 cursor-pointer">
                        Razorpay (UPI, Cards, Netbanking)
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover-elevate cursor-pointer">
                      <RadioGroupItem value="card" id="payment-card" data-testid="radio-payment-card" />
                      <Label htmlFor="payment-card" className="flex-1 cursor-pointer">
                        Credit/Debit Card
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover-elevate cursor-pointer">
                      <RadioGroupItem value="cod" id="payment-cod" data-testid="radio-payment-cod" />
                      <Label htmlFor="payment-cod" className="flex-1 cursor-pointer">
                        Cash on Delivery
                      </Label>
                    </div>
                  </div>
                </RadioGroup>

                {paymentMethod === "card" && (
                  <div className="mt-6 space-y-4">
                    <div>
                      <Label htmlFor="card-name">Name on Card</Label>
                      <Input 
                        id="card-name" 
                        placeholder="John Doe" 
                        value={cardDetails.cardName}
                        onChange={(e) => setCardDetails({ ...cardDetails, cardName: e.target.value })}
                        data-testid="input-card-name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="card-number">Card Number</Label>
                      <Input 
                        id="card-number" 
                        placeholder="1234 5678 9012 3456" 
                        value={cardDetails.cardNumber}
                        onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: formatCardNumber(e.target.value) })}
                        maxLength={19}
                        data-testid="input-card-number"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input 
                          id="expiry" 
                          placeholder="MM/YY" 
                          value={cardDetails.expiryDate}
                          onChange={(e) => setCardDetails({ ...cardDetails, expiryDate: formatExpiryDate(e.target.value) })}
                          maxLength={5}
                          data-testid="input-expiry"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input 
                          id="cvv" 
                          type="password"
                          placeholder="123" 
                          value={cardDetails.cvv}
                          onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                          maxLength={3}
                          data-testid="input-cvv"
                        />
                      </div>
                    </div>
                    <div className="p-3 bg-muted rounded-lg text-sm text-muted-foreground">
                      <p className="flex items-center gap-2">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Your payment information is secure and encrypted
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal ({cartItems.length} items)</span>
                    <span className="font-medium">₹{subtotal.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">₹{shipping.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium">₹{tax.toFixed(0)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-chart-3">
                      <span>Discount</span>
                      <span className="font-medium">-₹{discount.toFixed(0)}</span>
                    </div>
                  )}
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between text-lg font-semibold mb-6">
                  <span>Total</span>
                  <span data-testid="text-order-total">₹{total.toFixed(0)}</span>
                </div>

                {paymentMethod === "razorpay" ? (
                  <RazorpayPayment
                    amount={total}
                    orderData={{
                      shippingAddress: addresses.find(a => a._id === selectedAddressId),
                      items: cartItems
                    }}
                    onSuccess={handleRazorpaySuccess}
                    onError={handleRazorpayError}
                  />
                ) : (
                  <Button 
                    className="w-full" 
                    size="lg" 
                    data-testid="button-place-order"
                    onClick={handlePlaceOrder}
                    disabled={isPlacingOrder || !selectedAddressId || cartItems.length === 0}
                  >
                    {isPlacingOrder ? "Placing Order..." : "Place Order"}
                  </Button>
                )}

                <p className="text-xs text-muted-foreground text-center mt-4">
                  By placing this order, you agree to our Terms & Conditions
                </p>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
