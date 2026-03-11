import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Youtube, Crown, Mail, Phone, MapPin, CreditCard } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative border-t border-border/20 bg-foreground text-background mt-auto">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top Section with Logo */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 pb-8 border-b border-background/10">
          <div className="flex items-center gap-3 mb-6 md:mb-0">
            <Crown className="w-8 h-8 text-amber-500" />
            <span className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              FashionHub
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a href="#" className="w-9 h-9 rounded-full bg-background/10 hover:bg-blue-500 flex items-center justify-center text-background/70 hover:text-white transition-all duration-300" data-testid="link-social-facebook">
              <Facebook className="h-4 w-4" />
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-background/10 hover:bg-sky-500 flex items-center justify-center text-background/70 hover:text-white transition-all duration-300" data-testid="link-social-twitter">
              <Twitter className="h-4 w-4" />
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-background/10 hover:bg-pink-500 flex items-center justify-center text-background/70 hover:text-white transition-all duration-300" data-testid="link-social-instagram">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-background/10 hover:bg-red-500 flex items-center justify-center text-background/70 hover:text-white transition-all duration-300" data-testid="link-social-youtube">
              <Youtube className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* 4-column grid on desktop, 2-column on tablet, 1-column on mobile */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-bold text-base mb-4 text-background">About FashionHub</h3>
            <p className="text-sm text-background/60 leading-relaxed mb-4">
              Your one-stop destination for premium fashion. Discover trending styles, exclusive deals, and quality products delivered to your doorstep.
            </p>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-bold text-base mb-4 text-background">Shop</h3>
            <ul className="space-y-2.5 text-sm text-background/60">
              <li><Link href="/category/men" className="hover:text-amber-400 transition-colors" data-testid="link-footer-men">Men</Link></li>
              <li><Link href="/category/women" className="hover:text-amber-400 transition-colors" data-testid="link-footer-women">Women</Link></li>
              <li><Link href="/category/kids" className="hover:text-amber-400 transition-colors" data-testid="link-footer-kids">Kids</Link></li>
              <li><Link href="/category/accessories" className="hover:text-amber-400 transition-colors" data-testid="link-footer-accessories">Accessories</Link></li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-bold text-base mb-4 text-background">Support</h3>
            <ul className="space-y-2.5 text-sm text-background/60">
              <li><Link href="/contact" className="hover:text-amber-400 transition-colors" data-testid="link-footer-contact">Contact Us</Link></li>
              <li><Link href="/shipping" className="hover:text-amber-400 transition-colors" data-testid="link-footer-shipping">Shipping Info</Link></li>
              <li><Link href="/returns" className="hover:text-amber-400 transition-colors" data-testid="link-footer-returns">Returns</Link></li>
              <li><Link href="/faq" className="hover:text-amber-400 transition-colors" data-testid="link-footer-faq">FAQ</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-base mb-4 text-background">Contact</h3>
            <ul className="space-y-2.5 text-sm text-background/60">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>support@fashionhub.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>+91 1800-123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Mumbai, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-background/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-background/50">
          <div className="flex flex-col items-center md:items-start">
            <p className="text-sm">
              © 2024 FashionHub. All rights reserved.
            </p>
            <p className="text-xs text-background/40 mt-1">
              Crafted with ❤️ by Rohit Singh
            </p>
          </div>
          
          {/* Payment icons */}
          <div className="flex items-center gap-4">
            <CreditCard className="w-8 h-5 text-background/40" />
            <span className="text-xs text-background/40">Visa • Mastercard • UPI • COD</span>
          </div>
          
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-amber-400 transition-colors" data-testid="link-footer-privacy">Privacy</Link>
            <Link href="/terms" className="hover:text-amber-400 transition-colors" data-testid="link-footer-terms">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
