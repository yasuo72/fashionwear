import { Navbar } from "@/components/Navbar";
import { CartItem } from "@/components/CartItem";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";

const cartItems = [
  { id: "1", name: "Classic Cotton T-Shirt", price: 29.99, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop", size: "M", color: "Blue", initialQuantity: 2 },
  { id: "2", name: "Denim Jeans", price: 69.99, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop", size: "32", color: "Dark Blue", initialQuantity: 1 },
  { id: "3", name: "Summer Dress", price: 59.99, image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=200&h=200&fit=crop", size: "S", color: "Floral", initialQuantity: 1 },
];

export default function CartPage() {
  const subtotal = 189.96;
  const shipping = 10.00;
  const tax = 15.00;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <CartItem key={item.id} {...item} />
              ))}
            </div>

            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium" data-testid="text-subtotal">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium" data-testid="text-shipping">${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium" data-testid="text-tax">${tax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span data-testid="text-total">${total.toFixed(2)}</span>
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
        </div>
      </main>

      <Footer />
    </div>
  );
}
