import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export interface Address {
  _id: string;
  userId: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export function useAddresses() {
  return useQuery<{ addresses: Address[] }>({
    queryKey: ["/api/addresses"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Omit<Address, '_id' | 'userId'>) => {
      const response = await apiRequest("POST", "/api/addresses", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/addresses"] });
    },
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { id: string; updates: Partial<Omit<Address, '_id' | 'userId'>> }) => {
      const response = await apiRequest("PATCH", `/api/addresses/${data.id}`, data.updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/addresses"] });
    },
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/addresses/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/addresses"] });
    },
  });
}
