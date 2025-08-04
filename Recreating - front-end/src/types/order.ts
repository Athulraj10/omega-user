export interface OrderItem {
  product: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

export interface OrderAddress {
  label?: string;
  addressLine1: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country: string;
  phone?: string;
}

export interface CreateOrderRequest {
  items: OrderItem[];
  shippingAddress: OrderAddress;
  billingAddress: OrderAddress;
  paymentMethod: 'cash_on_delivery' | 'credit_card' | 'paypal' | 'stripe';
  shippingMethod: 'free' | 'standard' | 'express';
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  notes?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  items: OrderItem[];
  shippingAddress: OrderAddress;
  billingAddress: OrderAddress;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  shippingMethod: string;
  shippingCost: number;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  notes?: string;
  cancelledAt?: string;
  cancelledBy?: string;
  cancellationReason?: string;
  deliveredAt?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderResponse {
  status: boolean;
  message: string;
  data: Order;
}

export interface OrdersListResponse {
  status: boolean;
  message: string;
  data: {
    orders: Order[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalOrders: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

export interface OrderStats {
  totalOrders: number;
  totalSpent: number;
  pendingOrders: number;
  confirmedOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
}

export interface CancelOrderRequest {
  cancellationReason: string;
}

export interface UpdateOrderStatusRequest {
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  trackingNumber?: string;
  estimatedDelivery?: string;
  notes?: string;
} 