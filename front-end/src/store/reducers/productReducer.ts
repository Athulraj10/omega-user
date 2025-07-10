import * as types from '../actions/types';

interface Product {
  id: number;
  title: string;
  oldPrice: number;
  waight: string;
  image: string;
  imageTwo: string;
  date: string;
  status: string;
  rating: number;
  newPrice: number;
  location: string;
  brand: string;
  sku: number;
  category: string;
  quantity: number;
}

export interface ProductState {
  products: Product[];
  featuredProducts: Product[];
  searchResults: Product[];
  loading: boolean;
  error: string | null;
  searchLoading: boolean;
  searchError: string | null;
}

const initialState: ProductState = {
  products: [],
  featuredProducts: [],
  searchResults: [],
  loading: false,
  error: null,
  searchLoading: false,
  searchError: null,
};

const productReducer = (state = initialState, action: any): ProductState => {
  switch (action.type) {
    case types.FETCH_PRODUCTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case types.FETCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        products: action.payload,
        loading: false,
        error: null,
      };

    case types.FETCH_PRODUCTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case types.FETCH_FEATURED_PRODUCTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case types.FETCH_FEATURED_PRODUCTS_SUCCESS:
      return {
        ...state,
        featuredProducts: action.payload,
        loading: false,
        error: null,
      };

    case types.FETCH_FEATURED_PRODUCTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case types.SEARCH_PRODUCTS_REQUEST:
      return {
        ...state,
        searchLoading: true,
        searchError: null,
      };

    case types.SEARCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        searchResults: action.payload,
        searchLoading: false,
        searchError: null,
      };

    case types.SEARCH_PRODUCTS_FAILURE:
      return {
        ...state,
        searchLoading: false,
        searchError: action.payload,
      };

    default:
      return state;
  }
};

export default productReducer; 