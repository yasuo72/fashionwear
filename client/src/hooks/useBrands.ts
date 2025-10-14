import { useQuery } from "@tanstack/react-query";

export function useBrands() {
  return useQuery<{ brands: string[] }>({
    queryKey: ["/api/brands"],
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
