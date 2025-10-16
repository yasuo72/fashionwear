import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface SaleCategory {
  title: string;
  description: string;
  discount: string;
  badge: string;
  gradient: string;
  icon: string;
  isActive: boolean;
}

export interface SaleConfig {
  _id?: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBadgeText: string;
  heroGradient: string;
  flashSaleEnabled: boolean;
  flashSaleTitle: string;
  flashSaleDescription: string;
  flashSaleCountdownHours: number;
  saleCategories: SaleCategory[];
  maxDiscount: string;
  flashSaleDuration: string;
  freeShippingThreshold: string;
  isActive: boolean;
}

// Public hook to get sale config
export function useSaleConfig() {
  return useQuery<{ config: SaleConfig }>({
    queryKey: ["/api/sale-config"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Admin hooks
export function useAdminSaleConfig() {
  return useQuery<{ config: SaleConfig }>({
    queryKey: ["/api/admin/sale-config"],
  });
}

export function useUpdateSaleConfig() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<SaleConfig>) => {
      const res = await fetch("/api/admin/sale-config", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/sale-config"] });
      queryClient.invalidateQueries({ queryKey: ["/api/sale-config"] });
    },
  });
}
