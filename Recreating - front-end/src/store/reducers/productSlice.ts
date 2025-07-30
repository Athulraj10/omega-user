import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  oldPrice?: number;
  image: string;
  images?: string[];
  slug: string;
  category: string;
  brand: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  quantity: number;
  sku: string;
  weight?: string;
  dimensions?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

interface ProductDetails extends Product {
  specifications?: Record<string, any>;
  variants?: Product[];
  relatedProducts?: Product[];
}

interface ProductsData {
  data: Product[];
  meta: {
    code: number;
    message: string;
    pagination?: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}

export interface ProductState {
  products: Product[];
  productDetails: ProductDetails | null;
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
  filters: {
    category?: string;
    brand?: string;
    priceRange?: { min: number; max: number };
    rating?: number;
    inStock?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  };
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

const initialState: ProductState = {
  products: [],
  productDetails: null,
  loading: false,
  error: null,
  lastFetched: null,
  filters: {},
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12,
  },
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    // Set loading state
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    // Set error state
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },

    // Set products data
    setProducts(state, action: PayloadAction<Product[]>) {
      state.products = action.payload;
      state.error = null;
      state.lastFetched = Date.now();
    },

    // Set products from API response
    setProductsFromAPI(state, action: PayloadAction<ProductsData>) {
      if (action.payload?.data) {
        state.products = action.payload.data;
        state.error = null;
        state.lastFetched = Date.now();
        
        // Update pagination if available
        if (action.payload.meta?.pagination) {
          state.pagination = action.payload.meta.pagination;
        }
      } else {
        state.products = [];
        state.error = "Invalid data format";
      }
    },

    // Set product details
    setProductDetails(state, action: PayloadAction<ProductDetails>) {
      state.productDetails = action.payload;
      state.error = null;
      state.lastFetched = Date.now();
    },

    // Add single product
    addProduct(state, action: PayloadAction<Product>) {
      const existingIndex = state.products.findIndex(
        (product) => product.id === action.payload.id
      );
      if (existingIndex >= 0) {
        state.products[existingIndex] = action.payload;
      } else {
        state.products.push(action.payload);
      }
    },

    // Update single product
    updateProduct(state, action: PayloadAction<Product>) {
      const index = state.products.findIndex(
        (product) => product.id === action.payload.id
      );
      if (index >= 0) {
        state.products[index] = action.payload;
      }
    },

    // Remove single product
    removeProduct(state, action: PayloadAction<string>) {
      state.products = state.products.filter(
        (product) => product.id !== action.payload
      );
    },

    // Set filters
    setFilters(state, action: PayloadAction<Partial<ProductState['filters']>>) {
      state.filters = { ...state.filters, ...action.payload };
    },

    // Clear filters
    clearFilters(state) {
      state.filters = {};
    },

    // Set pagination
    setPagination(state, action: PayloadAction<Partial<ProductState['pagination']>>) {
      state.pagination = { ...state.pagination, ...action.payload };
    },

    // Clear products
    clearProducts(state) {
      state.products = [];
      state.productDetails = null;
      state.error = null;
      state.lastFetched = null;
    },

    // Reset state
    resetProductState(state) {
      state.products = [];
      state.productDetails = null;
      state.loading = false;
      state.error = null;
      state.lastFetched = null;
      state.filters = {};
      state.pagination = {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 12,
      };
    },
  },
});

export const {
  setLoading,
  setError,
  setProducts,
  setProductsFromAPI,
  setProductDetails,
  addProduct,
  updateProduct,
  removeProduct,
  setFilters,
  clearFilters,
  setPagination,
  clearProducts,
  resetProductState,
} = productSlice.actions;

export default productSlice.reducer; 