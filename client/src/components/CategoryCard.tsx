import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { ArrowRight, Sparkles } from "lucide-react";

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
        {/* Gradient Glow Border */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-600 rounded-2xl blur opacity-0 group-hover:opacity-75 transition duration-500"></div>
        
        {/* Main Card */}
        <Card className="relative overflow-hidden rounded-2xl border-0 shadow-xl group-hover:shadow-2xl transition-all duration-500">
          <div className="relative aspect-square overflow-hidden">
            {/* Image with zoom effect */}
            <img
              src={image}
              alt={name}
              className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-2"
            />
            
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Sparkle Effect */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="relative">
                <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
                <div className="absolute inset-0 bg-yellow-400 blur-lg opacity-50"></div>
              </div>
            </div>
            
            {/* Content */}
            <div className="absolute inset-0 p-6 flex flex-col justify-end">
              <div className="transform transition-all duration-300 group-hover:translate-y-0 translate-y-2">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3 py-1 mb-3">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 animate-pulse"></div>
                  <span className="text-xs font-medium text-white/90" data-testid={`text-category-count-${id}`}>
                    {productCount} Products
                  </span>
                </div>
                
                <h3 
                  className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg"
                  data-testid={`text-category-name-${id}`}
                >
                  {name}
                </h3>
                
                {/* Arrow Button */}
                <div className="flex items-center gap-2 text-white/80 group-hover:text-white transition-colors">
                  <span className="text-sm font-medium">Explore</span>
                  <ArrowRight className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </div>
            
            {/* Shine Effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:left-full transition-all duration-1000"></div>
            </div>
          </div>
        </Card>
      </div>
    </Link>
  );
}
