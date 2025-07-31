import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WishlistItem {
  id: string;
  title: string;
  price: number;
  image: string;
  slug: string;
  category: string;
  brand: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  addedAt: string;
}

export interface WishlistState {
  items: WishlistItem[];
  count: number;
  loading: boolean;
  error: string | null;
  addingItem: boolean;
  removingItem: boolean;
  checkingItem: boolean;
}

const initialState: WishlistState = {
  items: [],
  count: 0,
  loading: false,
  error: null,
  addingItem: false,
  removingItem: false,
  checkingItem: false,
};

export const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    // Set wishlist items
    setWishlistItems(state, action: PayloadAction<WishlistItem[]>) {
      state.items = action.payload;
      state.error = null;
    },

    // Get wishlist items (fetch from API)
    getWishlistItems(state) {
      state.loading = true;
      state.error = null;
    },

    // Add item to wishlist
    addToWishlist(state, action: PayloadAction<WishlistItem>) {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (!existingItem) {
        state.items.push(action.payload);
        state.count += 1;
      }
      state.error = null;
    },

    // Remove item from wishlist
    removeFromWishlist(state, action: PayloadAction<string>) {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.count = Math.max(0, state.count - 1);
      state.error = null;
    },

    // Set wishlist count
    setWishlistCount(state, action: PayloadAction<number>) {
      state.count = action.payload;
      state.error = null;
    },

    // Get wishlist count (fetch from API)
    getWishlistCount(state) {
      state.loading = true;
      state.error = null;
    },

    // Check if item is in wishlist
    checkWishlistItem(state, action: PayloadAction<string>) {
      state.checkingItem = true;
      state.error = null;
    },

    // Set loading state
    setWishlistLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    // Set adding item state
    setAddingItem(state, action: PayloadAction<boolean>) {
      state.addingItem = action.payload;
    },

    // Set removing item state
    setRemovingItem(state, action: PayloadAction<boolean>) {
      state.removingItem = action.payload;
    },

    // Set checking item state
    setCheckingItem(state, action: PayloadAction<boolean>) {
      state.checkingItem = action.payload;
    },

    // Set error state
    setWishlistError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
      state.addingItem = false;
      state.removingItem = false;
      state.checkingItem = false;
    },

    // Clear wishlist
    clearWishlist(state) {
      state.items = [];
      state.count = 0;
      state.error = null;
    },

    // Toggle item in wishlist (add if not present, remove if present)
    toggleWishlistItem(state, action: PayloadAction<WishlistItem>) {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        state.items = state.items.filter(item => item.id !== action.payload.id);
        state.count = Math.max(0, state.count - 1);
      } else {
        state.items.push(action.payload);
        state.count += 1;
      }
      state.error = null;
    },
  },
});

export const {
  setWishlistItems,
  getWishlistItems,
  addToWishlist,
  removeFromWishlist,
  setWishlistCount,
  getWishlistCount,
  checkWishlistItem,
  setWishlistLoading,
  setAddingItem,
  setRemovingItem,
  setCheckingItem,
  setWishlistError,
  clearWishlist,
  toggleWishlistItem,
} = wishlistSlice.actions;

// Export selectors
export const selectWishlistItems = (state: { wishlist: WishlistState }) => state.wishlist.items;
export const selectWishlistCount = (state: { wishlist: WishlistState }) => state.wishlist.count;
export const selectWishlistLoading = (state: { wishlist: WishlistState }) => state.wishlist.loading;
export const selectWishlistError = (state: { wishlist: WishlistState }) => state.wishlist.error;
export const selectAddingItem = (state: { wishlist: WishlistState }) => state.wishlist.addingItem;
export const selectRemovingItem = (state: { wishlist: WishlistState }) => state.wishlist.removingItem;
export const selectCheckingItem = (state: { wishlist: WishlistState }) => state.wishlist.checkingItem;

export default wishlistSlice.reducer;
