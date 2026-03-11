import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { BrandRow } from "@/components/BrandRow";
import { CategoryCard } from "@/components/CategoryCard";
import { ProductCard } from "@/components/ProductCard";
import { Footer } from "@/components/Footer";
import { useCategories } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";
import { useTrendingProducts, useBestSellingProducts } from "@/hooks/useTrendingProducts";
import { TrendingUp, Shield, Truck, Star, Flame, Crown, ShoppingBag, ArrowRight, Sparkles, Zap } from "lucide-react";
import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────
   Animated counter hook
───────────────────────────────────────────── */
function useCountUp(end: number, duration = 1500, start = false): number {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration, start]);
  return count;
}

/* ─────────────────────────────────────────────
   Intersection Observer hook
───────────────────────────────────────────── */
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

/* ─────────────────────────────────────────────
   Section Header Component
───────────────────────────────────────────── */
function SectionHeader({ eyebrow, eyebrowIcon: Icon, title, subtitle, accent = "#f59e0b", badge, badgeIcon: BadgeIcon }: {
  eyebrow: string;
  eyebrowIcon?: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle?: string;
  accent?: string;
  badge?: string;
  badgeIcon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
      <div>
        <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 rounded-full border text-xs font-semibold tracking-widest uppercase"
          style={{ borderColor: `${accent}33`, color: accent, background: `${accent}11` }}>
          {Icon && <Icon className="w-3 h-3" />}
          {eyebrow}
        </div>
        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground leading-none">
          {title}
        </h2>
        {subtitle && <p className="text-muted-foreground mt-2 text-base">{subtitle}</p>}
      </div>
      {badge && (
        <a href="#" className="inline-flex items-center gap-2 text-sm font-semibold group"
          style={{ color: accent }}>
          {badge}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </a>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Product Grid Skeleton
───────────────────────────────────────────── */
function ProductSkeleton({ count = 8 }: { count?: number }) {
  return Array.from({ length: count }).map((_, i) => (
    <div key={i} className="rounded-xl overflow-hidden bg-card border border-border/40 animate-pulse">
      <div className="aspect-square bg-muted-foreground/10" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-muted-foreground/10 rounded w-3/4" />
        <div className="h-3 bg-muted-foreground/10 rounded w-1/2" />
        <div className="h-5 bg-muted-foreground/10 rounded w-1/3 mt-2" />
      </div>
    </div>
  ));
}

/* ─────────────────────────────────────────────
   Stat Card
───────────────────────────────────────────── */
function StatCard({ value, suffix = "+", label, color, start }: {
  value: number;
  suffix?: string;
  label: string;
  color: string;
  start: boolean;
}) {
  const count = useCountUp(value, 1800, start);
  return (
    <div className="text-center p-6 rounded-2xl bg-card border border-border/50 hover:border-border transition-colors">
      <div className="text-4xl font-black mb-1" style={{ color }}>
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-sm text-muted-foreground font-medium">{label}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main HomePage
───────────────────────────────────────────── */
export default function HomePage() {
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const { data: productsData, isLoading: productsLoading } = useProducts({ limit: 8 });
  const { data: featuredData, isLoading: featuredLoading } = useProducts({ limit: 4 });
  const { data: trendingData, isLoading: trendingLoading } = useTrendingProducts(8);
  const { data: bestSellingData, isLoading: bestSellingLoading } = useBestSellingProducts(8);

  const categories = categoriesData?.categories || [];
  const products = productsData?.products || [];
  const featured = featuredData?.products || [];
  const trending = trendingData?.products || [];
  const bestSelling = bestSellingData?.products || [];

  const [statsRef, statsInView] = useInView(0.3);

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Navbar />

      <main className="flex-1">

        {/* ── Hero ───────────────────────────────────── */}
        <HeroSection />

        {/* ── Brand Row ──────────────────────────────── */}
        <div className="border-y border-border/60 bg-muted/30 backdrop-blur-sm">
          <BrandRow />
        </div>

        {/* ── Stats Bar ──────────────────────────────── */}
        <section ref={statsRef} className="bg-foreground text-background py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: 50000, suffix: "+", label: "Happy Customers", color: "#f59e0b" },
                { value: 10000, suffix: "+", label: "Products Listed", color: "#10b981" },
                { value: 500, suffix: "+", label: "Top Brands", color: "#6366f1" },
                { value: 99, suffix: "%", label: "Satisfaction Rate", color: "#f43f5e" },
              ].map((s) => (
                <div key={s.label} className="text-center p-4">
                  <div className="text-3xl md:text-4xl font-black mb-1" style={{ color: s.color }}>
                    {statsInView
                      ? <AnimatedNumber value={s.value} suffix={s.suffix} />
                      : `0${s.suffix}`}
                  </div>
                  <div className="text-sm text-background/60 font-medium">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Categories ─────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <SectionHeader
            eyebrow="Collections"
            eyebrowIcon={ShoppingBag}
            title="Shop by Category"
            subtitle="Discover curated styles across every category"
            accent="#f59e0b"
            badge="View All Categories"
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {categoriesLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-muted animate-pulse rounded-3xl" />
                ))
              : categories.map((cat, i) => (
                  <div
                    key={cat._id}
                    className="hover:-translate-y-2 transition-all duration-300 ease-out"
                    style={{ transitionDelay: `${i * 60}ms` }}
                  >
                    <CategoryCard
                      id={cat.slug}
                      name={cat.name}
                      image={cat.image}
                      productCount={cat.productCount || 0}
                    />
                  </div>
                ))}
          </div>
        </section>

        {/* ── Promo Banner ───────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-8 md:p-12">
            {/* decorative circles */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full" />
            <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-white/10 rounded-full" />
            <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2" />

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-3 tracking-widest uppercase">
                  <Zap className="w-3 h-3" /> Limited Time
                </div>
                <h3 className="text-3xl md:text-5xl font-black text-white leading-tight">
                  Up to 60% Off<br />
                  <span className="text-white/80">Summer Sale</span>
                </h3>
                <p className="text-white/80 mt-2 text-sm md:text-base">
                  Shop now before stock runs out. New deals every hour!
                </p>
              </div>
              <a
                href="/sale"
                className="shrink-0 inline-flex items-center gap-2 bg-white text-orange-600 font-bold px-8 py-4 rounded-2xl hover:scale-105 hover:shadow-2xl transition-all duration-200 text-base"
              >
                Shop the Sale <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* ── Trending Products ──────────────────────── */}
        {(trendingLoading || trending.length > 0) && (
          <section className="bg-muted/40 py-16 md:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <SectionHeader
                eyebrow="Hot Right Now"
                eyebrowIcon={Flame}
                title="Trending Products"
                subtitle="What shoppers are loving this week"
                accent="#f43f5e"
                badge="See All Trending"
              />
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                {trendingLoading
                  ? <ProductSkeleton count={8} />
                  : trending.slice(0, 8).map((p, i) => (
                      <div
                        key={p._id}
                        className="hover:-translate-y-1 transition-all duration-300"
                        style={{ transitionDelay: `${i * 40}ms` }}
                      >
                        <ProductCard
                          id={p.slug} productId={p._id} name={p.name}
                          price={p.price} originalPrice={p.originalPrice}
                          image={p.images[0]} rating={p.rating}
                          reviews={p.reviewCount} discount={p.discount}
                        />
                      </div>
                    ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Best Sellers ───────────────────────────── */}
        {(bestSellingLoading || bestSelling.length > 0) && (
          <section className="py-16 md:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <SectionHeader
                eyebrow="Customer Favourites"
                eyebrowIcon={Crown}
                title="Best Sellers"
                subtitle="Top-rated picks trusted by thousands"
                accent="#f59e0b"
                badge="See All Best Sellers"
              />
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                {bestSellingLoading
                  ? <ProductSkeleton count={8} />
                  : bestSelling.slice(0, 8).map((p, i) => (
                      <div
                        key={p._id}
                        className="hover:-translate-y-1 transition-all duration-300"
                        style={{ transitionDelay: `${i * 40}ms` }}
                      >
                        <ProductCard
                          id={p.slug} productId={p._id} name={p.name}
                          price={p.price} originalPrice={p.originalPrice}
                          image={p.images[0]} rating={p.rating}
                          reviews={p.reviewCount} discount={p.discount}
                        />
                      </div>
                    ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Featured Products ──────────────────────── */}
        <section className="bg-muted/40 py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Editor's Pick"
              eyebrowIcon={Sparkles}
              title="Featured Products"
              subtitle="Handpicked by our team just for you"
              accent="#6366f1"
              badge="View All Featured"
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {featuredLoading
                ? <ProductSkeleton count={4} />
                : featured.map((p, i) => (
                    <div
                      key={p._id}
                      className="hover:-translate-y-1 transition-all duration-300"
                      style={{ transitionDelay: `${i * 60}ms` }}
                    >
                      <ProductCard
                        id={p.slug} productId={p._id} name={p.name}
                        price={p.price} originalPrice={p.originalPrice}
                        image={p.images[0]} rating={p.rating}
                        reviews={p.reviewCount} discount={p.discount}
                      />
                    </div>
                  ))}
            </div>
          </div>
        </section>

        {/* ── Latest Arrivals ────────────────────────── */}
        <section className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Just Dropped"
              eyebrowIcon={TrendingUp}
              title="Latest Arrivals"
              subtitle="Fresh styles added daily — be the first to grab them"
              accent="#10b981"
              badge="Browse All Products"
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {productsLoading
                ? <ProductSkeleton count={8} />
                : products.map((p, i) => (
                    <div
                      key={p._id}
                      className="hover:-translate-y-1 transition-all duration-300"
                      style={{ transitionDelay: `${i * 40}ms` }}
                    >
                      <ProductCard
                        id={p.slug} productId={p._id} name={p.name}
                        price={p.price} originalPrice={p.originalPrice}
                        image={p.images[0]} rating={p.rating}
                        reviews={p.reviewCount} discount={p.discount}
                      />
                    </div>
                  ))}
            </div>

            {/* Load More */}
            <div className="mt-12 text-center">
              <a
                href="/products"
                className="inline-flex items-center gap-2 bg-foreground text-background px-10 py-4 rounded-2xl font-bold hover:opacity-90 hover:scale-105 transition-all duration-200 shadow-xl"
              >
                View All Products <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* ── Trust Features ─────────────────────────── */}
        <section className="border-t border-border/60 bg-muted/20 py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                {
                  icon: Truck,
                  color: "#f59e0b",
                  bg: "#fef3c7",
                  darkBg: "rgba(245,158,11,0.12)",
                  title: "Free Delivery",
                  desc: "Free shipping on all orders above ₹499",
                },
                {
                  icon: Shield,
                  color: "#10b981",
                  bg: "#d1fae5",
                  darkBg: "rgba(16,185,129,0.12)",
                  title: "Easy Returns",
                  desc: "7-day hassle-free return policy",
                },
                {
                  icon: Star,
                  color: "#6366f1",
                  bg: "#e0e7ff",
                  darkBg: "rgba(99,102,241,0.12)",
                  title: "Secure Payments",
                  desc: "100% safe & encrypted transactions",
                },
              ].map(({ icon: Icon, color, title, desc }, i) => (
                <div
                  key={title}
                  className="flex items-start gap-4 p-6 rounded-2xl bg-card border border-border/50 hover:border-border hover:shadow-md transition-all duration-200"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${color}18` }}
                  >
                    <Icon className="w-6 h-6" style={{ color }} />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">{title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Newsletter ─────────────────────────────── */}
        <section className="py-16 md:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-xs font-bold px-3 py-1.5 rounded-full mb-4 tracking-widest uppercase">
              <Sparkles className="w-3 h-3" /> Stay Updated
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-3">
              Get Exclusive Deals
            </h2>
            <p className="text-muted-foreground mb-8 text-base max-w-lg mx-auto">
              Subscribe for early access to sales, new arrivals, and members-only offers.
            </p>
            <form
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-5 py-3.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
              <button
                type="submit"
                className="px-6 py-3.5 bg-foreground text-background font-bold rounded-xl hover:opacity-90 hover:scale-105 transition-all duration-200 whitespace-nowrap text-sm"
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs text-muted-foreground mt-3">
              No spam, ever. Unsubscribe anytime.
            </p>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}

/* ── Animated number (used in stats bar) ── */
function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    const duration = 1800;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setCount(Math.floor(p * value));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value]);
  return <>{count.toLocaleString()}{suffix}</>;
}