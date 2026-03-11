import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-lg bg-muted",
        className
      )}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="group relative rounded-xl overflow-hidden border border-border/50 bg-card shadow-lg">
      {/* Image Skeleton */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-muted via-muted/80 to-muted/50">
        <Skeleton className="absolute inset-0" />
        
        {/* Badge placeholders */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        
        {/* Wishlist button placeholder */}
        <Skeleton className="absolute top-3 right-3 h-10 w-10 rounded-full" />
      </div>
      
      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        
        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-3.5 w-3.5 rounded-sm" />
            ))}
          </div>
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-3 w-16" />
        </div>
        
        {/* Price */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-7 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
        
        {/* Button */}
        <Skeleton className="h-9 w-full rounded-lg" />
      </div>
    </div>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="group relative rounded-xl overflow-hidden border border-border/50 bg-card shadow-lg">
      <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-muted via-muted/80 to-muted/50">
        <Skeleton className="absolute inset-0" />
        
        {/* Badge */}
        <div className="absolute top-4 left-4">
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        
        {/* Content overlay */}
        <div className="absolute inset-0 p-5 flex flex-col justify-end">
          <Skeleton className="h-6 w-24 rounded-full mb-3" />
          <Skeleton className="h-8 w-3/4 rounded-lg mb-3" />
          <Skeleton className="h-10 w-28 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {[...Array(count)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function CategoryGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {[...Array(count)].map((_, i) => (
        <CategoryCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <section className="relative w-full min-h-[90vh] overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div className="max-w-2xl space-y-6">
            {/* Badge */}
            <Skeleton className="h-10 w-40 rounded-full" />
            
            {/* Heading */}
            <Skeleton className="h-14 w-3/4" />
            <Skeleton className="h-14 w-1/2" />
            
            {/* Subtitle */}
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-2/3" />
            
            {/* Stats */}
            <div className="flex gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-16 w-16 rounded-2xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Buttons */}
            <div className="flex gap-4">
              <Skeleton className="h-14 w-40 rounded-xl" />
              <Skeleton className="h-14 w-36 rounded-xl" />
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="hidden lg:block">
            <Skeleton className="aspect-[4/5] max-h-[550px] w-full rounded-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="border-b border-border/50">
      {[...Array(columns)].map((_, i) => (
        <td key={i} className="p-4">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

export function TableSkeleton({ rows = 5, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <div className="rounded-xl border border-border/50 overflow-hidden">
      <table className="w-full">
        <tbody>
          {[...Array(rows)].map((_, i) => (
            <TableRowSkeleton key={i} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
