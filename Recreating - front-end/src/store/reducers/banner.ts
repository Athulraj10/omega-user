import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Banner } from "../../types";

// Banner state interface
interface BannerState {
  banners: Banner[];
}

// Initial state
const initialState: BannerState = {
  banners: [],
};

// Create banner slice
const bannerSlice = createSlice({
  name: "banner",
  initialState,
  reducers: {
    // Set all banners
    setBanners: (state, action: PayloadAction<Banner[]>) => {
      state.banners = action.payload;
    },
  },
});

// Export actions
export const { setBanners } = bannerSlice.actions;

// Export selectors
export const selectBanners = (state: { banner: BannerState }) => state.banner.banners;

// Export reducer
export default bannerSlice.reducer;
