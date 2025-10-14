import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold mb-8">Terms & Conditions</h1>
          
          <Card className="p-8">
            <div className="prose prose-sm max-w-none space-y-6">
              <p className="text-muted-foreground">
                <strong>Last Updated:</strong> October 14, 2024
              </p>

              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
                <p className="text-muted-foreground">
                  By accessing and using FashionFusion's website and services, you agree to be bound by these Terms and Conditions. 
                  If you disagree with any part of these terms, you may not access our services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. Use of Our Service</h2>
                <p className="text-muted-foreground mb-3">You agree to use our service only for lawful purposes. You must not:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Use our service in any way that violates applicable laws or regulations</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Transmit any viruses, malware, or harmful code</li>
                  <li>Engage in any activity that interferes with or disrupts our services</li>
                  <li>Impersonate any person or entity</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. Account Registration</h2>
                <p className="text-muted-foreground">
                  To access certain features, you may need to create an account. You are responsible for maintaining the 
                  confidentiality of your account credentials and for all activities under your account.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Product Information</h2>
                <p className="text-muted-foreground">
                  We strive to provide accurate product descriptions, images, and pricing. However, we do not warrant that 
                  product descriptions or other content is accurate, complete, or error-free. We reserve the right to correct 
                  any errors and update information at any time.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Pricing and Payment</h2>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>All prices are in Indian Rupees (₹) unless otherwise stated</li>
                  <li>Prices are subject to change without notice</li>
                  <li>We accept credit cards, debit cards, UPI, and cash on delivery</li>
                  <li>Payment must be received before order processing</li>
                  <li>We reserve the right to refuse or cancel any order</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Shipping and Delivery</h2>
                <p className="text-muted-foreground">
                  Delivery times are estimates and not guaranteed. We are not liable for delays caused by shipping carriers 
                  or circumstances beyond our control. Risk of loss passes to you upon delivery.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">7. Returns and Refunds</h2>
                <p className="text-muted-foreground">
                  We offer a 30-day return policy on most items. Products must be unused, in original packaging, and with tags attached. 
                  Refunds will be processed within 7-10 business days of receiving the returned item. Please see our Returns Policy for full details.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">8. Intellectual Property</h2>
                <p className="text-muted-foreground">
                  All content on this website, including text, graphics, logos, images, and software, is the property of FashionFusion 
                  and protected by copyright and trademark laws. You may not reproduce, distribute, or create derivative works without our permission.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">9. Limitation of Liability</h2>
                <p className="text-muted-foreground">
                  FashionFusion shall not be liable for any indirect, incidental, special, or consequential damages arising from 
                  your use of our services or products. Our total liability shall not exceed the amount paid for the product in question.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">10. Governing Law</h2>
                <p className="text-muted-foreground">
                  These Terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be 
                  subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">11. Changes to Terms</h2>
                <p className="text-muted-foreground">
                  We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. 
                  Your continued use of our services constitutes acceptance of the modified terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">12. Contact Information</h2>
                <p className="text-muted-foreground">
                  For questions about these Terms and Conditions, please contact us at:<br />
                  Email: legal@fashionfusion.com<br />
                  Phone: +91 1800-123-4567
                </p>
              </section>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
