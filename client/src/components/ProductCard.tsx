import { useState } from "react";
import { Link } from "wouter";
import { Heart, Star, ShoppingCart, Eye, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAddToCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface ProductCardProps {
  id: string;
  productId?: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  discount?: number;
  badge?: string;
}

export function ProductCard({
  id,
  productId,
  name,
  price,
  originalPrice,
  image,
  rating,
  reviews,
  discount,
  badge,
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { data: authData } = useAuth();
  const addToCart = useAddToCart();
  const user = authData?.user;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be logged in to add items to cart.",
        variant: "destructive",
      });
      return;
    }

    try {
      await addToCart.mutateAsync({
        productId: productId || id,
        quantity: 1,
        size: "M",
        color: "Default",
        price,
      });
      toast({
        title: "Added to cart!",
        description: `${name} has been added to your cart.`,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="group relative">
      {/* Hover glow border */}
      <div className="absolute -inset-[1.5px] bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-xl opacity-0 group-hover:opacity-100 blur-[2px] transition-all duration-400" />

      <Card className="relative overflow-hidden rounded-xl border border-border/40 shadow-sm group-hover:shadow-lg group-hover:shadow-orange-500/10 transition-all duration-300 bg-card h-full flex flex-col">

        {/* ── Image ─────────────────────────────── */}
        <Link href={`/product/${id}`}>
          {/* aspect-square = compact, fits 4-col grid perfectly */}
          <div className="relative aspect-square overflow-hidden bg-muted">
            <img
              src={image}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  `https://placehold.co/300x300/1a1a1a/f59e0b?text=${encodeURIComponent(name.slice(0, 10))}`;
              }}
            />

            {/* Hover dark overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />

            {/* Discount badge — top left */}
            {discount && (
              <div className="absolute top-2 left-2">
                <Badge className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 shadow-md border-0">
                  <Zap className="w-2.5 h-2.5 mr-0.5" />
                  {discount}% OFF
                </Badge>
              </div>
            )}

            {/* Custom badge — top left below discount */}
            {badge && (
              <div className="absolute top-2 left-2 mt-6">
                <Badge className="bg-violet-500 text-white text-[10px] font-bold px-2 py-0.5 shadow-md border-0">
                  {badge}
                </Badge>
              </div>
            )}

            {/* Wishlist — top right, always visible on mobile, hover on desktop */}
            <button
              className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-200 shadow-md
                md:opacity-0 md:group-hover:opacity-100 md:scale-90 md:group-hover:scale-100
                ${isWishlisted
                  ? "bg-rose-500 border-rose-400"
                  : "bg-black/30 border-white/20 hover:bg-black/50"
                }`}
              onClick={(e) => {
                e.preventDefault();
                setIsWishlisted(!isWishlisted);
              }}
              data-testid={`button-wishlist-${id}`}
            >
              <Heart className={`w-4 h-4 transition-all duration-200 ${isWishlisted ? "text-white fill-white" : "text-white"}`} />
            </button>

            {/* Quick View — bottom, on hover */}
            <div className="absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 p-2">
              <button className="w-full flex items-center justify-center gap-1.5 bg-black/60 backdrop-blur-md text-white text-xs font-semibold py-2 rounded-lg border border-white/10 hover:bg-black/75 transition-colors">
                <Eye className="w-3.5 h-3.5" />
                Quick View
              </button>
            </div>

            {/* Shine sweep */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-0 group-hover:opacity-100">
              <div className="absolute top-0 -left-full h-full w-1/3 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12 group-hover:left-[160%] transition-all duration-800" />
            </div>
          </div>
        </Link>

        {/* ── Info ──────────────────────────────── */}
        <div className="flex flex-col flex-1 p-3 gap-2">

          {/* Product name */}
          <Link href={`/product/${id}`}>
            <h3
              className="text-xs font-semibold text-foreground line-clamp-2 leading-snug hover:text-amber-500 transition-colors min-h-[2rem]"
              data-testid={`text-product-name-${id}`}
            >
              {name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${i < Math.floor(rating) ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"}`}
                />
              ))}
            </div>
            <span className="text-[11px] font-bold text-foreground" data-testid={`text-rating-${id}`}>
              {rating}
            </span>
            <span className="text-[11px] text-muted-foreground" data-testid={`text-reviews-${id}`}>
              ({reviews})
            </span>
          </div>

          {/* Price row */}
          <div className="flex items-center gap-2 flex-wrap mt-auto">
            <span
              className="text-base font-extrabold text-amber-500"
              data-testid={`text-price-${id}`}
            >
              ₹{price.toLocaleString()}
            </span>
            {originalPrice && originalPrice > price && (
              <span className="text-xs text-muted-foreground line-through">
                ₹{originalPrice.toLocaleString()}
              </span>
            )}
            {discount && originalPrice && (
              <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                Save ₹{(originalPrice - price).toLocaleString()}
              </span>
            )}
          </div>

          {/* Add to Cart */}
          <Button
            onClick={handleAddToCart}
            disabled={addToCart.isPending}
            size="sm"
            className="w-full h-8 text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 shadow-md hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 mt-1"
            data-testid={`button-add-to-cart-${id}`}
          >
            <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
            {addToCart.isPending ? "Adding..." : "Add to Cart"}
          </Button>
        </div>

      </Card>
    </div>
  );
}