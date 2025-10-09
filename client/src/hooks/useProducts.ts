import { useQuery } from "@tanstack/react-query";

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: string[];
  variants: Array<{
    size: string;
    color: string;
    stock: number;
  }>;
  brand: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isActive: boolean;
  categoryId: {
    _id: string;
    name: string;
    slug: string;
  };
}

export interface ProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export function useProducts(params?: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  search?: string;
  sort?: string;
  order?: string;
  page?: number;
  limit?: number;
}) {
  const queryParams = new URLSearchParams();
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
  }

  const queryString = queryParams.toString();
  const url = `/api/products${queryString ? `?${queryString}` : ''}`;

  return useQuery<ProductsResponse>({
    queryKey: [url],
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useProduct(slug: string) {
  return useQuery<{ product: Product }>({
    queryKey: [`/api/products/${slug}`],
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
