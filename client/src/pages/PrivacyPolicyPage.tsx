import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          
          <Card className="p-8">
            <div className="prose prose-sm max-w-none space-y-6">
              <p className="text-muted-foreground">
                <strong>Last Updated:</strong> October 14, 2024
              </p>

              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
                <p className="text-muted-foreground">
                  Welcome to FashionFusion. We respect your privacy and are committed to protecting your personal data. 
                  This privacy policy will inform you about how we look after your personal data when you visit our website 
                  and tell you about your privacy rights.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
                <p className="text-muted-foreground mb-3">We may collect, use, store and transfer different kinds of personal data about you:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li><strong>Identity Data:</strong> First name, last name, username</li>
                  <li><strong>Contact Data:</strong> Email address, telephone numbers, billing and delivery addresses</li>
                  <li><strong>Financial Data:</strong> Payment card details (processed securely through payment providers)</li>
                  <li><strong>Transaction Data:</strong> Details about payments and products you have purchased</li>
                  <li><strong>Technical Data:</strong> IP address, browser type, device information</li>
                  <li><strong>Usage Data:</strong> Information about how you use our website and products</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
                <p className="text-muted-foreground mb-3">We use your personal data for the following purposes:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>To process and deliver your orders</li>
                  <li>To manage your account and provide customer support</li>
                  <li>To send you marketing communications (with your consent)</li>
                  <li>To improve our website, products, and services</li>
                  <li>To detect and prevent fraud</li>
                  <li>To comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
                <p className="text-muted-foreground">
                  We have implemented appropriate security measures to prevent your personal data from being accidentally lost, 
                  used, or accessed in an unauthorized way. We use SSL encryption for all transactions and store data on secure servers.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Data Retention</h2>
                <p className="text-muted-foreground">
                  We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for, 
                  including for legal, accounting, or reporting requirements.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Your Rights</h2>
                <p className="text-muted-foreground mb-3">Under data protection laws, you have rights including:</p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Right to access your personal data</li>
                  <li>Right to correct inaccurate data</li>
                  <li>Right to request deletion of your data</li>
                  <li>Right to object to processing of your data</li>
                  <li>Right to data portability</li>
                  <li>Right to withdraw consent</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">7. Cookies</h2>
                <p className="text-muted-foreground">
                  We use cookies to improve your browsing experience, analyze site traffic, and personalize content. 
                  You can control cookies through your browser settings.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">8. Third-Party Links</h2>
                <p className="text-muted-foreground">
                  Our website may include links to third-party websites. We are not responsible for the privacy practices 
                  of these external sites.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
                <p className="text-muted-foreground">
                  If you have any questions about this privacy policy or our privacy practices, please contact us at:<br />
                  Email: privacy@fashionfusion.com<br />
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
