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

export interface CategoryState {
  categories: Category[];
}

const initialState: CategoryState = {
  categories: [],
};

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    // Set categories data
    setCategories(state, action: PayloadAction<Category[]>) {
      state.categories = action.payload;
    },
  },
});

export const { setCategories } = categorySlice.actions;

// Export selectors
export const selectCategories = (state: { category: CategoryState }) => state.category.categories;

export default categorySlice.reducer;