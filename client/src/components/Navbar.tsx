import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, ShoppingCart, Heart, User, Menu, X } from "lucide-react";
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

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              FashionHub
            </h1>
          </Link>

          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for products, brands, and more..."
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                data-testid="input-search"
              />
            </form>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/wishlist">
              <Button variant="ghost" size="icon" className="relative" data-testid="button-wishlist">
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs" data-testid="badge-wishlist-count">
                    {wishlistCount}
                  </Badge>
                )}
              </Button>
            </Link>

            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative" data-testid="button-cart">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs" data-testid="badge-cart-count">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full" data-testid="button-user">
                    <Avatar className="h-9 w-9 ring-2 ring-primary/10 hover:ring-primary/30 transition-all">
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
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Login</Link>
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
          <div className="md:hidden py-4 border-t">
            <form onSubmit={handleSearch} className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-mobile-search"
              />
            </form>
            
            <div className="flex flex-col space-y-2 px-2">
              <Link 
                href="/category/men" 
                className="px-4 py-3 rounded-md hover:bg-accent transition-colors text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Men
              </Link>
              <Link 
                href="/category/women" 
                className="px-4 py-3 rounded-md hover:bg-accent transition-colors text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Women
              </Link>
              <Link 
                href="/category/kids" 
                className="px-4 py-3 rounded-md hover:bg-accent transition-colors text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Kids
              </Link>
              <Link 
                href="/category/accessories" 
                className="px-4 py-3 rounded-md hover:bg-accent transition-colors text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Accessories
              </Link>
              <Link 
                href="/blog" 
                className="px-4 py-3 rounded-md hover:bg-accent transition-colors text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </Link>
              <Link 
                href="/sales" 
                className="px-4 py-3 rounded-md hover:bg-accent transition-colors text-sm font-medium text-destructive"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sale
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="border-t bg-card hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-12 items-center justify-center gap-8 text-sm">
            <Link href="/category/men" className="hover-elevate px-3 py-2 rounded-md transition-colors" data-testid="link-category-men">
              Men
            </Link>
            <Link href="/category/women" className="hover-elevate px-3 py-2 rounded-md transition-colors" data-testid="link-category-women">
              Women
            </Link>
            <Link href="/category/kids" className="hover-elevate px-3 py-2 rounded-md transition-colors" data-testid="link-category-kids">
              Kids
            </Link>
            <Link href="/category/accessories" className="hover-elevate px-3 py-2 rounded-md transition-colors" data-testid="link-category-accessories">
              Accessories
            </Link>
            <Link href="/blog" className="hover-elevate px-3 py-2 rounded-md transition-colors" data-testid="link-blog">
              Blog
            </Link>
            <Link href="/sales" className="hover-elevate px-3 py-2 rounded-md transition-colors text-destructive font-medium" data-testid="link-sales">
              Sale
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
