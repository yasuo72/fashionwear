import { useState } from "react";
import { useParams } from "wouter";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, Share2, Truck, Shield, RefreshCw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { useAddToCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useWishlist, useAddToWishlist, useRemoveFromWishlist } from "@/hooks/useWishlist";
import { toast } from "@/hooks/use-toast";
import { ReviewSection } from "@/components/ReviewSection";
import { useQuery } from "@tanstack/react-query";

export default function ProductDetailPage() {
  const { id: slug } = useParams();
  const { data: productData, isLoading, error } = useProduct(slug!);
  const { data: relatedProductsData } = useProducts({ limit: 4 });
  const { data: authData } = useAuth();
  const { data: wishlistData } = useWishlist();
  const addToCart = useAddToCart();
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  
  const product = productData?.product;
  const relatedProducts = relatedProductsData?.products || [];
  const user = authData?.user;
  const wishlist = wishlistData?.wishlist;
  
  // Check if product is in wishlist
  const isInWishlist = wishlist?.productIds?.some((item: any) => item._id === product?._id) || false;

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Fetch reviews
  const { data: reviewsData, refetch: refetchReviews } = useQuery<{ reviews: any[] }>({
    queryKey: [`/api/reviews/${product?._id}`],
    enabled: !!product?._id,
  });

  const reviews = reviewsData?.reviews || [];

  // Get unique sizes and colors from variants
  const sizes = product ? Array.from(new Set(product.variants.map(v => v.size))) : [];
  const colors = product ? Array.from(new Set(product.variants.map(v => v.color))) : [];

  // Set initial size and color when product loads
  if (product && !selectedSize && sizes.length > 0) {
    setSelectedSize(sizes[0]);
  }
  if (product && !selectedColor && colors.length > 0) {
    setSelectedColor(colors[0]);
  }

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be logged in to add items to cart.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedSize || !selectedColor) {
      toast({
        title: "Please select options",
        description: "Please select size and color before adding to cart.",
        variant: "destructive",
      });
      return;
    }

    try {
      await addToCart.mutateAsync({
        productId: product!._id,
        quantity,
        size: selectedSize,
        color: selectedColor,
        price: product!.price,
      });
      
      toast({
        title: "Added to cart!",
        description: `${product!.name} has been added to your cart.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be logged in to add items to wishlist.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isInWishlist) {
        await removeFromWishlist.mutateAsync(product!._id);
        toast({
          title: "Removed from wishlist",
          description: `${product!.name} has been removed from your wishlist.`,
        });
      } else {
        await addToWishlist.mutateAsync(product!._id);
        toast({
          title: "Added to wishlist!",
          description: `${product!.name} has been added to your wishlist.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update wishlist. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: product!.name,
      text: `Check out ${product!.name} on FashionHub!`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast({
          title: "Shared successfully!",
          description: "Product link has been shared.",
        });
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied!",
          description: "Product link has been copied to clipboard.",
        });
      }
    } catch (error) {
      // User cancelled or error occurred
      if ((error as Error).name !== 'AbortError') {
        toast({
          title: "Error",
          description: "Failed to share product.",
          variant: "destructive",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p>Loading product...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
            <p className="text-muted-foreground">The product you're looking for doesn't exist.</p>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className="bg-muted py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-sm text-muted-foreground">
              Home / {product.categoryId?.name || 'Products'} / <span className="text-foreground font-medium">{product.name}</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="grid md:grid-cols-2 gap-6 lg:gap-10 mb-8">
            <div>
              <div className="aspect-[4/5] max-h-[460px] bg-muted rounded-lg overflow-hidden mb-4">
                <img
                  src={product.images[selectedImage]}
                  alt="Product"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                {product.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? "border-primary" : "border-transparent"
                    }`}
                    data-testid={`button-image-${index}`}
                  >
                    <img src={image} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2" data-testid="text-product-title">
                    {product.name}
                  </h1>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 fill-primary text-primary" />
                      <span className="font-semibold ml-1">{product.rating}</span>
                    </div>
                    <span className="text-muted-foreground">({product.reviewCount} reviews)</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={handleShare}
                    data-testid="button-share"
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={handleWishlistToggle}
                    disabled={addToWishlist.isPending || removeFromWishlist.isPending}
                    data-testid="button-add-wishlist"
                  >
                    <Heart 
                      className={`h-5 w-5 ${isInWishlist ? 'fill-primary text-primary' : ''}`} 
                    />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold" data-testid="text-product-price">₹{product.price}</span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">₹{product.originalPrice}</span>
                )}
                {product.discount && (
                  <Badge className="bg-chart-3 text-white">{product.discount}% OFF</Badge>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Select Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <Button
                        key={size}
                        variant={selectedSize === size ? "default" : "outline"}
                        onClick={() => setSelectedSize(size)}
                        data-testid={`button-size-${size.toLowerCase()}`}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Select Color</h3>
                  <div className="flex gap-3 flex-wrap">
                    {colors.map((color) => (
                      <Button
                        key={color}
                        variant={selectedColor === color ? "default" : "outline"}
                        onClick={() => setSelectedColor(color)}
                        data-testid={`button-color-${color.toLowerCase()}`}
                      >
                        {color}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Quantity</h3>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      data-testid="button-decrease-quantity"
                    >
                      -
                    </Button>
                    <span className="w-12 text-center font-semibold" data-testid="text-quantity">{quantity}</span>
                    <Button
                      variant="outline"
                      onClick={() => setQuantity(quantity + 1)}
                      data-testid="button-increase-quantity"
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    className="flex-1" 
                    size="lg" 
                    onClick={handleAddToCart}
                    disabled={addToCart.isPending}
                    data-testid="button-add-to-cart"
                  >
                    {addToCart.isPending ? "Adding..." : "Add to Cart"}
                  </Button>
                  <Button variant="outline" className="flex-1" size="lg" data-testid="button-buy-now">
                    Buy Now
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <Truck className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Free Shipping</p>
                  </div>
                  <div className="text-center">
                    <RefreshCw className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Easy Returns</p>
                  </div>
                  <div className="text-center">
                    <Shield className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">2 Year Warranty</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="description" className="mb-12">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="description" data-testid="tab-description">Description</TabsTrigger>
              <TabsTrigger value="reviews" data-testid="tab-reviews">Reviews ({product.reviewCount || 0})</TabsTrigger>
              <TabsTrigger value="size-guide" data-testid="tab-size-guide">Size Guide</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-6">
              <Card className="p-6">
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
                {product.brand && (
                  <div className="mt-4">
                    <p className="font-semibold">Brand: <span className="font-normal">{product.brand}</span></p>
                  </div>
                )}
                {product.tags && product.tags.length > 0 && (
                  <div className="mt-4 flex gap-2 flex-wrap">
                    {product.tags.map((tag, i) => (
                      <Badge key={i} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                )}
              </Card>
            </TabsContent>
            <TabsContent value="reviews" className="mt-6">
              <ReviewSection
                productId={product._id}
                reviews={reviews}
                averageRating={product.rating || 0}
                totalReviews={product.reviewCount || 0}
                onReviewSubmit={() => refetchReviews()}
              />
            </TabsContent>
            <TabsContent value="size-guide" className="mt-6">
              <Card className="p-6">
                <p className="text-muted-foreground">Size guide information will be displayed here.</p>
              </Card>
            </TabsContent>
          </Tabs>

          <div>
            <h2 className="text-2xl font-semibold mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((prod) => (
                <ProductCard 
                  key={prod._id} 
                  id={prod.slug}
                  productId={prod._id}
                  name={prod.name}
                  price={prod.price}
                  originalPrice={prod.originalPrice}
                  image={prod.images[0]}
                  rating={prod.rating}
                  reviews={prod.reviewCount}
                  discount={prod.discount}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
