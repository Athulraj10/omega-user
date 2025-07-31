import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Product {
  _id: string;
  name: string;
  description: string;
  category: string | null;
  subcategory: string | null;
  price: number;
  discountPrice: number;
  images: string[];
  stock: number;
  minimumOrder: number;
  sku: string;
  status: string;
  ratingsAverage: number;
  ratingsCount: number;
  seller: string;
  sale?: string;
  location?: string;
  brand?: string;
  weight?: string;
  rating?: number;
  availability?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords: string[];
  features: string[];
  tags: string[];
  isOnSale: boolean;
  lowStockThreshold: number;
  trackInventory: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ProductState {
  products: Product[];
}

const initialState: ProductState = {
  products: [],
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    // Set products data
    setProducts(state, action: PayloadAction<Product[]>) {
      state.products = action.payload;
    },
  },
});

export const { setProducts } = productSlice.actions;

// Export selectors
export const selectProducts = (state: { product: ProductState }) => state.product.products;

export default productSlice.reducer; 