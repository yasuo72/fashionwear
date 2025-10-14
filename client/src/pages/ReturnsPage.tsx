import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RotateCcw, Package, CheckCircle, XCircle } from "lucide-react";

export default function ReturnsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold mb-8">Returns & Exchange Policy</h1>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RotateCcw className="h-5 w-5" />
                  30-Day Return Policy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  We want you to be completely satisfied with your purchase. If you're not happy with your order, 
                  you can return it within 30 days of delivery for a full refund or exchange.
                </p>
                <div className="bg-primary/5 p-4 rounded-lg">
                  <p className="font-semibold mb-2">✓ Free Returns on All Orders</p>
                  <p className="text-sm text-muted-foreground">
                    We'll arrange a free pickup from your location. No questions asked!
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Eligible for Return
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Products must meet the following conditions:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Unused and in the same condition as received</li>
                  <li>In original packaging with all tags attached</li>
                  <li>Returned within 30 days of delivery</li>
                  <li>Include the original invoice</li>
                  <li>No signs of wear, washing, or alterations</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  Not Eligible for Return
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Innerwear, lingerie, and swimwear (for hygiene reasons)</li>
                  <li>Products marked as "Final Sale" or "Non-Returnable"</li>
                  <li>Customized or personalized items</li>
                  <li>Items damaged due to misuse or negligence</li>
                  <li>Products without original tags or packaging</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  How to Return
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Initiate Return</h4>
                      <p className="text-sm text-muted-foreground">
                        Log in to your account, go to "My Orders", and click "Return" on the item you wish to return.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Select Reason</h4>
                      <p className="text-sm text-muted-foreground">
                        Choose the reason for return and whether you want a refund or exchange.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Schedule Pickup</h4>
                      <p className="text-sm text-muted-foreground">
                        We'll arrange a free pickup from your address within 2-3 business days.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold">4</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Quality Check</h4>
                      <p className="text-sm text-muted-foreground">
                        Once we receive the item, we'll inspect it and process your refund/exchange within 7-10 business days.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Exchange Policy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Want a different size or color? We offer easy exchanges!
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Exchanges are subject to availability</li>
                  <li>If the desired item is unavailable, we'll process a refund</li>
                  <li>Exchange shipping is free</li>
                  <li>Same conditions apply as returns (unused, with tags, etc.)</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Refund Policy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Refunds will be processed to your original payment method:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li><strong>Credit/Debit Card:</strong> 7-10 business days</li>
                  <li><strong>UPI/Net Banking:</strong> 5-7 business days</li>
                  <li><strong>Cash on Delivery:</strong> Bank transfer within 7-10 business days</li>
                </ul>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                  <p className="text-sm">
                    <strong>Note:</strong> Shipping charges are non-refundable unless the return is due to our error 
                    (wrong item, defective product, etc.)
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Damaged or Defective Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  If you receive a damaged or defective item:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Contact us within 48 hours of delivery</li>
                  <li>Provide photos of the damaged/defective item</li>
                  <li>We'll arrange immediate pickup and replacement</li>
                  <li>Full refund including shipping charges if replacement is not available</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-primary/5">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Need Help with Returns?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Our customer support team is ready to assist you with any return or exchange queries.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 text-sm">
                  <span>📧 returns@fashionfusion.com</span>
                  <span className="hidden sm:inline">•</span>
                  <span>📞 +91 1800-123-4567</span>
                  <span className="hidden sm:inline">•</span>
                  <span>⏰ Mon-Sat: 9 AM - 9 PM</span>
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
