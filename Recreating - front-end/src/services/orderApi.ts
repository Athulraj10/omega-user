import { 
  CreateOrderRequest, 
  Order, 
  OrdersListResponse, 
  OrderResponse, 
  OrderStats,
  CancelOrderRequest,
  UpdateOrderStatusRequest
} from '../types/order';

const BASE_URL = '/api/orders';

class OrderApiService {
  private static getAuthHeaders(): Record<string, string> {
    const token = JSON.parse(localStorage.getItem('token') || 'null');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  // Create a new order
  static async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    try {
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create order');
      }

      const result: OrderResponse = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  // Get user's order history
  static async getUserOrders(page: number = 1, limit: number = 10, status?: string): Promise<OrdersListResponse['data']> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (status) {
        params.append('status', status);
      }

      const response = await fetch(`${BASE_URL}?${params}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch orders');
      }

      const result: OrdersListResponse = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  // Get single order by ID
  static async getOrderById(id: string): Promise<Order> {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch order');
      }

      const result: OrderResponse = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }

  // Get order by order number
  static async getOrderByNumber(orderNumber: string): Promise<Order> {
    try {
      const response = await fetch(`${BASE_URL}/number/${orderNumber}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch order');
      }

      const result: OrderResponse = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }

  // Get order statistics
  static async getOrderStats(): Promise<OrderStats> {
    try {
      const response = await fetch(`${BASE_URL}/stats`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch order statistics');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching order statistics:', error);
      throw error;
    }
  }

  // Cancel order
  static async cancelOrder(id: string, cancellationData: CancelOrderRequest): Promise<Order> {
    try {
      const response = await fetch(`${BASE_URL}/${id}/cancel`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(cancellationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to cancel order');
      }

      const result: OrderResponse = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error cancelling order:', error);
      throw error;
    }
  }

  // Admin: Get all orders
  static async getAllOrders(page: number = 1, limit: number = 10, status?: string, userId?: string): Promise<OrdersListResponse['data']> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (status) {
        params.append('status', status);
      }
      
      if (userId) {
        params.append('userId', userId);
      }

      const response = await fetch(`${BASE_URL}/admin/all?${params}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch all orders');
      }

      const result: OrdersListResponse = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching all orders:', error);
      throw error;
    }
  }

  // Admin: Update order status
  static async updateOrderStatus(id: string, statusData: UpdateOrderStatusRequest): Promise<Order> {
    try {
      const response = await fetch(`${BASE_URL}/admin/${id}/status`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(statusData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update order status');
      }

      const result: OrderResponse = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }
}

export default OrderApiService; 