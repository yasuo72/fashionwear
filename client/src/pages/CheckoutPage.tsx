import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Check } from "lucide-react";

export default function CheckoutPage() {
  const [selectedAddress, setSelectedAddress] = useState("1");
  const [paymentMethod, setPaymentMethod] = useState("card");

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
                
                <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 p-4 border rounded-lg hover-elevate cursor-pointer">
                      <RadioGroupItem value="1" id="address-1" data-testid="radio-address-1" />
                      <Label htmlFor="address-1" className="flex-1 cursor-pointer">
                        <div className="font-medium">Home</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          123 Main Street, Apt 4B<br />
                          New York, NY 10001<br />
                          Phone: (555) 123-4567
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-start space-x-3 p-4 border rounded-lg hover-elevate cursor-pointer">
                      <RadioGroupItem value="2" id="address-2" data-testid="radio-address-2" />
                      <Label htmlFor="address-2" className="flex-1 cursor-pointer">
                        <div className="font-medium">Office</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          456 Business Ave, Suite 200<br />
                          New York, NY 10002<br />
                          Phone: (555) 987-6543
                        </div>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>

                <Button variant="outline" className="w-full mt-4" data-testid="button-add-address">
                  Add New Address
                </Button>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover-elevate cursor-pointer">
                      <RadioGroupItem value="card" id="payment-card" data-testid="radio-payment-card" />
                      <Label htmlFor="payment-card" className="flex-1 cursor-pointer">
                        Credit/Debit Card
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover-elevate cursor-pointer">
                      <RadioGroupItem value="upi" id="payment-upi" data-testid="radio-payment-upi" />
                      <Label htmlFor="payment-upi" className="flex-1 cursor-pointer">
                        UPI Payment
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
                      <Label htmlFor="card-number">Card Number</Label>
                      <Input id="card-number" placeholder="1234 5678 9012 3456" data-testid="input-card-number" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" data-testid="input-expiry" />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" data-testid="input-cvv" />
                      </div>
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
                    <span className="text-muted-foreground">Subtotal (3 items)</span>
                    <span className="font-medium">$189.96</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">$10.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium">$15.00</span>
                  </div>
                  <div className="flex justify-between text-sm text-chart-3">
                    <span>Discount</span>
                    <span className="font-medium">-$20.00</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between text-lg font-semibold mb-6">
                  <span>Total</span>
                  <span data-testid="text-order-total">$194.96</span>
                </div>

                <Button className="w-full" size="lg" data-testid="button-place-order">
                  Place Order
                </Button>

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
