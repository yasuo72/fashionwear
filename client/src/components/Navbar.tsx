import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Search, ShoppingCart, Heart, User, Zap, Crown, Menu, X, ChevronDown, TrendingUp, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth, useLogout } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";

export function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [, setLocation] = useLocation();
  
  const { data: authData } = useAuth();
  const { data: cartData } = useCart();
  const logout = useLogout();
  
  const user = authData?.user;
  const cartCount = cartData?.cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;
  const wishlistCount = 0; // TODO: Implement wishlist count

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 w-full transition-all duration-500 ${
      scrolled 
        ? 'bg-background/95 backdrop-blur-2xl shadow-2xl shadow-black/10 border-b border-border/80' 
        : 'bg-background/80 backdrop-blur-xl border-b border-border/50'
    }`}>
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white py-1.5 px-4 text-center text-xs font-semibold">
        <div className="flex items-center justify-center gap-2">
          <Zap className="w-3 h-3 animate-pulse" />
          <span>Free Shipping on Orders Above ₹499 | Use Code: FASHION20 for 20% Off</span>
          <Zap className="w-3 h-3 animate-pulse" />
        </div>
      </div>
      
      <div className="w-full overflow-x-auto scrollbar-hide">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center group flex-shrink-0">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-amber-500/30 to-orange-500/30 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              <div className="relative flex items-center gap-2 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 px-3 py-1.5 rounded-xl border border-amber-500/20">
                <Crown className="w-6 h-6 sm:w-7 sm:h-7 text-amber-500" />
                <span className="text-xl sm:text-2xl font-black bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent">FashionHub</span>
              </div>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-6">
            <form onSubmit={handleSearch} className="relative w-full group">
              <div className={`absolute -inset-1 rounded-xl transition-all duration-300 ${isSearchFocused ? 'bg-gradient-to-r from-amber-500/30 to-orange-500/30 blur-md' : 'bg-transparent'}`}></div>
              <div className="relative flex items-center">
                <div className="absolute left-4 flex items-center gap-3">
                  <Search className={`h-5 w-5 transition-colors duration-300 ${isSearchFocused ? 'text-amber-500' : 'text-muted-foreground'}`} />
                </div>
                <Input
                  type="search"
                  placeholder="Search for products, brands, categories..."
                  className={`pl-12 pr-4 w-full h-12 bg-background/80 border-2 transition-all duration-300 text-sm ${isSearchFocused ? 'border-amber-500/50 ring-4 ring-amber-500/10' : 'border-border hover:border-amber-500/30'}`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                  data-testid="input-search"
                />
                <Button 
                  type="submit"
                  size="sm"
                  className="absolute right-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-orange-500/30"
                >
                  Search
                </Button>
              </div>
            </form>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Mobile Menu Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden h-10 w-10 hover:bg-amber-500/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            
            {/* Wishlist */}
            <Link href="/wishlist" className="flex-shrink-0">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative group hover:bg-amber-500/10 hover:scale-110 transition-all duration-300 h-10 w-10 rounded-xl" 
                data-testid="button-wishlist"
              >
                <Heart className="h-5 w-5 text-rose-500 group-hover:fill-rose-500 transition-all duration-300" />
                {wishlistCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] font-bold bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/40 animate-pulse" data-testid="badge-wishlist-count">
                    {wishlistCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Cart */}
            <Link href="/cart" className="flex-shrink-0">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative group hover:bg-amber-500/10 hover:scale-110 transition-all duration-300 h-10 w-10 rounded-xl" 
                data-testid="button-cart"
              >
                <ShoppingCart className="h-5 w-5 text-amber-500 group-hover:text-orange-500 transition-colors duration-300" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-orange-500/40 animate-pulse" data-testid="badge-cart-count">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-xl hover:scale-110 transition-all duration-300 flex-shrink-0 hover:bg-amber-500/10" data-testid="button-user">
                    <Avatar className="h-9 w-9 ring-2 ring-amber-500/30 hover:ring-amber-500/60 hover:ring-4 transition-all duration-300">
                      <AvatarImage 
                        src={(user as any).profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.firstName}`} 
                        alt={`${user.firstName} ${user.lastName}`}
                        className="object-cover"
                      />
                      <AvatarFallback className="text-xs bg-gradient-to-br from-amber-500 to-orange-500 text-white font-bold">
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 p-2 rounded-xl shadow-2xl shadow-orange-500/10 border-amber-500/20">
                  <DropdownMenuLabel className="font-normal p-3 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 mb-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 ring-2 ring-amber-500/30">
                        <AvatarImage 
                          src={(user as any).profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.firstName}`}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-500 text-white font-bold">
                          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-bold">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border/50" />
                  <DropdownMenuItem asChild className="rounded-lg hover:bg-amber-500/10 cursor-pointer p-2">
                    <Link href="/profile" data-testid="link-profile" className="flex items-center gap-2">
                      <User className="w-4 h-4 text-amber-500" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-lg hover:bg-amber-500/10 cursor-pointer p-2">
                    <Link href="/orders" data-testid="link-orders" className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-amber-500" />
                      Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-lg hover:bg-amber-500/10 cursor-pointer p-2">
                    <Link href="/wishlist" data-testid="link-wishlist" className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-rose-500" />
                      Wishlist
                    </Link>
                  </DropdownMenuItem>
                  {user.role === 'admin' && (
                    <>
                      <DropdownMenuSeparator className="bg-border/50" />
                      <DropdownMenuItem asChild className="rounded-lg hover:bg-amber-500/10 cursor-pointer p-2">
                        <Link href="/admin" data-testid="link-admin" className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-amber-500" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator className="bg-border/50" />
                  <DropdownMenuItem 
                    onClick={() => logout.mutate()}
                    data-testid="button-logout"
                    className="rounded-lg hover:bg-rose-500/10 cursor-pointer p-2 text-rose-500 focus:text-rose-500"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                asChild 
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 hover:scale-105 transition-all duration-300 text-sm h-10 px-5 rounded-xl flex-shrink-0"
              >
                <Link href="/login" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>Login</span>
                </Link>
              </Button>
            )}

            <div className="flex-shrink-0">
              <ThemeToggle />
            </div>
          </div>
        </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${mobileMenuOpen ? 'max-h-96' : 'max-h-0'}`}>
          <div className="px-4 py-4 space-y-3 bg-muted/30 backdrop-blur-sm">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-10 w-full bg-background border-border"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            
            {/* Mobile Nav Links */}
            <div className="grid grid-cols-3 gap-2">
              <Link href="/category/men" className="flex flex-col items-center gap-1 p-3 rounded-xl bg-card hover:bg-amber-500/10 transition-all">
                <User className="w-5 h-5 text-amber-500" />
                <span className="text-xs font-medium">Men</span>
              </Link>
              <Link href="/category/women" className="flex flex-col items-center gap-1 p-3 rounded-xl bg-card hover:bg-rose-500/10 transition-all">
                <Heart className="w-5 h-5 text-rose-500" />
                <span className="text-xs font-medium">Women</span>
              </Link>
              <Link href="/category/kids" className="flex flex-col items-center gap-1 p-3 rounded-xl bg-card hover:bg-violet-500/10 transition-all">
                <User className="w-5 h-5 text-violet-500" />
                <span className="text-xs font-medium">Kids</span>
              </Link>
            </div>
            
            <Link 
              href="/sales" 
              className="flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold shadow-lg shadow-orange-500/30"
            >
              <Zap className="w-4 h-4" />
              Sale - Up to 50% Off
            </Link>
          </div>
        </div>

        {/* Desktop Navigation Bar */}
        <div className={`border-t border-border/50 bg-gradient-to-r from-background via-muted/30 to-background hidden md:block backdrop-blur-sm transition-all duration-300 ${scrolled ? 'shadow-lg' : ''}`}>
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex h-14 items-center justify-center gap-10 text-sm font-semibold">
              <Link 
                href="/category/men" 
                className="relative group flex items-center gap-1.5 px-4 py-2 rounded-lg hover:bg-amber-500/10 transition-all duration-300" 
                data-testid="link-category-men"
              >
                <User className="w-4 h-4 text-amber-500" />
                <span>Men</span>
                <ChevronDown className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link 
                href="/category/women" 
                className="relative group flex items-center gap-1.5 px-4 py-2 rounded-lg hover:bg-rose-500/10 transition-all duration-300" 
                data-testid="link-category-women"
              >
                <Heart className="w-4 h-4 text-rose-500" />
                <span>Women</span>
                <ChevronDown className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link 
                href="/category/kids" 
                className="relative group flex items-center gap-1.5 px-4 py-2 rounded-lg hover:bg-violet-500/10 transition-all duration-300" 
                data-testid="link-category-kids"
              >
                <User className="w-4 h-4 text-violet-500" />
                <span>Kids</span>
              </Link>
              <Link 
                href="/category/accessories" 
                className="relative group flex items-center gap-1.5 px-4 py-2 rounded-lg hover:bg-cyan-500/10 transition-all duration-300" 
                data-testid="link-category-accessories"
              >
                <ShoppingCart className="w-4 h-4 text-cyan-500" />
                <span>Accessories</span>
              </Link>
              <Link 
                href="/blog" 
                className="relative group flex items-center gap-1.5 px-4 py-2 rounded-lg hover:bg-emerald-500/10 transition-all duration-300" 
                data-testid="link-blog"
              >
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span>Blog</span>
              </Link>
              <Link 
                href="/sales" 
                className="relative flex items-center gap-1.5 px-5 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:scale-105" 
                data-testid="link-sales"
              >
                <Zap className="w-4 h-4 animate-pulse" />
                <span className="font-bold">Sale</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
