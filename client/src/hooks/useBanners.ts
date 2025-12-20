import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Banner {
  _id: string;
  text: string;
  type: 'badge' | 'announcement' | 'promo';
  location: 'hero' | 'navbar' | 'footer' | 'category' | 'brands';
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Public hook to get active banners
export function useBanners(location?: string) {
  const query = location ? `?location=${location}` : '';
  return useQuery<{ banners: Banner[] }>({
    queryKey: ["/api/banners", location],
    queryFn: async () => {
      const res = await fetch(`/api/banners${query}`);
      if (!res.ok) throw new Error('Failed to fetch banners');
      return res.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Admin hooks
export function useAdminBanners() {
  return useQuery<{ banners: Banner[] }>({
    queryKey: ["/api/admin/banners"],
  });
}

export function useCreateBanner() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<Banner>) => {
      const res = await fetch("/api/admin/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/banners"] });
      queryClient.invalidateQueries({ queryKey: ["/api/banners"] });
    },
  });
}

export function useUpdateBanner() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Banner> }) => {
      const res = await fetch(`/api/admin/banners/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/banners"] });
      queryClient.invalidateQueries({ queryKey: ["/api/banners"] });
    },
  });
}

export function useDeleteBanner() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/banners/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/banners"] });
      queryClient.invalidateQueries({ queryKey: ["/api/banners"] });
    },
  });
}
