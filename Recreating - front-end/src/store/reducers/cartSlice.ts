import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Item {
  _id: number;
  title: string;
  oldPrice: number;
  waight: string;
  image: string;
  imageTwo: string;
  date: string;
  status: string;
  rating: number;
  newPrice: number;
  location: string;
  brand: string;
  sku: number;
  category: string;
  quantity: number;
}

interface Order {
  orderId: string;
  date: string;
  shippingMethod: string;
  totalItems: number;
  totalPrice: number;
  status: string;
  products: Item[];
  address: any;
}

export interface CartState {
  items: Item[];
  orders: Order[];
  isSwitchOn: boolean;
  count: number;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  orders: [],
  isSwitchOn:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("switch") || "false")
      : false,
  count: 0,
  loading: false,
  error: null,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Set cart items
    setCartItems(state, action: PayloadAction<Item[]>) {
      state.items = action.payload;
      state.error = null;
    },

    // Get cart items (fetch from API)
    getCartItems(state) {
      state.loading = true;
      state.error = null;
    },

    // Add item to cart
    addToCart(state, action: PayloadAction<Item>) {
      const existingItem = state.items.find(item => item._id === action.payload._id);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      state.error = null;
    },

    // Update cart item quantity
    updateCartItem(state, action: PayloadAction<{ productId: number; quantity: number }>) {
      const item = state.items.find(item => item._id === action.payload.productId);
      if (item) {
        item.quantity = action.payload.quantity;
      }
      state.error = null;
    },

    // Remove item from cart
    removeFromCart(state, action: PayloadAction<number>) {
      state.items = state.items.filter(item => item._id !== action.payload);
      state.error = null;
    },

    // Set cart count
    setCartCount(state, action: PayloadAction<number>) {
      state.count = action.payload;
      state.error = null;
    },

    // Get cart count (fetch from API)
    getCartCount(state) {
      state.loading = true;
      state.error = null;
    },

    // Set loading state
    setCartLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    // Set error state
    setCartError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },

    // Clear cart
    clearCart(state) {
      state.items = [];
      state.count = 0;
      state.error = null;
    },

    // Toggle switch
    toggleSwitch(state) {
      state.isSwitchOn = !state.isSwitchOn;
      if (typeof window !== "undefined") {
        localStorage.setItem("switch", JSON.stringify(state.isSwitchOn));
      }
    },
  },
});

export const {
  setCartItems,
  getCartItems,
  addToCart,
  updateCartItem,
  removeFromCart,
  setCartCount,
  getCartCount,
  setCartLoading,
  setCartError,
  clearCart,
  toggleSwitch,
} = cartSlice.actions;

// Export selectors
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartCount = (state: { cart: CartState }) => state.cart.count;
export const selectCartLoading = (state: { cart: CartState }) => state.cart.loading;
export const selectCartError = (state: { cart: CartState }) => state.cart.error;
export const selectCartSwitch = (state: { cart: CartState }) => state.cart.isSwitchOn;

export default cartSlice.reducer;
