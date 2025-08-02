import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// types/wishlist.d.ts or inside slice file
export const selectWishlistItems = (state: RootState) => state.wishlist.items;

export interface WishlistItem {
  id: string;
  title: string;
  image: string;
  [key: string]: any; // for extra fields like sku, price etc.
}

export interface WishlistState {
  items: WishlistItem[];
  error: string | null;
}


const initialState: WishlistState = {
  items: [],
  error: null,
};

export const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    // ✅ Set wishlist from API
    setWishlistItems(state, action: PayloadAction<WishlistItem[]>) {
      state.items = action.payload;
      state.error = null;
    },

    // ✅ Add item to wishlist (if not already added)
    addToWishlist(state, action: PayloadAction<WishlistItem>) {
      const exists = state.items.find(item => item.id === action.payload.id);
      if (!exists) {
        state.items.push(action.payload);
      }
    },

    // ✅ Remove item from wishlist
    removeFromWishlist(state, action: PayloadAction<string>) {
      state.items = state.items.filter(item => item.id !== action.payload);
    },

    // ✅ Clear wishlist
    clearWishlist(state) {
      state.items = [];
    },
  },
});

export const {
  setWishlistItems,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
