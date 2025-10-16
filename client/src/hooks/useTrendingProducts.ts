import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Public hooks
export function useTrendingProducts(limit: number = 12) {
  return useQuery<{ products: any[] }>({
    queryKey: ["/api/products/trending", limit],
    queryFn: async () => {
      const res = await fetch(`/api/products/trending?limit=${limit}`);
      if (!res.ok) throw new Error('Failed to fetch trending products');
      return res.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useBestSellingProducts(limit: number = 12) {
  return useQuery<{ products: any[] }>({
    queryKey: ["/api/products/best-selling", limit],
    queryFn: async () => {
      const res = await fetch(`/api/products/best-selling?limit=${limit}`);
      if (!res.ok) throw new Error('Failed to fetch best selling products');
      return res.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Admin hooks
export function useToggleTrending() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, isTrending }: { id: string; isTrending: boolean }) => {
      const res = await fetch(`/api/admin/products/${id}/trending`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isTrending }),
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products/trending"] });
    },
  });
}

export function useToggleBestSelling() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, isBestSelling }: { id: string; isBestSelling: boolean }) => {
      const res = await fetch(`/api/admin/products/${id}/best-selling`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBestSelling }),
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products/best-selling"] });
    },
  });
}

export function useBulkToggleTrending() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ productIds, isTrending }: { productIds: string[]; isTrending: boolean }) => {
      const res = await fetch("/api/admin/products/bulk-trending", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productIds, isTrending }),
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products/trending"] });
    },
  });
}

export function useBulkToggleBestSelling() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ productIds, isBestSelling }: { productIds: string[]; isBestSelling: boolean }) => {
      const res = await fetch("/api/admin/products/bulk-best-selling", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productIds, isBestSelling }),
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products/best-selling"] });
    },
  });
}
