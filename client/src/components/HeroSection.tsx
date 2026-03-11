import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  TrendingUp, Zap, Crown, ShoppingBag, ArrowRight,
  Star, Truck, Shield, Clock, ChevronLeft, ChevronRight,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useBanners } from "@/hooks/useBanners";

// Featured products for 3D carousel
const heroProducts = [
  {
    id: 1,
    name: "Nike Air Max",
    price: 8999,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop",
    color: "from-red-500 to-orange-500",
  },
  {
    id: 2,
    name: "Summer Dress",
    price: 3319,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop",
    color: "from-pink-500 to-rose-500",
  },
  {
    id: 3,
    name: "Leather Jacket",
    price: 7469,
    image: "https://images.unsplash.com/photo-1521228695092-845cf5a3a38e?w=400&h=500&fit=crop",
    color: "from-gray-700 to-gray-900",
  },
  {
    id: 4,
    name: "Classic Watch",
    price: 2999,
    image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=400&h=500&fit=crop",
    color: "from-amber-500 to-yellow-500",
  },
  {
    id: 5,
    name: "Designer Bag",
    price: 6639,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=500&fit=crop",
    color: "from-amber-700 to-orange-700",
  },
];

export function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const { data: bannersData } = useBanners("hero");
  const carouselRef = useRef<HTMLDivElement>(null);

  const bannerText = bannersData?.banners?.[0]?.text || "2026 collection is here";

  // Auto-rotate carousel
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroProducts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 20,
        y: (e.clientY / window.innerHeight) * 20,
      });
    };
    const onScroll = () => setScrollY(window.scrollY);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % heroProducts.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + heroProducts.length) % heroProducts.length);
    setIsAutoPlaying(false);
  };

  return (
    <section className="relative w-full min-h-[92vh] overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background">
      {/* ── Ambient blobs ───────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-amber-500/15 rounded-full blur-[100px]"
          style={{ transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)` }}
        />
        <div
          className="absolute top-1/2 -right-24 w-[400px] h-[400px] bg-rose-500/10 rounded-full blur-[100px]"
          style={{ transform: `translate(-${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)` }}
        />
        <div className="absolute bottom-0 left-1/3 w-[300px] h-[300px] bg-violet-500/10 rounded-full blur-[80px]" />
      </div>

      {/* ── Subtle grid ─────────────────────────────── */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(251,191,36,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(251,191,36,0.02)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      {/* ── Main content ────────────────────────────── */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full min-h-[92vh] flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center w-full py-20 lg:py-0">

          {/* ── LEFT: Text ──────────────────────────── */}
          <div className="flex flex-col z-10">
            {/* Pill badge */}
            <div className="inline-flex w-fit items-center gap-2 bg-white/5 backdrop-blur-xl border border-amber-500/30 rounded-full px-5 py-2.5 mb-7 shadow-lg shadow-amber-500/10">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <Crown className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-sm font-semibold text-white/90 tracking-wide">{bannerText}</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl xl:text-7xl font-black leading-[1.05] mb-6 text-white" data-testid="text-hero-title">
              Discover Your
              <br />
              <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 bg-clip-text text-transparent">
                Perfect Style
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base md:text-lg text-white/50 mb-10 max-w-lg leading-relaxed" data-testid="text-hero-subtitle">
              Explore curated collections that blend{" "}
              <span className="text-amber-400 font-semibold">timeless elegance</span>{" "}
              with modern trends. Elevate your wardrobe with premium quality fashion.
            </p>

            {/* Stats row */}
            <div className="flex flex-wrap gap-6 mb-10">
              {[
                { icon: TrendingUp, value: "50%", label: "Off Sale", from: "from-amber-500", to: "to-orange-500", shadow: "shadow-amber-500/30" },
                { icon: ShoppingBag, value: "1000+", label: "Products", from: "from-rose-500", to: "to-pink-500", shadow: "shadow-rose-500/30" },
                { icon: Star, value: "4.9", label: "Rating", from: "from-violet-500", to: "to-purple-500", shadow: "shadow-violet-500/30" },
              ].map(({ icon: Icon, value, label, from, to, shadow }) => (
                <div key={label} className="flex items-center gap-3 group">
                  <div className={`w-13 h-13 rounded-2xl bg-gradient-to-br ${from} ${to} flex items-center justify-center shadow-xl ${shadow} group-hover:scale-110 transition-transform duration-300 p-3`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className={`text-2xl font-black bg-gradient-to-r ${from} ${to} bg-clip-text text-transparent`}>
                      {value}
                    </div>
                    <div className="text-xs text-white/40 font-medium">{label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4 mb-10">
              <Link href="/category/new">
                <Button
                  size="lg"
                  className="group bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:opacity-90 text-white border-0 shadow-2xl shadow-orange-500/40 hover:scale-105 transition-all duration-300 px-8 py-6 rounded-xl font-bold text-base"
                  data-testid="button-shop-now"
                >
                  <ShoppingBag className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                  Shop Now
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/sales">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/5 backdrop-blur-xl border border-white/20 text-white hover:bg-white/10 hover:border-amber-500/50 hover:scale-105 transition-all duration-300 px-8 py-6 rounded-xl font-semibold text-base"
                  data-testid="button-view-sale"
                >
                  <Zap className="w-5 h-5 mr-2 text-amber-400" />
                  View Sale
                </Button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-white/10">
              {[
                { icon: Truck, label: "Free Shipping", color: "text-emerald-400" },
                { icon: Shield, label: "Secure Payment", color: "text-blue-400" },
                { icon: Clock, label: "24/7 Support", color: "text-violet-400" },
              ].map(({ icon: Icon, label, color }) => (
                <div key={label} className="flex items-center gap-2 text-sm text-white/40">
                  <Icon className={`w-4 h-4 ${color}`} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: 3D Product Carousel ────────────────────── */}
          <div
            className="relative hidden lg:flex items-center justify-center perspective-1000"
            style={{ transform: `translateY(${scrollY * 0.08}px)` }}
          >
            {/* Glow ring behind carousel */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-violet-500/20 rounded-3xl blur-3xl animate-pulse" />

            {/* 3D Carousel Container */}
            <div ref={carouselRef} className="relative w-full max-w-[500px] h-[550px]">
              {/* Carousel cards */}
              {heroProducts.map((product, index) => {
                const offset = index - activeIndex;
                const isActive = index === activeIndex;
                const isPrev = index === (activeIndex - 1 + heroProducts.length) % heroProducts.length;
                const isNext = index === (activeIndex + 1) % heroProducts.length;

                let transform = "";
                let opacity = 0;
                let zIndex = 0;
                let scale = 0.6;

                if (isActive) {
                  transform = "translateX(0) translateZ(100px) rotateY(0deg)";
                  opacity = 1;
                  zIndex = 30;
                  scale = 1;
                } else if (isPrev) {
                  transform = "translateX(-120px) translateZ(-50px) rotateY(25deg)";
                  opacity = 0.6;
                  zIndex = 20;
                  scale = 0.85;
                } else if (isNext) {
                  transform = "translateX(120px) translateZ(-50px) rotateY(-25deg)";
                  opacity = 0.6;
                  zIndex = 20;
                  scale = 0.85;
                } else {
                  // Hidden cards
                  const hiddenOffset = offset > 0 ? 200 : -200;
                  transform = `translateX(${hiddenOffset}px) translateZ(-100px) rotateY(${offset > 0 ? -30 : 30}deg)`;
                  opacity = 0;
                  zIndex = 10;
                  scale = 0.5;
                }

                return (
                  <div
                    key={product.id}
                    className="absolute inset-0 flex items-center justify-center transition-all duration-700 ease-out"
                    style={{
                      transform,
                      opacity,
                      zIndex,
                    }}
                  >
                    <div
                      className={`relative rounded-3xl overflow-hidden shadow-2xl border transition-all duration-500 ${isActive ? "border-white/20" : "border-white/5"
                        }`}
                      style={{
                        width: `${280 * scale}px`,
                        height: `${350 * scale}px`,
                        boxShadow: isActive
                          ? "0 25px 50px -12px rgba(251, 191, 36, 0.3), 0 0 80px rgba(251, 191, 36, 0.2)"
                          : "0 10px 30px -10px rgba(0,0,0,0.5)",
                      }}
                    >
                      {/* Product Image */}
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />

                      {/* Gradient overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-t ${product.color} opacity-20 mix-blend-overlay`} />

                      {/* Bottom gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Product info */}
                      {isActive && (
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-lg font-bold text-white mb-1">{product.name}</h3>
                          <div className="flex items-center justify-between">
                            <span className="text-xl font-black text-amber-400">₹{product.price.toLocaleString()}</span>
                            <Link href={`/product/${product.id}`}>
                              <Button size="sm" className="bg-white/20 backdrop-blur-xl hover:bg-white/30 text-white border border-white/20 rounded-full px-4">
                                View
                              </Button>
                            </Link>
                          </div>
                        </div>
                      )}

                      {/* Floating badge */}
                      {isActive && (
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-bounce">
                          Trending
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Navigation arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all hover:scale-110"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all hover:scale-110"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Dots indicator */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-40">
                {heroProducts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setActiveIndex(index);
                      setIsAutoPlaying(false);
                    }}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${index === activeIndex
                        ? "bg-amber-500 w-8"
                        : "bg-white/30 hover:bg-white/50"
                      }`}
                  />
                ))}
              </div>
            </div>

            {/* Floating stat cards */}
            <div className="absolute -top-4 -right-4 bg-card/80 backdrop-blur-xl border border-border rounded-2xl px-4 py-3 shadow-xl animate-float-card z-40">
              <div className="text-xs text-muted-foreground mb-0.5">This Week</div>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-black text-foreground">+24% Sales</span>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 bg-card/80 backdrop-blur-xl border border-border rounded-2xl px-4 py-3 shadow-xl animate-float-card-delayed z-40">
              <div className="text-xs text-muted-foreground mb-0.5">Avg. Rating</div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                ))}
                <span className="text-sm font-black text-foreground ml-1">4.9</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}