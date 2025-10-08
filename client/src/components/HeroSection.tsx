import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&h=900&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
      </div>

      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4" data-testid="text-hero-title">
            New Season
            <br />
            New Style
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8" data-testid="text-hero-subtitle">
            Discover the latest trends in fashion with up to 50% off on selected items
          </p>
          <div className="flex gap-4">
            <Link href="/category/new">
              <Button size="lg" className="bg-primary hover:bg-primary/90" data-testid="button-shop-now">
                Shop Now
              </Button>
            </Link>
            <Link href="/sales">
              <Button size="lg" variant="outline" className="backdrop-blur-md bg-white/20 border-white/40 text-white hover:bg-white/30" data-testid="button-view-sale">
                View Sale
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
