import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "./index";

// Banner
import { setBanners, selectBanners } from "./reducers/banner";
// Category
import { setCategories, selectCategories } from "./reducers/categorySlice";
// Product
import { setProducts, selectProducts } from "./reducers/productSlice";
// Deal
import { setDeals, selectDeals } from "./reducers/dealSlice";
// Cart
import {
  addToCart,
  removeFromCart,
  clearCart,
  selectCartItems,
} from "./reducers/cartSlice";
// Wishlist
import {
  setWishlistItems,
  addToWishlist,
  removeFromWishlist,
  selectWishlistItems,
} from "./reducers/wishlistSlice";

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T) =>
  useSelector<RootState, T>(selector);

// ───────────────────────────────────────────────────────────
// Banner Hook
export const useBanner = () => {
  const dispatch = useAppDispatch();
  const banners = useAppSelector(selectBanners);

  const setBannersData = (bannersData: any[]) => {
    dispatch(setBanners(bannersData));
  };

  return {
    banners,
    setBannersData,
  };
};

// ───────────────────────────────────────────────────────────
// Category Hook
export const useCategory = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(selectCategories);

  const setCategoriesData = (categoriesData: any[]) => {
    dispatch(setCategories(categoriesData));
  };

  return {
    categories,
    setCategoriesData,
  };
};

// ───────────────────────────────────────────────────────────
// Product Hook
export const useProduct = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts);

  const setProductsData = (productData: any[]) => {
    dispatch(setProducts(productData));
  };

  return {
    products,
    setProductsData,
  };
};

// ───────────────────────────────────────────────────────────
// Deal Hook
export const useDeal = () => {
  const dispatch = useAppDispatch();
  const deals = useAppSelector(selectDeals);

  const setDealsData = (dealsData: any[]) => {
    dispatch(setDeals(dealsData));
  };

  return {
    deals,
    setDealsData,
  };
};

// ───────────────────────────────────────────────────────────
// Cart Hook
export const useCart = () => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);

  const addToCartData = (item: any) => {
    dispatch(addToCart(item));
  };

  const removeFromCartData = (itemId: string) => {
    dispatch(removeFromCart(itemId));
  };

  const clearCartData = () => {
    dispatch(clearCart());
  };

  return {
    cartItems,
    addToCartData,
    removeFromCartData,
    clearCartData,
  };
};

// ───────────────────────────────────────────────────────────
// Wishlist Hook
export const useWishlist = () => {
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector(selectWishlistItems);

  const setWishlistItemsData = (itemsData: any[]) => {
    dispatch(setWishlistItems(itemsData));
  };

  const addToWishlistData = (item: any) => {
    dispatch(addToWishlist(item));
  };

  const removeFromWishlistData = (itemId: string) => {
    dispatch(removeFromWishlist(itemId));
  };

  return {
    wishlistItems,
    setWishlistItemsData,
    addToWishlistData,
    removeFromWishlistData,
  };
};
