import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-card mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-semibold mb-4">Shop</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/category/men" className="hover:text-foreground transition-colors" data-testid="link-footer-men">Men</Link></li>
              <li><Link href="/category/women" className="hover:text-foreground transition-colors" data-testid="link-footer-women">Women</Link></li>
              <li><Link href="/category/kids" className="hover:text-foreground transition-colors" data-testid="link-footer-kids">Kids</Link></li>
              <li><Link href="/category/accessories" className="hover:text-foreground transition-colors" data-testid="link-footer-accessories">Accessories</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/contact" className="hover:text-foreground transition-colors" data-testid="link-footer-contact">Contact Us</Link></li>
              <li><Link href="/shipping" className="hover:text-foreground transition-colors" data-testid="link-footer-shipping">Shipping Info</Link></li>
              <li><Link href="/returns" className="hover:text-foreground transition-colors" data-testid="link-footer-returns">Returns</Link></li>
              <li><Link href="/faq" className="hover:text-foreground transition-colors" data-testid="link-footer-faq">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">About</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground transition-colors" data-testid="link-footer-about">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-foreground transition-colors" data-testid="link-footer-careers">Careers</Link></li>
              <li><Link href="/press" className="hover:text-foreground transition-colors" data-testid="link-footer-press">Press</Link></li>
              <li><Link href="/sustainability" className="hover:text-foreground transition-colors" data-testid="link-footer-sustainability">Sustainability</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Follow Us</h3>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-social-facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-social-twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-social-instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-social-youtube">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div className="flex flex-col items-center md:items-start">
            <p className="text-sm text-muted-foreground">
              © 2024 FashionFusion. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground/40 mt-1">
              Crafted with ❤️ by Rohit Singh
            </p>
          </div>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-foreground transition-colors" data-testid="link-footer-privacy">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors" data-testid="link-footer-terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
