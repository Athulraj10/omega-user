import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Category {
  id: string;
  name: string;
  icon: string;
  image: string;
  slug: string;
  description: string;
  item: number;
  num: number;
  persantine: string;
  subcategories?: Category[];
}

interface CategoriesData {
  data: Category[];
  message?: string;
  meta?: {
    code: number;
    message: string;
  };
}

export interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
  lastFetched: null,
};

export const categorySlice = createSlice({
  name: "category",
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

    // Set categories data
    setCategories(state, action: PayloadAction<any>) {
      state.categories = action.payload;
      state.error = null;
      state.lastFetched = Date.now();
    },
  },
});

export const {
  setLoading,
  setError,
  setCategories,
} = categorySlice.actions;

export default categorySlice.reducer;