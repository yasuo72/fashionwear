import { useState } from "react";
import { Link } from "wouter";
import { Heart, Star, ShoppingCart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAddToCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface ProductCardProps {
  id: string; // This is the slug for navigation
  productId?: string; // This is the actual _id for API calls
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
        productId: productId || id, // Use productId if available, fallback to id
        quantity: 1,
        size: "M", // Default size - in a real app, this would be selected by user
        color: "Default", // Default color
        price: price,
      });
      
      toast({
        title: "Added to cart!",
        description: `${name} has been added to your cart.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="group overflow-hidden hover-elevate transition-all duration-300">
      <Link href={`/product/${id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          {discount && (
            <Badge className="absolute top-2 left-2 bg-chart-3 text-white" data-testid={`badge-discount-${id}`}>
              {discount}% OFF
            </Badge>
          )}
          {badge && (
            <Badge className="absolute top-2 right-2 bg-accent" data-testid={`badge-label-${id}`}>
              {badge}
            </Badge>
          )}
          <Button
            size="icon"
            variant="ghost"
            className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity ${isWishlisted ? 'text-destructive' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              setIsWishlisted(!isWishlisted);
            }}
            data-testid={`button-wishlist-${id}`}
          >
            <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/product/${id}`}>
          <h3 className="font-medium text-sm line-clamp-2 mb-2 hover:text-primary transition-colors" data-testid={`text-product-name-${id}`}>
            {name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="text-sm font-medium ml-1" data-testid={`text-rating-${id}`}>{rating}</span>
          </div>
          <span className="text-xs text-muted-foreground" data-testid={`text-reviews-${id}`}>
            ({reviews})
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold" data-testid={`text-price-${id}`}>
              ₹{price}
            </span>
            {originalPrice && (
              <span className="text-sm text-muted-foreground line-through ml-2">
                ₹{originalPrice}
              </span>
            )}
          </div>
        </div>

        <Button 
          onClick={handleAddToCart}
          disabled={addToCart.isPending}
          size="sm"
          data-testid={`button-add-to-cart-${id}`}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {addToCart.isPending ? "Adding..." : "Add to Cart"}
        </Button>
      </div>
    </Card>
  );
}
