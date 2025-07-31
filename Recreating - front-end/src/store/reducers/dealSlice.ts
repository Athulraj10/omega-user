import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Deal {
  _id: string;
  name: string;
  description: string;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  products: string[];
  status: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface DealState {
  deals: Deal[];
}

const initialState: DealState = {
  deals: [],
};

export const dealSlice = createSlice({
  name: "deal",
  initialState,
  reducers: {
    // Set deals data
    setDeals(state, action: PayloadAction<Deal[]>) {
      state.deals = action.payload;
    },
  },
});

export const { setDeals } = dealSlice.actions;

// Export selectors
export const selectDeals = (state: { deal: DealState }) => state.deal.deals;

export default dealSlice.reducer; 