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
import {
  setProducts,
  selectProducts,
} from "./reducers/productSlice";
import {
  setDeals,
  selectDeals,
} from "./reducers/dealSlice";
import {
  setCartItems,
  getCartItems,
  addToCart,
  updateCartItem,
  removeFromCart,
  setCartCount,
  getCartCount,
  setCartLoading,
  setCartError,
  clearCart,
  toggleSwitch,
  selectCartItems,
  selectCartCount,
  selectCartLoading,
  selectCartError,
  selectCartSwitch,
} from "./reducers/cartSlice";
import {
  setWishlistItems,
  getWishlistItems,
  addToWishlist,
  removeFromWishlist,
  setWishlistCount,
  getWishlistCount,
  checkWishlistItem,
  setWishlistLoading,
  setAddingItem,
  setRemovingItem,
  setCheckingItem,
  setWishlistError,
  clearWishlist,
  toggleWishlistItem,
  selectWishlistItems,
  selectWishlistCount,
  selectWishlistLoading,
  selectWishlistError,
  selectAddingItem,
  selectRemovingItem,
  selectCheckingItem,
} from "./reducers/wishlistSlice";
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

// Product hooks
export const useProduct = () => {
  const dispatch = useAppDispatch();
  
  const products = useAppSelector(selectProducts);

  const setProductsData = (productsData: any[]) => {
    dispatch(setProducts(productsData));
  };

  return {
    // State
    products,
    
    // Actions
    setProductsData,
  };
};

// Deal hooks
export const useDeal = () => {
  const dispatch = useAppDispatch();
  
  const deals = useAppSelector(selectDeals);

  const setDealsData = (dealsData: any[]) => {
    dispatch(setDeals(dealsData));
  };

  return {
    // State
    deals,
    
    // Actions
    setDealsData,
  };
};

// Cart hooks
export const useCart = () => {
  const dispatch = useAppDispatch();
  
  const items = useAppSelector(selectCartItems);
  const count = useAppSelector(selectCartCount);
  const loading = useAppSelector(selectCartLoading);
  const error = useAppSelector(selectCartError);
  const isSwitchOn = useAppSelector(selectCartSwitch);

  const setCartItemsData = (itemsData: any[]) => {
    dispatch(setCartItems(itemsData));
  };

  const getCartItemsData = () => {
    dispatch(getCartItems());
  };

  const addToCartData = (item: any) => {
    dispatch(addToCart(item));
  };

  const updateCartItemData = (productId: number, quantity: number) => {
    dispatch(updateCartItem({ productId, quantity }));
  };

  const removeFromCartData = (productId: number) => {
    dispatch(removeFromCart(productId));
  };

  const setCartCountData = (countData: number) => {
    dispatch(setCartCount(countData));
  };

  const getCartCountData = () => {
    dispatch(getCartCount());
  };

  const setLoading = (isLoading: boolean) => {
    dispatch(setCartLoading(isLoading));
  };

  const setError = (errorMessage: string | null) => {
    dispatch(setCartError(errorMessage));
  };

  const clearCartData = () => {
    dispatch(clearCart());
  };

  const toggleSwitchData = () => {
    dispatch(toggleSwitch());
  };

  return {
    // State
    items,
    count,
    loading,
    error,
    isSwitchOn,
    
    // Actions
    setCartItemsData,
    getCartItemsData,
    addToCartData,
    updateCartItemData,
    removeFromCartData,
    setCartCountData,
    getCartCountData,
    setLoading,
    setError,
    clearCartData,
    toggleSwitchData,
  };
};

// Wishlist hooks
export const useWishlist = () => {
  const dispatch = useAppDispatch();
  
  const items = useAppSelector(selectWishlistItems);
  const count = useAppSelector(selectWishlistCount);
  const loading = useAppSelector(selectWishlistLoading);
  const error = useAppSelector(selectWishlistError);
  const addingItem = useAppSelector(selectAddingItem);
  const removingItem = useAppSelector(selectRemovingItem);
  const checkingItem = useAppSelector(selectCheckingItem);

  const setWishlistItemsData = (itemsData: any[]) => {
    dispatch(setWishlistItems(itemsData));
  };

  const getWishlistItemsData = () => {
    dispatch(getWishlistItems());
  };

  const addToWishlistData = (item: any) => {
    dispatch(addToWishlist(item));
  };

  const removeFromWishlistData = (productId: string) => {
    dispatch(removeFromWishlist(productId));
  };

  const setWishlistCountData = (countData: number) => {
    dispatch(setWishlistCount(countData));
  };

  const getWishlistCountData = () => {
    dispatch(getWishlistCount());
  };

  const checkWishlistItemData = (productId: string) => {
    dispatch(checkWishlistItem(productId));
  };

  const setLoading = (isLoading: boolean) => {
    dispatch(setWishlistLoading(isLoading));
  };

  const setAddingItemState = (isAdding: boolean) => {
    dispatch(setAddingItem(isAdding));
  };

  const setRemovingItemState = (isRemoving: boolean) => {
    dispatch(setRemovingItem(isRemoving));
  };

  const setCheckingItemState = (isChecking: boolean) => {
    dispatch(setCheckingItem(isChecking));
  };

  const setError = (errorMessage: string | null) => {
    dispatch(setWishlistError(errorMessage));
  };

  const clearWishlistData = () => {
    dispatch(clearWishlist());
  };

  const toggleWishlistItemData = (item: any) => {
    dispatch(toggleWishlistItem(item));
  };

  return {
    // State
    items,
    count,
    loading,
    error,
    addingItem,
    removingItem,
    checkingItem,
    
    // Actions
    setWishlistItemsData,
    getWishlistItemsData,
    addToWishlistData,
    removeFromWishlistData,
    setWishlistCountData,
    getWishlistCountData,
    checkWishlistItemData,
    setLoading,
    setAddingItemState,
    setRemovingItemState,
    setCheckingItemState,
    setError,
    clearWishlistData,
    toggleWishlistItemData,
  };
};
