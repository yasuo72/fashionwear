import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

interface CategoryCardProps {
  id: string;
  name: string;
  image: string;
  productCount: number;
}

export function CategoryCard({ id, name, image, productCount }: CategoryCardProps) {
  return (
    <Link href={`/category/${id}`}>
      <div className="group relative cursor-pointer" style={{ perspective: '1000px' }}>

        {/* Hover glow border */}
        <div className="absolute -inset-[1px] bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-xl opacity-0 group-hover:opacity-100 blur-[1px] transition-all duration-300" />

        {/* Card */}
        <Card className="relative overflow-hidden rounded-xl border border-border/40 shadow-sm group-hover:shadow-xl group-hover:shadow-orange-500/20 transition-all duration-300 bg-card transform-gpu group-hover:rotateY-2 group-hover:rotateX-2 group-hover:scale-[1.02]">

          {/* Image container — landscape 16:9 ratio for compact height */}
          <div className="relative aspect-[16/9] overflow-hidden">

            {/* Image */}
            <img
              src={image}
              alt={name}
              className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  `https://placehold.co/400x225/1a1a1a/f59e0b?text=${encodeURIComponent(name)}`;
              }}
            />

            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            {/* Hover orange tint */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-orange-500/0 group-hover:from-amber-500/10 group-hover:to-orange-500/10 transition-all duration-300" />

            {/* Shine sweep on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden rounded-xl">
              <div className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12 group-hover:left-[150%] transition-all duration-700" />
            </div>

            {/* Bottom content */}
            <div className="absolute inset-0 p-3 flex flex-col justify-end">
              <div className="transform transition-all duration-300 group-hover:-translate-y-0.5">

                {/* Product count pill */}
                <div className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full px-2 py-0.5 mb-1.5 shadow-lg shadow-orange-500/30">
                  <div className="w-1 h-1 rounded-full bg-white animate-pulse" />
                  <span className="text-[9px] font-bold text-white tracking-wide">
                    {productCount} Products
                  </span>
                </div>

                {/* Category name */}
                <h3
                  className="text-sm md:text-base font-bold text-white leading-tight drop-shadow-lg"
                  data-testid={`text-category-name-${id}`}
                >
                  {name}
                </h3>

                {/* Shop Now CTA — only visible on hover */}
                <div className="flex items-center gap-1 text-white/0 group-hover:text-white transition-all duration-300 mt-0.5">
                  <span className="text-[10px] font-semibold">Shop Now</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-300" />
                </div>

              </div>
            </div>

          </div>
        </Card>
      </div>
    </Link>
  );
}