import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// types/cart.d.ts or inside slice file

export interface CartItem {
  id: string;
  title: string;
  image: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  [key: string]: any; // for other optional fields
}

export interface CartState {
  items: CartItem[];
  orders: any[];
  count: number;
  loading: boolean;
  error: string | null;
}


const initialState: CartState = {
  items: [],
  orders: [],
  count: 0,
  loading: false,
  error: null,
};
export const selectCartItems = (state: RootState) => state.cart.items;

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // ✅ Set all cart items (used during initial fetch)
    setCartItems(state, action: PayloadAction<{ items: CartItem[] }>) {
      state.items = action.payload.items;
      state.count = action.payload.items.reduce((sum, item) => sum + item.quantity, 0);
      state.error = null;
    },

    // ✅ Add or update a cart item
    addToCart(state, action: PayloadAction<CartItem>) {
      const item = action.payload;
      const existing = state.items.find(i => i.id === item.id);

      if (existing) {
        existing.quantity += item.quantity;
        existing.totalPrice = existing.unitPrice * existing.quantity;
      } else {
        state.items.push({ ...item, totalPrice: item.unitPrice * item.quantity });
      }

      state.count = state.items.reduce((sum, i) => sum + i.quantity, 0);
    },

    // ✅ Update quantity or other fields
    updateCartItem(state, action: PayloadAction<{ id: string; updates: Partial<CartItem> }>) {
      const { id, updates } = action.payload;
      const item = state.items.find(i => i.id === id);
      if (item) {
        Object.assign(item, updates);
        if (updates.quantity !== undefined) {
          item.totalPrice = item.unitPrice * item.quantity;
        }
      }

      state.count = state.items.reduce((sum, i) => sum + i.quantity, 0);
    },

    // ✅ Remove from cart
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.count = state.items.reduce((sum, i) => sum + i.quantity, 0);
    },

    // ✅ Clear cart
    clearCart(state) {
      state.items = [];
      state.count = 0;
    },
  },
});

export const {
  setCartItems,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
