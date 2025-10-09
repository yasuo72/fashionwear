import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

// Types
export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  activeUsers: number;
  totalProducts: number;
  revenueGrowth: number;
  ordersGrowth: number;
  usersGrowth: number;
}

export interface AdminOrder {
  _id: string;
  orderNumber: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    size: string;
    color: string;
  }>;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface CreateProductData {
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: string[];
  categoryId: string;
  variants: Array<{
    size: string;
    color: string;
    stock: number;
  }>;
  brand: string;
  tags: string[];
  isFeatured: boolean;
  isActive: boolean;
}

export interface UpdateProductData extends Partial<CreateProductData> {
  _id: string;
}

// Admin Stats
export function useAdminStats() {
  return useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Orders Management
export function useAdminOrders() {
  return useQuery<{ orders: AdminOrder[] }>({
    queryKey: ["/api/admin/orders"],
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { orderId: string; status: string }) => {
      const response = await apiRequest("PATCH", `/api/admin/orders/${data.orderId}`, {
        status: data.status,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
    },
  });
}

// Product Management
export function useAdminProducts() {
  return useQuery<{ products: any[] }>({
    queryKey: ["/api/admin/products"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateProductData) => {
      const response = await apiRequest("POST", "/api/admin/products", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: UpdateProductData) => {
      const { _id, ...updateData } = data;
      const response = await apiRequest("PATCH", `/api/admin/products/${_id}`, updateData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (productId: string) => {
      const response = await apiRequest("DELETE", `/api/admin/products/${productId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
    },
  });
}

// User Management
export function useAdminUsers() {
  return useQuery<{ users: any[] }>({
    queryKey: ["/api/admin/users"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { userId: string; role: string }) => {
      const response = await apiRequest("PATCH", `/api/admin/users/${data.userId}`, {
        role: data.role,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
  });
}

// Analytics
export function useTopProducts() {
  return useQuery<{ products: Array<{ name: string; sales: number; revenue: number }> }>({
    queryKey: ["/api/admin/analytics/top-products"],
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useRecentActivity() {
  return useQuery<{ activities: Array<{ type: string; description: string; timestamp: string }> }>({
    queryKey: ["/api/admin/analytics/recent-activity"],
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Category Management
export function useAdminCategories() {
  return useQuery<{ categories: any[] }>({
    queryKey: ["/api/admin/categories"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { name: string; description: string; slug?: string; image?: string; isActive?: boolean }) => {
      const response = await apiRequest("POST", "/api/admin/categories", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/categories"] });
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { _id: string; [key: string]: any }) => {
      const { _id, ...updateData } = data;
      const response = await apiRequest("PATCH", `/api/admin/categories/${_id}`, updateData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/categories"] });
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (categoryId: string) => {
      const response = await apiRequest("DELETE", `/api/admin/categories/${categoryId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/categories"] });
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
    },
  });
}

// Coupon Management
export function useAdminCoupons() {
  return useQuery<{ coupons: any[] }>({
    queryKey: ["/api/admin/coupons"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateCoupon() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      code: string;
      type: string;
      value: number;
      minOrderAmount?: number;
      maxDiscountAmount?: number;
      usageLimit?: number;
      validFrom: string;
      validUntil: string;
      isActive?: boolean;
    }) => {
      const response = await apiRequest("POST", "/api/admin/coupons", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/coupons"] });
    },
  });
}

export function useUpdateCoupon() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { _id: string; [key: string]: any }) => {
      const { _id, ...updateData } = data;
      const response = await apiRequest("PATCH", `/api/admin/coupons/${_id}`, updateData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/coupons"] });
    },
  });
}

export function useDeleteCoupon() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (couponId: string) => {
      const response = await apiRequest("DELETE", `/api/admin/coupons/${couponId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/coupons"] });
    },
  });
}
