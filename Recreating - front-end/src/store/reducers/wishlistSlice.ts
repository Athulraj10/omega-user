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
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },

    setWishlistData(state, action: PayloadAction<any>) {
      state.items = action.payload
    },

    
}});

export const {
  setLoading,
  setError,
  setWishlistData,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
