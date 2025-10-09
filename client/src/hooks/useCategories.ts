import { useQuery } from "@tanstack/react-query";

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  isActive: boolean;
}

export function useCategories() {
  return useQuery<{ categories: Category[] }>({
    queryKey: ["/api/categories"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
