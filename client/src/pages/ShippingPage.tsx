import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Package, MapPin, Clock, IndianRupee } from "lucide-react";

export default function ShippingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold mb-8">Shipping Information</h1>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping Methods & Costs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Standard Shipping</h3>
                    <p className="text-sm text-muted-foreground mb-2">₹830 (3-7 business days)</p>
                    <p className="text-sm text-muted-foreground">Available across India</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg bg-primary/5">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      Free Shipping
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">Popular</span>
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">On orders above ₹4,149</p>
                    <p className="text-sm text-muted-foreground">3-7 business days delivery</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Delivery Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Order Processing</h4>
                      <p className="text-sm text-muted-foreground">1-2 business days for order verification and packaging</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">In Transit</h4>
                      <p className="text-sm text-muted-foreground">2-5 business days depending on your location</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Delivered</h4>
                      <p className="text-sm text-muted-foreground">Signature required upon delivery</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Delivery Locations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  We currently deliver to all serviceable pin codes across India. Enter your pin code at checkout to check availability.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Metro Cities</h4>
                    <p className="text-sm text-muted-foreground">Delivery within 3-4 business days</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Other Cities</h4>
                    <p className="text-sm text-muted-foreground">Delivery within 5-7 business days</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Once your order is shipped, you'll receive a tracking number via email and SMS. You can track your order:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Through your account dashboard under "My Orders"</li>
                  <li>Using the tracking link in your shipping confirmation email</li>
                  <li>By contacting our customer support with your order number</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Important Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Delivery times are estimates and may vary during peak seasons or holidays</li>
                  <li>Orders placed on weekends or holidays will be processed on the next business day</li>
                  <li>Someone must be present to receive the delivery and sign for it</li>
                  <li>We are not responsible for delays caused by incorrect shipping addresses</li>
                  <li>For international shipping inquiries, please contact our customer support</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-primary/5">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Need Help?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Have questions about shipping? Our customer support team is here to help!
                </p>
                <div className="flex flex-col sm:flex-row gap-2 text-sm">
                  <span>📧 support@fashionfusion.com</span>
                  <span className="hidden sm:inline">•</span>
                  <span>📞 +91 1800-123-4567</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
