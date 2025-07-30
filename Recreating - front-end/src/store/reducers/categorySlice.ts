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
    setCategories(state, action: PayloadAction<Category[]>) {
      state.categories = action.payload;
      state.error = null;
      state.lastFetched = Date.now();
    },

    // Clear categories
    clearCategories(state) {
      state.categories = [];
      state.error = null;
      state.lastFetched = null;
    },

    // Add single category
    addCategory(state, action: PayloadAction<Category>) {
      const existingIndex = state.categories.findIndex(
        (cat) => cat.id === action.payload.id
      );
      if (existingIndex >= 0) {
        state.categories[existingIndex] = action.payload;
      } else {
        state.categories.push(action.payload);
      }
    },

    // Update single category
    updateCategory(state, action: PayloadAction<Category>) {
      const index = state.categories.findIndex(
        (cat) => cat.id === action.payload.id
      );
      if (index >= 0) {
        state.categories[index] = action.payload;
      }
    },

    // Remove single category
    removeCategory(state, action: PayloadAction<string>) {
      state.categories = state.categories.filter(
        (cat) => cat.id !== action.payload
      );
    },

    // Set categories from API response
    setCategoriesFromAPI(state, action: PayloadAction<CategoriesData>) {
      if (action.payload?.data) {
        state.categories = action.payload.data;
        state.error = null;
        state.lastFetched = Date.now();
      } else {
        state.categories = [];
        state.error = "Invalid data format";
      }
    },

    // Reset state
    resetCategoryState(state) {
      state.categories = [];
      state.loading = false;
      state.error = null;
      state.lastFetched = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setCategories,
  clearCategories,
  addCategory,
  updateCategory,
  removeCategory,
  setCategoriesFromAPI,
  resetCategoryState,
} = categorySlice.actions;

export default categorySlice.reducer;