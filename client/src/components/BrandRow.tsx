import { useBanners } from "@/hooks/useBanners";
import { Badge } from "@/components/ui/badge";
import { Verified, Award } from "lucide-react";

export function BrandRow() {
  const { data, isLoading } = useBanners("brands");
  const brands = data?.banners || [];

  if (!isLoading && brands.length === 0) {
    return null;
  }

  return (
    <section className="relative border-y border-border/60 bg-muted/30 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Header */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
                Trusted Partners
              </p>
              <p className="text-sm font-semibold text-foreground">
                Premium Brands
              </p>
            </div>
          </div>
          
          {/* Brands - Marquee on mobile, static on desktop */}
          <div className="flex-1 overflow-hidden">
            {/* Mobile: Auto-scrolling marquee */}
            <div className="md:hidden">
              <div className="flex animate-marquee">
                {/* Double the brands for seamless loop */}
                {[...brands, ...brands].map((brand, index) => (
                  <div
                    key={`${brand._id}-${index}`}
                    className="group flex items-center gap-2.5 px-4 py-2 mx-2 rounded-xl bg-card/50 hover:bg-card border border-border/50 hover:border-amber-500/30 transition-all duration-300 cursor-pointer shrink-0"
                  >
                    {brand.imageUrl && (
                      <img
                        src={brand.imageUrl}
                        alt={brand.text}
                        className="h-5 w-14 object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                      />
                    )}
                    <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                      {brand.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Desktop: Static flex layout */}
            <div className="hidden md:flex flex-wrap items-center justify-end gap-6 md:gap-8">
              {isLoading && brands.length === 0
                ? Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-8 w-24 rounded-lg bg-muted animate-pulse"
                    />
                  ))
                : brands.map((brand, index) => (
                    <div
                      key={brand._id}
                      className="group flex items-center gap-2.5 px-4 py-2 rounded-xl bg-card/50 hover:bg-card border border-border/50 hover:border-amber-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10 cursor-pointer"
                    >
                      {brand.imageUrl && (
                        <img
                          src={brand.imageUrl}
                          alt={brand.text}
                          className="h-5 w-14 object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                        />
                      )}
                      <span className="text-xs md:text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                        {brand.text}
                      </span>
                      <Badge variant="secondary" className="hidden md:flex items-center gap-1 text-[10px] px-2 py-0.5 bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">
                        <Verified className="w-3 h-3" />
                        Verified
                      </Badge>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
