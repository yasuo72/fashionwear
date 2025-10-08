import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { ProductCard } from "@/components/ProductCard";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, Share2, Truck, Shield, RefreshCw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

const relatedProducts = [
  { id: "10", name: "Similar T-Shirt", price: 24.99, image: "https://images.unsplash.com/photo-1503341733017-1901578f9f1e?w=400&h=400&fit=crop", rating: 4.3, reviews: 67 },
  { id: "11", name: "Polo Shirt", price: 34.99, image: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=400&h=400&fit=crop", rating: 4.6, reviews: 89 },
  { id: "12", name: "Graphic Tee", price: 27.99, image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop", rating: 4.7, reviews: 156 },
  { id: "13", name: "V-Neck Shirt", price: 29.99, image: "https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=400&h=400&fit=crop", rating: 4.5, reviews: 92 },
];

export default function ProductDetailPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("Blue");
  const [quantity, setQuantity] = useState(1);

  const images = [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1503341733017-1901578f9f1e?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=600&h=600&fit=crop",
  ];

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const colors = [
    { name: "Blue", hex: "#3B82F6" },
    { name: "Black", hex: "#000000" },
    { name: "White", hex: "#FFFFFF" },
    { name: "Gray", hex: "#6B7280" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className="bg-muted py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-sm text-muted-foreground">
              Home / Men / T-Shirts / <span className="text-foreground font-medium">Classic Cotton T-Shirt</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-4">
                <img
                  src={images[selectedImage]}
                  alt="Product"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                {images.map((image, index) => (
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
                    Classic Cotton T-Shirt
                  </h1>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 fill-primary text-primary" />
                      <span className="font-semibold ml-1">4.5</span>
                    </div>
                    <span className="text-muted-foreground">(128 reviews)</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" data-testid="button-share">
                    <Share2 className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon" data-testid="button-add-wishlist">
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold" data-testid="text-product-price">$29.99</span>
                <span className="text-xl text-muted-foreground line-through">$49.99</span>
                <Badge className="bg-chart-3 text-white">40% OFF</Badge>
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
                  <div className="flex gap-3">
                    {colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${
                          selectedColor === color.name ? "border-primary scale-110" : "border-border"
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                        data-testid={`button-color-${color.name.toLowerCase()}`}
                      />
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
                  <Button className="flex-1" size="lg" data-testid="button-add-to-cart">
                    Add to Cart
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
              <TabsTrigger value="reviews" data-testid="tab-reviews">Reviews (128)</TabsTrigger>
              <TabsTrigger value="size-guide" data-testid="tab-size-guide">Size Guide</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-6">
              <Card className="p-6">
                <p className="text-muted-foreground leading-relaxed">
                  Premium quality cotton t-shirt designed for ultimate comfort and style. Features a classic crew neck design,
                  short sleeves, and a regular fit. Made from 100% organic cotton for breathability and durability. Perfect for
                  casual wear or layering. Machine washable and pre-shrunk for a lasting fit.
                </p>
              </Card>
            </TabsContent>
            <TabsContent value="reviews" className="mt-6">
              <Card className="p-6">
                <p className="text-muted-foreground">Customer reviews will be displayed here.</p>
              </Card>
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
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
