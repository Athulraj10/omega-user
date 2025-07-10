// API Base URL - update this to match your backend URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Helper function to get auth token
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }
  return null;
};

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Generic API call function
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  return handleResponse(response);
};

// Product API calls
export const productAPI = {
  // Get all products
  getProducts: (params?: any) => {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return apiCall(`/api/products${queryString}`);
  },

  // Get featured products
  getFeatured: () => apiCall('/api/products/featured'),

  // Get trending products
  getTrending: () => apiCall('/api/products/trending'),

  // Get bestsellers
  getBestsellers: () => apiCall('/api/products/bestsellers'),

  // Get new arrivals
  getNewArrivals: () => apiCall('/api/products/new-arrivals'),

  // Get deals
  getDeals: () => apiCall('/api/products/deals'),

  // Search products
  searchProducts: (query: string) => apiCall(`/api/products/search?q=${encodeURIComponent(query)}`),

  // Get product by slug
  getProductBySlug: (slug: string) => apiCall(`/api/products/${slug}`),

  // Get product categories
  getCategories: () => apiCall('/api/products/categories'),

  // Get product brands
  getBrands: () => apiCall('/api/products/brands'),

  // Get product filters
  getFilters: () => apiCall('/api/products/filters'),
};

// Cart API calls
export const cartAPI = {
  // Get user cart
  getCart: () => apiCall('/api/cart'),

  // Add item to cart
  addToCart: (productData: any) => apiCall('/api/cart/add', {
    method: 'POST',
    body: JSON.stringify(productData),
  }),

  // Update cart item quantity
  updateQuantity: (productId: number, quantity: number) => apiCall(`/api/cart/update/${productId}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity }),
  }),

  // Remove item from cart
  removeFromCart: (productId: number) => apiCall(`/api/cart/remove/${productId}`, {
    method: 'DELETE',
  }),

  // Clear cart
  clearCart: () => apiCall('/api/cart/clear', {
    method: 'DELETE',
  }),
};

// Wishlist API calls
export const wishlistAPI = {
  // Get user wishlist
  getWishlist: () => apiCall('/api/wishlist'),

  // Add item to wishlist
  addToWishlist: (productData: any) => apiCall('/api/wishlist/add', {
    method: 'POST',
    body: JSON.stringify(productData),
  }),

  // Remove item from wishlist
  removeFromWishlist: (productId: number) => apiCall(`/api/wishlist/remove/${productId}`, {
    method: 'DELETE',
  }),
};

// Authentication API calls
export const authAPI = {
  // Login
  login: (credentials: { email: string; password: string }) => apiCall('/api/authentication/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),

  // Register
  register: (userData: any) => apiCall('/api/authentication/registration', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  // Logout
  logout: () => apiCall('/api/authentication/logout', {
    method: 'POST',
  }),

  // Get user profile
  getProfile: () => apiCall('/api/authentication/user_detail'),

  // Forgot password
  forgotPassword: (email: string) => apiCall('/api/authentication/forgot_password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),

  // Reset password
  resetPassword: (token: string, password: string) => apiCall('/api/authentication/reset_password', {
    method: 'POST',
    body: JSON.stringify({ token, password }),
  }),
};

// Orders API calls
export const ordersAPI = {
  // Get user orders
  getOrders: () => apiCall('/api/orders'),

  // Create new order
  createOrder: (orderData: any) => apiCall('/api/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),

  // Get order by ID
  getOrderById: (orderId: string) => apiCall(`/api/orders/${orderId}`),
};

export default apiCall; 