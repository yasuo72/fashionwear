import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { useBanners } from "@/hooks/useBanners";

export function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { data: bannersData } = useBanners('hero');
  
  // Get the first active hero banner, or use default text
  const heroBanner = bannersData?.banners?.[0];
  const bannerText = heroBanner?.text || "New Collection 2024";

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 20,
        y: (e.clientY / window.innerHeight) * 20,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-background border-b">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute top-0 -left-4 w-96 h-96 bg-primary/40 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"
          style={{ transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)` }}
        />
        <div 
          className="absolute top-0 -right-4 w-96 h-96 bg-secondary/40 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"
          style={{ transform: `translate(-${mousePosition.x}px, ${mousePosition.y}px)` }}
        />
        <div 
          className="absolute -bottom-8 left-20 w-96 h-96 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"
          style={{ transform: `translate(${mousePosition.x}px, -${mousePosition.y}px)` }}
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="grid gap-10 lg:grid-cols-2 items-center">
          <div className="max-w-4xl z-10 w-full">
            {/* Badge */}
            {bannerText && (
              <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm border border-primary/30 rounded-full px-4 py-2 mb-4 md:mb-6 animate-pulse-glow">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium text-foreground">
                  {bannerText}
                </span>
              </div>
            )}

            {/* Main Heading */}
            <h1 
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 leading-tight animate-fade-in-up text-foreground"
              data-testid="text-hero-title"
            >
              <span className="block mb-1">Fashion</span>
              <span className="block text-primary">Redefined</span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm md:text-base lg:text-lg text-muted-foreground mb-6 md:mb-8 max-w-2xl leading-relaxed animate-fade-in-up animation-delay-300" data-testid="text-hero-subtitle">
              Experience the future of style. Curated collections that blend
              <span className="text-primary font-semibold"> innovation </span>
              with elegance.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-4 md:gap-6 mb-6 md:mb-8 animate-fade-in-up animation-delay-500">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-black/10">
                <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-black" />
              </div>
              <div>
                <div className="text-xl md:text-2xl font-bold text-foreground">50%</div>
                <div className="text-xs md:text-sm text-muted-foreground">Off Sale</div>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-secondary flex items-center justify-center shadow-lg shadow-black/10">
                <Zap className="w-5 h-5 md:w-6 md:h-6 text-black" />
              </div>
              <div>
                <div className="text-xl md:text-2xl font-bold text-foreground">1000+</div>
                <div className="text-xs md:text-sm text-muted-foreground">Products</div>
              </div>
            </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 md:gap-4 animate-fade-in-up animation-delay-700">
              <Link href="/category/new">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-black border-0 shadow-xl shadow-black/10 hover:shadow-2xl hover:shadow-black/20 hover:scale-105 transition-all duration-300 text-sm md:text-base px-6 py-5 md:px-8 md:py-6"
                  data-testid="button-shop-now"
                >
                  <Sparkles className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  Shop Now
                </Button>
              </Link>
              <Link href="/sales">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="backdrop-blur-md bg-card border-2 border-border text-foreground hover:bg-muted hover:border-border/80 hover:scale-105 transition-all duration-300 text-sm md:text-base px-6 py-5 md:px-8 md:py-6"
                  data-testid="button-view-sale"
                >
                  Explore Collections
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Image (optional, from admin banner) */}
          {heroBanner?.imageUrl && (
            <div className="relative hidden md:block">
              <div className="relative aspect-[4/3] max-h-[420px] w-full rounded-3xl overflow-hidden">
                <img
                  src={heroBanner.imageUrl}
                  alt={heroBanner.text}
                  className="h-full w-full object-cover object-top"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
