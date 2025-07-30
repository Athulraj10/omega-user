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

interface WishlistData {
  items: WishlistItem[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

interface WishlistResponse {
  data: WishlistData;
  meta: {
    code: number;
    message: string;
  };
}

export interface WishlistState {
  items: WishlistItem[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
  addingItem: boolean;
  removingItem: boolean;
  clearingWishlist: boolean;
}

const initialState: WishlistState = {
  items: [],
  totalItems: 0,
  totalPages: 0,
  currentPage: 1,
  loading: false,
  error: null,
  lastFetched: null,
  addingItem: false,
  removingItem: false,
  clearingWishlist: false,
};

export const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    // Set loading state
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    // Set error state
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },

    // Set wishlist data
    setWishlistData(state, action: PayloadAction<WishlistData>) {
      state.items = action.payload.items;
      state.totalItems = action.payload.totalItems;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
      state.error = null;
      state.lastFetched = Date.now();
    },

    // Set wishlist from API response
    setWishlistFromAPI(state, action: PayloadAction<WishlistResponse>) {
      if (action.payload?.data) {
        state.items = action.payload.data.items;
        state.totalItems = action.payload.data.totalItems;
        state.totalPages = action.payload.data.totalPages;
        state.currentPage = action.payload.data.currentPage;
        state.error = null;
        state.lastFetched = Date.now();
      } else {
        state.items = [];
        state.totalItems = 0;
        state.totalPages = 0;
        state.currentPage = 1;
        state.error = "Invalid data format";
      }
    },

    // Clear wishlist
    clearWishlist(state) {
      state.items = [];
      state.totalItems = 0;
      state.totalPages = 0;
      state.currentPage = 1;
      state.error = null;
      state.lastFetched = null;
    },

    // Add item to wishlist
    addItemToWishlist(state, action: PayloadAction<WishlistItem>) {
      const existingIndex = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (existingIndex >= 0) {
        // Update existing item
        state.items[existingIndex] = action.payload;
      } else {
        // Add new item
        state.items.push(action.payload);
        state.totalItems += 1;
      }
      state.error = null;
    },

    // Remove item from wishlist
    removeItemFromWishlist(state, action: PayloadAction<string>) {
      const index = state.items.findIndex(
        (item) => item.id === action.payload
      );
      if (index >= 0) {
        state.items.splice(index, 1);
        state.totalItems = Math.max(0, state.totalItems - 1);
      }
    },

    // Set adding item state
    setAddingItem(state, action: PayloadAction<boolean>) {
      state.addingItem = action.payload;
    },

    // Set removing item state
    setRemovingItem(state, action: PayloadAction<boolean>) {
      state.removingItem = action.payload;
    },

    // Set clearing wishlist state
    setClearingWishlist(state, action: PayloadAction<boolean>) {
      state.clearingWishlist = action.payload;
    },

    // Reset state
    resetWishlistState(state) {
      state.items = [];
      state.totalItems = 0;
      state.totalPages = 0;
      state.currentPage = 1;
      state.loading = false;
      state.error = null;
      state.lastFetched = null;
      state.addingItem = false;
      state.removingItem = false;
      state.clearingWishlist = false;
    },
  },
});

export const {
  setLoading,
  setError,
  setWishlistData,
  setWishlistFromAPI,
  clearWishlist,
  addItemToWishlist,
  removeItemFromWishlist,
  setAddingItem,
  setRemovingItem,
  setClearingWishlist,
  resetWishlistState,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
