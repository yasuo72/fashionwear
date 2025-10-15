import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface SiteSettings {
  _id?: string;
  storeName: string;
  storeEmail: string;
  storePhone?: string;
  storeAddress?: string;
  freeDeliveryThreshold: number;
  standardShippingCost: number;
  expressShippingCost: number;
  saleEnabled: boolean;
  salePercentage?: number;
  saleStartDate?: string;
  saleEndDate?: string;
  taxEnabled: boolean;
  taxPercentage: number;
  facebookUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  maintenanceMode: boolean;
  maintenanceMessage?: string;
}

// Public hook to get site settings
export function useSettings() {
  return useQuery<{ settings: SiteSettings }>({
    queryKey: ["/api/settings"],
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Admin hooks
export function useAdminSettings() {
  return useQuery<{ settings: SiteSettings }>({
    queryKey: ["/api/admin/settings"],
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<SiteSettings>) => {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
    },
  });
}

// Sale management hooks
export function useToggleProductSale() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, isOnSale }: { id: string; isOnSale: boolean }) => {
      const res = await fetch(`/api/admin/products/${id}/sale`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isOnSale }),
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products/on-sale"] });
    },
  });
}

export function useBulkToggleSale() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ productIds, isOnSale }: { productIds: string[]; isOnSale: boolean }) => {
      const res = await fetch("/api/admin/products/bulk-sale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productIds, isOnSale }),
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products/on-sale"] });
    },
  });
}
