import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { 
  fetchWishlist, 
  addToWishlist, 
  removeFromWishlist, 
  clearAllWishlist,
  clearWishlistCache, 
  resetWishlist 
} from '@/store/actions/appActions';

interface UseWishlistReduxReturn {
  items: any[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
  addingItem: boolean;
  removingItem: boolean;
  clearingWishlist: boolean;
  fetchWishlist: () => Promise<any>;
  addToWishlist: (productId: string) => Promise<any>;
  removeFromWishlist: (productId: string) => Promise<any>;
  clearAllWishlist: () => Promise<any>;
  clearCache: () => void;
  resetState: () => void;
  isItemInWishlist: (productId: string) => boolean;
  getWishlistCount: () => number;
}

export const useWishlistRedux = (): UseWishlistReduxReturn => {
  const dispatch = useDispatch();
  const { 
    items, 
    totalItems, 
    totalPages, 
    currentPage,
    loading, 
    error, 
    lastFetched,
    addingItem,
    removingItem,
    clearingWishlist
  } = useSelector((state: RootState) => state.wishlist);

  // Fetch wishlist
  const fetchWishlistData = useCallback(async (token?: string) => {
    try {
      if (!token) {
        throw new Error('User not authenticated');
      }
      return await dispatch(fetchWishlist(token) as any);
    } catch (error) {
      console.error('Error in fetchWishlist:', error);
      throw error;
    }
  }, [dispatch]);

  // Add to wishlist
  const addToWishlistData = useCallback(async (productId: string, token?: string) => {
    try {
      if (!token) {
        throw new Error('User not authenticated');
      }
      return await dispatch(addToWishlist(productId, token) as any);
    } catch (error) {
      console.error('Error in addToWishlist:', error);
      throw error;
    }
  }, [dispatch]);

  // Remove from wishlist
  const removeFromWishlistData = useCallback(async (productId: string, token?: string) => {
    try {
      if (!token) {
        throw new Error('User not authenticated');
      }
      return await dispatch(removeFromWishlist(productId, token) as any);
    } catch (error) {
      console.error('Error in removeFromWishlist:', error);
      throw error;
    }
  }, [dispatch]);

  // Clear all wishlist
  const clearAllWishlistData = useCallback(async (token?: string) => {
    try {
      if (!token) {
        throw new Error('User not authenticated');
      }
      return await dispatch(clearAllWishlist(token) as any);
    } catch (error) {
      console.error('Error in clearAllWishlist:', error);
      throw error;
    }
  }, [dispatch]);

  // Clear cache
  const clearCache = useCallback(() => {
    dispatch(clearWishlistCache() as any);
  }, [dispatch]);

  // Reset state
  const resetState = useCallback(() => {
    dispatch(resetWishlist() as any);
  }, [dispatch]);

  // Check if item is in wishlist
  const isItemInWishlist = useCallback((productId: string) => {
    return items.some(item => item.id === productId);
  }, [items]);

  // Get wishlist count
  const getWishlistCount = useCallback(() => {
    return items.length;
  }, [items]);

  // Auto-fetch wishlist on mount if user is authenticated
  useEffect(() => {
    // Note: Auto-fetch is disabled to avoid token dependency issues
    // Use fetchWishlist(token) manually when needed
  }, []);

  return {
    items,
    totalItems,
    totalPages,
    currentPage,
    loading,
    error,
    lastFetched,
    addingItem,
    removingItem,
    clearingWishlist,
    fetchWishlist: fetchWishlistData,
    addToWishlist: addToWishlistData,
    removeFromWishlist: removeFromWishlistData,
    clearAllWishlist: clearAllWishlistData,
    clearCache,
    resetState,
    isItemInWishlist,
    getWishlistCount,
  };
}; 