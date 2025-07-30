import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { 
  fetchCategories, 
  clearCategoriesCache, 
  resetCategories 
} from '@/store/actions/appActions';

interface UseCategoriesReduxReturn {
  categories: any[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
  fetchCategories: () => Promise<any>;
  clearCache: () => void;
  resetState: () => void;
  getCategoryById: (id: string) => any;
  getCategoryBySlug: (slug: string) => any;
  getCategoriesCount: () => number;
}

export const useCategoriesRedux = (): UseCategoriesReduxReturn => {
  const dispatch = useDispatch();
  const { categories, loading, error, lastFetched } = useSelector(
    (state: RootState) => state.category
  );

  // Fetch categories
  const fetchCategoriesData = useCallback(async () => {
    try {
      return await dispatch(fetchCategories() as any);
    } catch (error) {
      console.error('Error in fetchCategories:', error);
      throw error;
    }
  }, [dispatch]);

  // Clear cache
  const clearCache = useCallback(() => {
    dispatch(clearCategoriesCache() as any);
  }, [dispatch]);

  // Reset state
  const resetState = useCallback(() => {
    dispatch(resetCategories() as any);
  }, [dispatch]);

  // Get category by ID
  const getCategoryById = useCallback((id: string) => {
    return categories.find(category => category.id === id);
  }, [categories]);

  // Get category by slug
  const getCategoryBySlug = useCallback((slug: string) => {
    return categories.find(category => category.slug === slug);
  }, [categories]);

  // Get categories count
  const getCategoriesCount = useCallback(() => {
    return categories.length;
  }, [categories]);

  // Auto-fetch categories on mount if not already loaded
  useEffect(() => {
    if (categories.length === 0 && !loading && !error) {
      fetchCategoriesData();
    }
  }, [categories.length, loading, error, fetchCategoriesData]);

  return {
    categories,
    loading,
    error,
    lastFetched,
    fetchCategories: fetchCategoriesData,
    clearCache,
    resetState,
    getCategoryById,
    getCategoryBySlug,
    getCategoriesCount,
  };
}; 