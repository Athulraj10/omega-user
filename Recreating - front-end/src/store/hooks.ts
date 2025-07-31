import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "./index";
import {
  setBanners,
  selectBanners,
} from "./reducers/banner";
import {
  setCategories,
  selectCategories,
} from "./reducers/categorySlice";
import { Banner } from "../types";

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T) => useSelector<RootState, T>(selector);

// Banner hooks
export const useBanner = () => {
  const dispatch = useAppDispatch();
  
  const banners = useAppSelector(selectBanners);

  const setBannersData = (bannersData: Banner[]) => {
    dispatch(setBanners(bannersData));
  };

  return {
    // State
    banners,
    
    // Actions
    setBannersData,
  };
};

// Category hooks
export const useCategory = () => {
  const dispatch = useAppDispatch();
  
  const categories = useAppSelector(selectCategories);

  const setCategoriesData = (categoriesData: any[]) => {
    dispatch(setCategories(categoriesData));
  };

  return {
    // State
    categories,
    
    // Actions
    setCategoriesData,
  };
};
