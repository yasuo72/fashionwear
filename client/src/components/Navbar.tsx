import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Search, ShoppingCart, Heart, User, Sparkles, Zap } from "lucide-react";
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
    <nav className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      scrolled 
        ? 'bg-background/90 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-border/60' 
        : 'bg-background/70 backdrop-blur-lg border-b border-border/40'
    }`}>
      <div className="w-full overflow-x-auto scrollbar-hide">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-2 sm:gap-4 min-w-max sm:min-w-0">
          <Link href="/" className="flex items-center group flex-shrink-0">
            <div className="relative">
              <div className="absolute -inset-1 bg-primary/40 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
              <h1 className="relative text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
                <span className="inline-flex items-center gap-1 sm:gap-2">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  <span className="hidden xs:inline">FashionHub</span>
                  <span className="xs:hidden">FashionHub</span>
                </span>
              </h1>
            </div>
          </Link>

          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <form onSubmit={handleSearch} className="relative w-full group">
              <div className="absolute -inset-0.5 bg-primary/20 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors duration-300" />
                <Input
                  type="search"
                  placeholder="Search for products, brands, and more..."
                  className="pl-10 w-full bg-background/60 border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                  data-testid="input-search"
                />
              </div>
            </form>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <Link href="/wishlist" className="flex-shrink-0">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative group hover:bg-primary/10 hover:scale-110 transition-all duration-300 h-9 w-9 sm:h-10 sm:w-10" 
                data-testid="button-wishlist"
              >
                <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-primary group-hover:fill-primary transition-all duration-300" />
                {wishlistCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary text-black shadow-lg shadow-primary/40 animate-pulse" data-testid="badge-wishlist-count">
                    {wishlistCount}
                  </Badge>
                )}
              </Button>
            </Link>

            <Link href="/cart" className="flex-shrink-0">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative group hover:bg-primary/10 hover:scale-110 transition-all duration-300 h-9 w-9 sm:h-10 sm:w-10" 
                data-testid="button-cart"
              >
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-primary group-hover:text-primary transition-colors duration-300" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary text-black shadow-lg shadow-primary/40 animate-pulse" data-testid="badge-cart-count">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-full hover:scale-110 transition-all duration-300 flex-shrink-0" data-testid="button-user">
                    <Avatar className="h-8 w-8 sm:h-9 sm:w-9 ring-2 ring-primary/30 hover:ring-primary/60 hover:ring-4 transition-all duration-300">
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
                className="bg-primary hover:bg-primary/90 text-black shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/20 hover:scale-105 transition-all duration-300 text-xs sm:text-sm h-8 sm:h-10 px-2 sm:px-4 flex-shrink-0"
              >
                <Link href="/login" className="flex items-center gap-1 sm:gap-2">
                  <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Login</span>
                </Link>
              </Button>
            )}

            <div className="flex-shrink-0">
              <ThemeToggle />
            </div>
          </div>
        </div>
        </div>

        <div className="md:hidden border-t border-border bg-muted/60 dark:bg-background/80 backdrop-blur-sm">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-2 px-3 py-3 min-w-max">
              <Link 
                href="/category/men" 
                className="relative px-4 py-2 rounded-full bg-card hover:bg-muted transition-all duration-300 text-sm font-medium whitespace-nowrap"
                data-testid="mobile-link-men"
              >
                Men
              </Link>
              <Link 
                href="/category/women" 
                className="relative px-4 py-2 rounded-full bg-card hover:bg-muted transition-all duration-300 text-sm font-medium whitespace-nowrap"
                data-testid="mobile-link-women"
              >
                Women
              </Link>
              <Link 
                href="/category/kids" 
                className="relative px-4 py-2 rounded-full bg-card hover:bg-muted transition-all duration-300 text-sm font-medium whitespace-nowrap"
                data-testid="mobile-link-kids"
              >
                Kids
              </Link>
              <Link 
                href="/category/accessories" 
                className="relative px-4 py-2 rounded-full bg-card hover:bg-muted transition-all duration-300 text-sm font-medium whitespace-nowrap"
                data-testid="mobile-link-accessories"
              >
                Accessories
              </Link>
              <Link 
                href="/blog" 
                className="relative px-4 py-2 rounded-full bg-card hover:bg-muted transition-all duration-300 text-sm font-medium whitespace-nowrap"
                data-testid="mobile-link-blog"
              >
                Blog
              </Link>
              <Link 
                href="/sales" 
                className="relative px-4 py-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-all duration-300 text-sm font-bold whitespace-nowrap"
              >
                <span className="text-primary flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  Sale
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border bg-muted/60 dark:bg-background/80 hidden md:block backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-12 items-center justify-center gap-8 text-sm font-medium">
            <Link 
              href="/category/men" 
              className="relative px-4 py-2 rounded-lg hover:bg-muted transition-all duration-300 hover:scale-110 group" 
              data-testid="link-category-men"
            >
              <span className="relative z-10">Men</span>
              <span className="absolute inset-0 bg-primary/20 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity"></span>
            </Link>
            <Link 
              href="/category/women" 
              className="relative px-4 py-2 rounded-lg hover:bg-muted transition-all duration-300 hover:scale-110 group" 
              data-testid="link-category-women"
            >
              <span className="relative z-10">Women</span>
              <span className="absolute inset-0 bg-primary/20 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity"></span>
            </Link>
            <Link 
              href="/category/kids" 
              className="relative px-4 py-2 rounded-lg hover:bg-muted transition-all duration-300 hover:scale-110 group" 
              data-testid="link-category-kids"
            >
              <span className="relative z-10">Kids</span>
              <span className="absolute inset-0 bg-primary/20 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity"></span>
            </Link>
            <Link 
              href="/category/accessories" 
              className="relative px-4 py-2 rounded-lg hover:bg-muted transition-all duration-300 hover:scale-110 group" 
              data-testid="link-category-accessories"
            >
              <span className="relative z-10">Accessories</span>
              <span className="absolute inset-0 bg-primary/20 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity"></span>
            </Link>
            <Link 
              href="/blog" 
              className="relative px-4 py-2 rounded-lg hover:bg-muted transition-all duration-300 hover:scale-110 group" 
              data-testid="link-blog"
            >
              <span className="relative z-10">Blog</span>
              <span className="absolute inset-0 bg-primary/20 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity"></span>
            </Link>
            <Link 
              href="/sales" 
              className="relative px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-all duration-300 hover:scale-110 group" 
              data-testid="link-sales"
            >
              <span className="relative z-10 text-primary font-bold flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                Sale
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
