import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Item {
  id: number;
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

export interface CompareState {
  compare: Item[];
}

const initialState: CompareState = {
  compare: [],
};

export const compareSlice = createSlice({
  name: "compare",
  initialState,
  reducers: {
    setCompare(state, action: PayloadAction<Item[]>) {
      state.compare = action.payload;
    },
    addCompare(state, action: PayloadAction<Item>) {
      const exists = state.compare.find((item) => item.id === action.payload.id);
      if (!exists) {
        state.compare.push(action.payload);
      }
    },
    removeCompareItem(state, action: PayloadAction<number>) {
      state.compare = state.compare.filter((item) => item.id !== action.payload);
    },
    clearCompare(state) {
      state.compare = [];
    },
  },
});

export const {
  setCompare,
  addCompare,
  removeCompareItem,
  clearCompare,
} = compareSlice.actions;

export default compareSlice.reducer;
