import { Link } from "wouter";
import { Card } from "@/components/ui/card";

interface CategoryCardProps {
  id: string;
  name: string;
  image: string;
  productCount: number;
}

export function CategoryCard({ id, name, image, productCount }: CategoryCardProps) {
  return (
    <Link href={`/category/${id}`}>
      <Card className="group overflow-hidden hover-elevate transition-all duration-300 cursor-pointer">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h3 className="text-2xl font-semibold mb-1" data-testid={`text-category-name-${id}`}>{name}</h3>
            <p className="text-sm text-white/80" data-testid={`text-category-count-${id}`}>
              {productCount} Products
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
