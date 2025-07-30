import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { 
  fetchCart, 
  addToCart, 
  removeFromCart, 
  updateCartQuantity,
  clearCart,
  clearCartCache, 
  resetCart 
} from '@/store/actions/appActions';

interface UseCartReduxReturn {
  items: any[];
  totalItems: number;
  totalAmount: number;
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
  fetchCart: (token: string) => Promise<any>;
  addToCart: (productId: string, quantity: number, token: string) => Promise<any>;
  removeFromCart: (productId: string, token: string) => Promise<any>;
  updateCartQuantity: (productId: string, quantity: number, token: string) => Promise<any>;
  clearCart: (token: string) => Promise<any>;
  clearCache: () => void;
  resetState: () => void;
  getCartItem: (productId: string) => any;
  getCartCount: () => number;
  getCartTotal: () => number;
}

export const useCartRedux = (): UseCartReduxReturn => {
  const dispatch = useDispatch();
  const { 
    items, 
    totalItems, 
    totalAmount,
    loading, 
    error, 
    lastFetched
  } = useSelector((state: RootState) => state.cart);

  // Fetch cart
  const fetchCartData = useCallback(async (token: string) => {
    try {
      return await dispatch(fetchCart(token) as any);
    } catch (error) {
      console.error('Error in fetchCart:', error);
      throw error;
    }
  }, [dispatch]);

  // Add to cart
  const addToCartData = useCallback(async (productId: string, quantity: number, token: string) => {
    try {
      return await dispatch(addToCart(productId, quantity, token) as any);
    } catch (error) {
      console.error('Error in addToCart:', error);
      throw error;
    }
  }, [dispatch]);

  // Remove from cart
  const removeFromCartData = useCallback(async (productId: string, token: string) => {
    try {
      return await dispatch(removeFromCart(productId, token) as any);
    } catch (error) {
      console.error('Error in removeFromCart:', error);
      throw error;
    }
  }, [dispatch]);

  // Update cart quantity
  const updateCartQuantityData = useCallback(async (productId: string, quantity: number, token: string) => {
    try {
      return await dispatch(updateCartQuantity(productId, quantity, token) as any);
    } catch (error) {
      console.error('Error in updateCartQuantity:', error);
      throw error;
    }
  }, [dispatch]);

  // Clear cart
  const clearCartData = useCallback(async (token: string) => {
    try {
      return await dispatch(clearCart(token) as any);
    } catch (error) {
      console.error('Error in clearCart:', error);
      throw error;
    }
  }, [dispatch]);

  // Clear cache
  const clearCache = useCallback(() => {
    dispatch(clearCartCache() as any);
  }, [dispatch]);

  // Reset state
  const resetState = useCallback(() => {
    dispatch(resetCart() as any);
  }, [dispatch]);

  // Get cart item
  const getCartItem = useCallback((productId: string) => {
    return items.find(item => item.id === productId);
  }, [items]);

  // Get cart count
  const getCartCount = useCallback(() => {
    return items.length;
  }, [items]);

  // Get cart total
  const getCartTotal = useCallback(() => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [items]);

  return {
    items,
    totalItems,
    totalAmount,
    loading,
    error,
    lastFetched,
    fetchCart: fetchCartData,
    addToCart: addToCartData,
    removeFromCart: removeFromCartData,
    updateCartQuantity: updateCartQuantityData,
    clearCart: clearCartData,
    clearCache,
    resetState,
    getCartItem,
    getCartCount,
    getCartTotal,
  };
}; 