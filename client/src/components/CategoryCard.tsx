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
      <div className="group relative cursor-pointer">

        {/* Hover glow border */}
        <div className="absolute -inset-[2px] bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-2xl opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500" />

        {/* Card */}
        <Card className="relative overflow-hidden rounded-2xl border-0 shadow-md group-hover:shadow-2xl group-hover:shadow-orange-500/20 transition-all duration-500 bg-card">

          {/* Image container — square ratio, good for 4-col grid */}
          <div className="relative aspect-square overflow-hidden">

            {/* Image */}
            <img
              src={image}
              alt={name}
              className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  `https://placehold.co/400x400/1a1a1a/f59e0b?text=${encodeURIComponent(name)}`;
              }}
            />

            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Hover orange tint */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-orange-500/0 group-hover:from-amber-500/15 group-hover:to-orange-500/15 transition-all duration-500" />

            {/* Shine sweep on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden rounded-2xl">
              <div className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 group-hover:left-[150%] transition-all duration-1000" />
            </div>

            {/* Bottom content */}
            <div className="absolute inset-0 p-4 flex flex-col justify-end">
              <div className="transform transition-all duration-300 group-hover:-translate-y-1">

                {/* Product count pill */}
                <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full px-2.5 py-1 mb-2 shadow-lg shadow-orange-500/30">
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span className="text-[11px] font-bold text-white tracking-wide">
                    {productCount} Products
                  </span>
                </div>

                {/* Category name */}
                <h3
                  className="text-lg md:text-xl font-bold text-white leading-tight mb-2 drop-shadow-lg"
                  data-testid={`text-category-name-${id}`}
                >
                  {name}
                </h3>

                {/* Shop Now CTA — only visible on hover */}
                <div className="flex items-center gap-1.5 text-white/0 group-hover:text-white transition-all duration-300">
                  <span className="text-xs font-semibold">Shop Now</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                </div>

              </div>
            </div>

          </div>
        </Card>
      </div>
    </Link>
  );
}