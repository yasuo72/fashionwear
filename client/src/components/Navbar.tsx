import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Search, ShoppingCart, Heart, User, Menu, X, Sparkles, Zap } from "lucide-react";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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
      setMobileMenuOpen(false);
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
    <nav className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      scrolled 
        ? 'bg-background/80 backdrop-blur-xl shadow-lg shadow-purple-500/10 border-b border-purple-500/20' 
        : 'bg-background/60 backdrop-blur-lg border-b border-border/40'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center group">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
              <h1 className="relative text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-500 bg-clip-text text-transparent animate-gradient">
                <span className="inline-flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
                  FashionHub
                </span>
              </h1>
            </div>
          </Link>

          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <form onSubmit={handleSearch} className="relative w-full group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-500 group-hover:text-pink-500 transition-colors duration-300" />
                <Input
                  type="search"
                  placeholder="Search for products, brands, and more..."
                  className="pl-10 w-full bg-background/50 border-purple-500/30 focus:border-pink-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                  data-testid="input-search"
                />
              </div>
            </form>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/wishlist">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative group hover:bg-pink-500/10 hover:scale-110 transition-all duration-300" 
                data-testid="button-wishlist"
              >
                <Heart className="h-5 w-5 text-pink-500 group-hover:fill-pink-500 transition-all duration-300" />
                {wishlistCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-gradient-to-r from-pink-600 to-red-600 text-white shadow-lg shadow-pink-500/50 animate-pulse" data-testid="badge-wishlist-count">
                    {wishlistCount}
                  </Badge>
                )}
              </Button>
            </Link>

            <Link href="/cart">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative group hover:bg-purple-500/10 hover:scale-110 transition-all duration-300" 
                data-testid="button-cart"
              >
                <ShoppingCart className="h-5 w-5 text-purple-500 group-hover:text-purple-600 transition-colors duration-300" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50 animate-pulse" data-testid="badge-cart-count">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full hover:scale-110 transition-all duration-300" data-testid="button-user">
                    <Avatar className="h-9 w-9 ring-2 ring-purple-500/30 hover:ring-purple-500/60 hover:ring-4 transition-all duration-300">
                      <AvatarImage 
                        src={(user as any).profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.firstName}`} 
                        alt={`${user.firstName} ${user.lastName}`}
                        className="object-cover"
                      />
                      <AvatarFallback className="text-xs">
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage 
                          src={(user as any).profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.firstName}`}
                          className="object-cover"
                        />
                        <AvatarFallback>
                          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" data-testid="link-profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders" data-testid="link-orders">Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/wishlist" data-testid="link-wishlist">Wishlist</Link>
                  </DropdownMenuItem>
                  {user.role === 'admin' && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin" data-testid="link-admin">Admin Dashboard</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => logout.mutate()}
                    data-testid="button-logout"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                asChild 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60 hover:scale-105 transition-all duration-300"
              >
                <Link href="/login" className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Login
                </Link>
              </Button>
            )}

            <ThemeToggle />

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-purple-500/20 bg-gradient-to-br from-purple-50/30 to-pink-50/30 dark:from-purple-950/20 dark:to-pink-950/20 backdrop-blur-sm animate-fade-in-up">
            <form onSubmit={handleSearch} className="relative mb-4 px-2 group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-500" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-10 w-full bg-background/50 border-purple-500/30"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-mobile-search"
                />
              </div>
            </form>
            
            <div className="flex flex-col space-y-2 px-2">
              <Link 
                href="/category/men" 
                className="relative px-4 py-3 rounded-lg bg-purple-500/5 hover:bg-purple-500/20 transition-all duration-300 text-sm font-medium group overflow-hidden"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="relative z-10">Men</span>
                <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-10 transition-opacity"></span>
              </Link>
              <Link 
                href="/category/women" 
                className="relative px-4 py-3 rounded-lg bg-pink-500/5 hover:bg-pink-500/20 transition-all duration-300 text-sm font-medium group overflow-hidden"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="relative z-10">Women</span>
                <span className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity"></span>
              </Link>
              <Link 
                href="/category/kids" 
                className="relative px-4 py-3 rounded-lg bg-yellow-500/5 hover:bg-yellow-500/20 transition-all duration-300 text-sm font-medium group overflow-hidden"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="relative z-10">Kids</span>
                <span className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-orange-600 opacity-0 group-hover:opacity-10 transition-opacity"></span>
              </Link>
              <Link 
                href="/category/accessories" 
                className="relative px-4 py-3 rounded-lg bg-blue-500/5 hover:bg-blue-500/20 transition-all duration-300 text-sm font-medium group overflow-hidden"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="relative z-10">Accessories</span>
                <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 group-hover:opacity-10 transition-opacity"></span>
              </Link>
              <Link 
                href="/blog" 
                className="relative px-4 py-3 rounded-lg bg-purple-500/5 hover:bg-purple-500/20 transition-all duration-300 text-sm font-medium group overflow-hidden"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="relative z-10">Blog</span>
                <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-10 transition-opacity"></span>
              </Link>
              <Link 
                href="/sales" 
                className="relative px-4 py-3 rounded-lg bg-gradient-to-r from-red-500/20 to-orange-500/20 hover:from-red-500/30 hover:to-orange-500/30 transition-all duration-300 text-sm font-bold group overflow-hidden"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="relative z-10 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-500 animate-pulse" />
                  Sale
                </span>
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-purple-500/10 bg-gradient-to-r from-purple-50/50 via-pink-50/50 to-yellow-50/50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-yellow-950/20 hidden md:block backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-12 items-center justify-center gap-8 text-sm font-medium">
            <Link 
              href="/category/men" 
              className="relative px-4 py-2 rounded-lg hover:bg-purple-500/10 transition-all duration-300 hover:scale-110 group" 
              data-testid="link-category-men"
            >
              <span className="relative z-10">Men</span>
              <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity"></span>
            </Link>
            <Link 
              href="/category/women" 
              className="relative px-4 py-2 rounded-lg hover:bg-pink-500/10 transition-all duration-300 hover:scale-110 group" 
              data-testid="link-category-women"
            >
              <span className="relative z-10">Women</span>
              <span className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity"></span>
            </Link>
            <Link 
              href="/category/kids" 
              className="relative px-4 py-2 rounded-lg hover:bg-yellow-500/10 transition-all duration-300 hover:scale-110 group" 
              data-testid="link-category-kids"
            >
              <span className="relative z-10">Kids</span>
              <span className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity"></span>
            </Link>
            <Link 
              href="/category/accessories" 
              className="relative px-4 py-2 rounded-lg hover:bg-blue-500/10 transition-all duration-300 hover:scale-110 group" 
              data-testid="link-category-accessories"
            >
              <span className="relative z-10">Accessories</span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity"></span>
            </Link>
            <Link 
              href="/blog" 
              className="relative px-4 py-2 rounded-lg hover:bg-purple-500/10 transition-all duration-300 hover:scale-110 group" 
              data-testid="link-blog"
            >
              <span className="relative z-10">Blog</span>
              <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity"></span>
            </Link>
            <Link 
              href="/sales" 
              className="relative px-4 py-2 rounded-lg bg-gradient-to-r from-red-500/10 to-orange-500/10 hover:from-red-500/20 hover:to-orange-500/20 transition-all duration-300 hover:scale-110 group" 
              data-testid="link-sales"
            >
              <span className="relative z-10 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent font-bold flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-orange-500 animate-pulse" />
                Sale
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
