import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { 
  fetchProducts, 
  fetchProductDetails,
  clearProductCache, 
  resetProducts 
} from '@/store/actions/appActions';
import {
  setFilters,
  clearFilters,
  setPagination,
  setProductsFromAPI,
  setProductDetails as setProductDetailsAction,
  addProduct,
  updateProduct,
  removeProduct,
} from '@/store/reducers/productSlice';

interface UseProductReduxReturn {
  products: any[];
  productDetails: any | null;
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
  filters: any;
  pagination: any;
  fetchProducts: (params?: any) => Promise<any>;
  fetchProductDetails: (productId: string) => Promise<any>;
  clearCache: () => void;
  resetState: () => void;
  setFilters: (filters: any) => void;
  clearFilters: () => void;
  setPagination: (pagination: any) => void;
  getProductById: (id: string) => any;
  getProductBySlug: (slug: string) => any;
  getProductsCount: () => number;
  addProduct: (product: any) => void;
  updateProduct: (product: any) => void;
  removeProduct: (productId: string) => void;
}

export const useProductRedux = (): UseProductReduxReturn => {
  const dispatch = useDispatch();
  const { 
    products, 
    productDetails,
    loading, 
    error, 
    lastFetched,
    filters,
    pagination
  } = useSelector((state: RootState) => state.product);

  // Fetch products
  const fetchProductsData = useCallback(async (params?: any) => {
    try {
      return await dispatch(fetchProducts(params) as any);
    } catch (error) {
      console.error('Error in fetchProducts:', error);
      throw error;
    }
  }, [dispatch]);

  // Fetch product details
  const fetchProductDetailsData = useCallback(async (productId: string) => {
    try {
      return await dispatch(fetchProductDetails(productId) as any);
    } catch (error) {
      console.error('Error in fetchProductDetails:', error);
      throw error;
    }
  }, [dispatch]);

  // Clear cache
  const clearCache = useCallback(() => {
    dispatch(clearProductCache() as any);
  }, [dispatch]);

  // Reset state
  const resetState = useCallback(() => {
    dispatch(resetProducts() as any);
  }, [dispatch]);

  // Set filters
  const setFiltersData = useCallback((filters: any) => {
    dispatch(setFilters(filters));
  }, [dispatch]);

  // Clear filters
  const clearFiltersData = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  // Set pagination
  const setPaginationData = useCallback((pagination: any) => {
    dispatch(setPagination(pagination));
  }, [dispatch]);

  // Get product by ID
  const getProductById = useCallback((id: string) => {
    return products.find(product => product.id === id);
  }, [products]);

  // Get product by slug
  const getProductBySlug = useCallback((slug: string) => {
    return products.find(product => product.slug === slug);
  }, [products]);

  // Get products count
  const getProductsCount = useCallback(() => {
    return products.length;
  }, [products]);

  // Add product
  const addProductData = useCallback((product: any) => {
    dispatch(addProduct(product));
  }, [dispatch]);

  // Update product
  const updateProductData = useCallback((product: any) => {
    dispatch(updateProduct(product));
  }, [dispatch]);

  // Remove product
  const removeProductData = useCallback((productId: string) => {
    dispatch(removeProduct(productId));
  }, [dispatch]);

  return {
    products,
    productDetails,
    loading,
    error,
    lastFetched,
    filters,
    pagination,
    fetchProducts: fetchProductsData,
    fetchProductDetails: fetchProductDetailsData,
    clearCache,
    resetState,
    setFilters: setFiltersData,
    clearFilters: clearFiltersData,
    setPagination: setPaginationData,
    getProductById,
    getProductBySlug,
    getProductsCount,
    addProduct: addProductData,
    updateProduct: updateProductData,
    removeProduct: removeProductData,
  };
}; 