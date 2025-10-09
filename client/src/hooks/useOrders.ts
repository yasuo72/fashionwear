import { useQuery } from "@tanstack/react-query";

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  trackingNumber?: string;
}

export function useOrders() {
  return useQuery<{ orders: Order[] }>({
    queryKey: ["/api/orders"],
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useOrder(id: string) {
  return useQuery<{ order: Order }>({
    queryKey: [`/api/orders/${id}`],
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
