import { Navbar } from "@/components/Navbar";
import { CartItem } from "@/components/CartItem";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { useCart, useClearCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

export default function CartPage() {
  const { data: cartData, isLoading } = useCart();
  const { data: authData } = useAuth();
  const clearCart = useClearCart();
  const [couponCode, setCouponCode] = useState("");

  const user = authData?.user;
  const cart = cartData?.cart;
  const cartItems = cart?.items || [];

  // Calculate totals
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal >= 499 ? 0 : 40; // Free shipping over ₹499
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
            <p className="text-muted-foreground mb-6">You need to be logged in to view your cart.</p>
            <Link href="/login">
              <Button>Sign In</Button>
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
          <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading cart...</p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">Add some items to get started!</p>
              <Link href="/">
                <Button>Continue Shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <CartItem 
                    key={item._id} 
                    id={item._id}
                    name={item.productId.name}
                    price={item.price}
                    image={item.productId.images[0]}
                    size={item.size}
                    color={item.color}
                    initialQuantity={item.quantity}
                  />
                ))}
                
                <div className="flex justify-between items-center pt-4 border-t">
                  <Button 
                    variant="outline" 
                    onClick={() => clearCart.mutate()}
                    disabled={clearCart.isPending}
                  >
                    {clearCart.isPending ? "Clearing..." : "Clear Cart"}
                  </Button>
                </div>
              </div>

            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium" data-testid="text-subtotal">₹{subtotal.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium" data-testid="text-shipping">₹{shipping.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium" data-testid="text-tax">₹{tax.toFixed(0)}</span>
                  </div>
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span data-testid="text-total">₹{total.toFixed(0)}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <Input placeholder="Enter coupon code" data-testid="input-coupon" />
                  <Button variant="outline" className="w-full" data-testid="button-apply-coupon">
                    Apply Coupon
                  </Button>
                </div>

                <Link href="/checkout">
                  <Button className="w-full" size="lg" data-testid="button-checkout">
                    Proceed to Checkout
                  </Button>
                </Link>

                <Link href="/">
                  <Button variant="ghost" className="w-full mt-3" data-testid="button-continue-shopping">
                    Continue Shopping
                  </Button>
                </Link>
              </Card>
            </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
