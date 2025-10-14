import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Award, TrendingUp, Sparkles, Shield } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl font-bold mb-6">About FashionFusion</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Your destination for the latest trends and timeless classics. We bring you fashion that speaks to your style.
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Founded in 2020, FashionFusion was born from a simple idea: fashion should be accessible, 
                    affordable, and exciting for everyone. What started as a small online boutique has grown into 
                    a thriving fashion destination serving thousands of customers across India.
                  </p>
                  <p>
                    We believe that great style shouldn't come with a hefty price tag. That's why we work directly 
                    with manufacturers and designers to bring you the latest trends at prices that won't break the bank.
                  </p>
                  <p>
                    Today, we're proud to offer a curated collection of clothing, accessories, and footwear for men, 
                    women, and kids. Every piece is carefully selected to ensure quality, style, and value.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-2xl flex items-center justify-center">
                  <Sparkles className="h-32 w-32 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Values</h2>
              <p className="text-lg text-muted-foreground">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Customer First</h3>
                  <p className="text-muted-foreground">
                    Your satisfaction is our top priority. We go above and beyond to ensure you have 
                    an amazing shopping experience.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Quality Assured</h3>
                  <p className="text-muted-foreground">
                    Every product is carefully inspected to meet our high standards. We never compromise 
                    on quality.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Always Trending</h3>
                  <p className="text-muted-foreground">
                    We stay ahead of the curve, bringing you the latest fashion trends from around the world.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Secure Shopping</h3>
                  <p className="text-muted-foreground">
                    Your data and payments are protected with industry-leading security measures.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Community Driven</h3>
                  <p className="text-muted-foreground">
                    We listen to our customers and constantly evolve based on your feedback and needs.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Sustainable Fashion</h3>
                  <p className="text-muted-foreground">
                    We're committed to reducing our environmental impact and promoting sustainable practices.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">50K+</div>
                <p className="text-muted-foreground">Happy Customers</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">10K+</div>
                <p className="text-muted-foreground">Products</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">500+</div>
                <p className="text-muted-foreground">Brands</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">100+</div>
                <p className="text-muted-foreground">Cities Served</p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-8">
                To democratize fashion by making the latest trends accessible to everyone, regardless of budget. 
                We believe everyone deserves to look and feel their best.
              </p>
              <div className="bg-primary/5 p-8 rounded-2xl">
                <p className="text-xl font-semibold mb-4">
                  "Fashion is not just about clothes. It's about confidence, self-expression, and feeling amazing every day."
                </p>
                <p className="text-muted-foreground">- FashionFusion Team</p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose FashionFusion?</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="flex gap-4">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🚚</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Free Shipping</h3>
                  <p className="text-sm text-muted-foreground">
                    On orders above ₹4,149 across India
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">30-Day Returns</h3>
                  <p className="text-sm text-muted-foreground">
                    Easy returns and exchanges, no questions asked
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Secure Payments</h3>
                  <p className="text-sm text-muted-foreground">
                    Multiple payment options with 100% security
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">24/7 Support</h3>
                  <p className="text-sm text-muted-foreground">
                    Our team is always here to help you
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Verified Products</h3>
                  <p className="text-sm text-muted-foreground">
                    100% authentic products guaranteed
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Regular Updates</h3>
                  <p className="text-sm text-muted-foreground">
                    New arrivals added every week
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-primary to-purple-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Join the FashionFusion Family</h2>
            <p className="text-lg mb-8 opacity-90">
              Start your style journey with us today. Discover fashion that fits your life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/" className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Shop Now
              </a>
              <a href="/contact" className="bg-transparent border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
                Contact Us
              </a>
            </div>
          </div>
        </section>

        {/* Hidden Developer Credit */}
        <div className="opacity-0 h-0 overflow-hidden" aria-hidden="true">
          Developed by Rohit Singh | GitHub: @yasuo72 | https://github.com/yasuo72
        </div>
      </main>

      <Footer />
    </div>
  );
}
