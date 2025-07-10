import * as types from '../actions/types';

export interface FilterState {
  selectedCategory: string[];
  selectedWeight: string[];
  minPrice: number;
  maxPrice: number;
  sortOption: string;
  searchTerm: string;
  MinPrice: any;
  MaxPrice: any;
  range: { min: number; max: number };
  selectedBrands: string[];
  selectedColor: string[];
  selectedTags: string[];
}

const initialState: FilterState = {
  selectedCategory: [],
  selectedWeight: [],
  minPrice: 0,
  maxPrice: 250,
  range: { min: 0, max: 250 },
  sortOption: "",
  searchTerm: "",
  MinPrice: 0,
  MaxPrice: Infinity,
  selectedBrands: [],
  selectedColor: [],
  selectedTags: [],
};

const filterReducer = (state = initialState, action: any): FilterState => {
  switch (action.type) {
    case types.SET_SELECTED_CATEGORY:
      return {
        ...state,
        selectedCategory: action.payload,
      };

    case types.SET_SELECTED_WEIGHT:
      return {
        ...state,
        selectedWeight: action.payload,
      };

    case types.SET_PRICE_RANGE:
      return {
        ...state,
        minPrice: action.payload.min,
        maxPrice: action.payload.max,
      };

    case types.SET_RANGE:
      return {
        ...state,
        range: action.payload,
      };

    case types.SET_SORT_OPTION:
      return {
        ...state,
        sortOption: action.payload,
      };

    case types.SET_SEARCH_TERM:
      return {
        ...state,
        searchTerm: action.payload,
      };

    case types.SET_MIN_PRICE:
      return {
        ...state,
        MinPrice: action.payload,
      };

    case types.SET_MAX_PRICE:
      return {
        ...state,
        MaxPrice: action.payload,
      };

    case types.SET_SELECTED_BRANDS:
      return {
        ...state,
        selectedBrands: action.payload,
      };

    case types.SET_SELECTED_COLOR:
      return {
        ...state,
        selectedColor: action.payload,
      };

    case types.SET_SELECTED_TAGS:
      return {
        ...state,
        selectedTags: action.payload,
      };

    default:
      return state;
  }
};

export default filterReducer;
