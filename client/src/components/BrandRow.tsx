import { useBanners } from "@/hooks/useBanners";

export function BrandRow() {
  const { data, isLoading } = useBanners("brands");
  const brands = data?.banners || [];

  if (!isLoading && brands.length === 0) {
    return null;
  }

  return (
    <section className="border-b bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-3">
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          Trusted by brands
        </p>
        <div className="flex flex-wrap items-center gap-4 md:gap-6">
          {isLoading && brands.length === 0
            ? Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-6 w-20 rounded-full bg-muted animate-pulse"
                />
              ))
            : brands.map((brand) => (
                <div
                  key={brand._id}
                  className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity"
                >
                  {brand.imageUrl && (
                    <img
                      src={brand.imageUrl}
                      alt={brand.text}
                      className="h-6 w-16 object-contain"
                    />
                  )}
                  <span className="text-xs md:text-sm font-medium text-foreground">
                    {brand.text}
                  </span>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
