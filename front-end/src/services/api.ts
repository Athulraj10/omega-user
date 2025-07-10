// API Base URL - update this to match your backend URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

// Helper function to get auth token
const getAuthToken = () => {
   if (typeof window !== "undefined") {
      return localStorage.getItem("token") || sessionStorage.getItem("token")
   }
   return null
}

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
   if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Network error" }))
      throw new Error(error.message || `HTTP error! status: ${response.status}`)
   }
   return response.json()
}

// Generic API call function
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
   const token = getAuthToken()

   const config: RequestInit = {
      headers: {
         "Content-Type": "application/json",
         ...(token && { Authorization: `Bearer ${token}` }),
         ...options.headers,
      },
      ...options,
   }

   const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
   return handleResponse(response)
}

// Product API calls
export const productAPI = {
   // Get all products with filtering, sorting, and pagination
   getProducts: (params?: any) => {
      const queryString = params ? `?${new URLSearchParams(params).toString()}` : ""
      return apiCall(`/api/products${queryString}`)
   },

   // Get product by ID
   getProductById: (id: string) => apiCall(`/api/products/${id}`),

   // Get product by slug
   getProductBySlug: (slug: string) => apiCall(`/api/products/slug/${slug}`),

   // Get featured products
   getFeatured: (limit?: number) => {
      const queryString = limit ? `?limit=${limit}` : ""
      return apiCall(`/api/products/featured${queryString}`)
   },

   // Get trending products
   getTrending: (limit?: number) => {
      const queryString = limit ? `?limit=${limit}` : ""
      return apiCall(`/api/products/trending${queryString}`)
   },

   // Get bestsellers
   getBestsellers: (limit?: number) => {
      const queryString = limit ? `?limit=${limit}` : ""
      return apiCall(`/api/products/bestsellers${queryString}`)
   },

   // Get new arrivals
   getNewArrivals: (limit?: number) => {
      const queryString = limit ? `?limit=${limit}` : ""
      return apiCall(`/api/products/new-arrivals${queryString}`)
   },

   // Get deals
   getDeals: (limit?: number) => {
      const queryString = limit ? `?limit=${limit}` : ""
      return apiCall(`/api/products/deals${queryString}`)
   },

   // Search products
   searchProducts: (query: string, limit?: number, page?: number) => {
      const params = new URLSearchParams({ q: query })
      if (limit) params.append("limit", limit.toString())
      if (page) params.append("page", page.toString())
      return apiCall(`/api/products/search?${params.toString()}`)
   },

   // Get product categories
   getCategories: () => apiCall("/api/products/categories"),

   // Get product brands
   getBrands: () => apiCall("/api/products/brands"),

   // Get product filters
   getFilters: () => apiCall("/api/products/filters"),

   // Get similar products
   getSimilarProducts: (productId: string, limit?: number) => {
      const queryString = limit ? `?limit=${limit}` : ""
      return apiCall(`/api/products/${productId}/similar${queryString}`)
   },

   // Get related products
   getRelatedProducts: (productId: string, limit?: number) => {
      const queryString = limit ? `?limit=${limit}` : ""
      return apiCall(`/api/products/${productId}/related${queryString}`)
   },

   // Get product reviews
   getProductReviews: (
      productId: string,
      sort?: string,
      page?: number,
      limit?: number
   ) => {
      const params = new URLSearchParams()
      if (sort) params.append("sort", sort)
      if (page) params.append("page", page.toString())
      if (limit) params.append("limit", limit.toString())
      const queryString = params.toString() ? `?${params.toString()}` : ""
      return apiCall(`/api/products/${productId}/reviews${queryString}`)
   },

   // Get product ratings
   getProductRatings: (productId: string) =>
      apiCall(`/api/products/${productId}/ratings`),

   // Get product variants
   getProductVariants: (productId: string) =>
      apiCall(`/api/products/${productId}/variants`),

   // Check product availability
   checkAvailability: (productId: string, variantId?: string) => {
      const queryString = variantId ? `?variantId=${variantId}` : ""
      return apiCall(`/api/products/${productId}/availability${queryString}`)
   },

   // Get delivery options
   getDeliveryOptions: (productId: string) =>
      apiCall(`/api/products/${productId}/delivery-options`),

   // Get comparison data
   getCompareData: (productId: string) => apiCall(`/api/products/${productId}/compare`),
}

// Cart API calls
export const cartAPI = {
   // Get user cart
   getCart: () => apiCall("/api/cart"),

   // Add item to cart
   addToCart: (productData: any) =>
      apiCall("/api/cart/add", {
         method: "POST",
         body: JSON.stringify(productData),
      }),

   // Update cart item quantity
   updateQuantity: (productId: number, quantity: number) =>
      apiCall(`/api/cart/update/${productId}`, {
         method: "PUT",
         body: JSON.stringify({ quantity }),
      }),

   // Remove item from cart
   removeFromCart: (productId: number) =>
      apiCall(`/api/cart/remove/${productId}`, {
         method: "DELETE",
      }),

   // Clear cart
   clearCart: () =>
      apiCall("/api/cart/clear", {
         method: "DELETE",
      }),
}

// Wishlist API calls
export const wishlistAPI = {
   // Get user wishlist
   getWishlist: () => apiCall("/api/wishlist"),

   // Add item to wishlist
   addToWishlist: (productData: any) =>
      apiCall("/api/wishlist/add", {
         method: "POST",
         body: JSON.stringify(productData),
      }),

   // Remove item from wishlist
   removeFromWishlist: (productId: number) =>
      apiCall(`/api/wishlist/remove/${productId}`, {
         method: "DELETE",
      }),
}

// Authentication API calls
export const authAPI = {
   // Login
   login: (credentials: { email: string; password: string }) =>
      apiCall("/api/login", {
         method: "POST",
         body: JSON.stringify(credentials),
      }),

   // Register
   register: (userData: any) =>
      apiCall("/api/registration", {
         method: "POST",
         body: JSON.stringify(userData),
      }),

   // Logout
   logout: () =>
      apiCall("/api/logout", {
         method: "POST",
      }),

   // Get user profile
   getProfile: () => apiCall("/api/user_detail"),

   // Forgot password
   forgotPassword: (email: string) =>
      apiCall("/api/forgot_password", {
         method: "POST",
         body: JSON.stringify({ email }),
      }),

   // Reset password
   resetPassword: (token: string, password: string) =>
      apiCall("/api/reset_password", {
         method: "POST",
         body: JSON.stringify({ token, password }),
      }),

   // Verify email
   verifyEmail: (email: string, otp: string) =>
      apiCall("/api/email_verify", {
         method: "POST",
         body: JSON.stringify({ email, otp }),
      }),

   // Resend OTP
   resendOtp: (email: string) =>
      apiCall("/api/resend_otp", {
         method: "POST",
         body: JSON.stringify({ email }),
      }),

   // Check username availability
   checkUsername: (username: string) =>
      apiCall(`/api/username?username=${encodeURIComponent(username)}`),
}

// Orders API calls
export const ordersAPI = {
   // Get user orders
   getOrders: () => apiCall("/api/orders"),

   // Place new order
   createOrder: (orderData: any) =>
      apiCall("/api/orders/checkout", {
         method: "POST",
         body: JSON.stringify(orderData),
      }),

   // Get order by ID
   getOrderById: (orderId: string) => apiCall(`/api/orders/${orderId}`),

   // Cancel order
   cancelOrder: (orderId: string) =>
      apiCall(`/api/orders/${orderId}/cancel`, {
         method: "PUT",
      }),
}

export default apiCall
