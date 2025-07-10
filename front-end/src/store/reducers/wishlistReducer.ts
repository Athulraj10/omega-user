import * as types from '../actions/types';

interface Item {
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

export interface WishlistState {
  wishlist: Item[];
  loading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  wishlist: [
    {
      id: 1,
      title: "Women's wallet Hand Purse",
      image: process.env.NEXT_PUBLIC_URL + "/assets/img/product-images/48_1.jpg",
      imageTwo: process.env.NEXT_PUBLIC_URL + "/assets/img/product-images/48_1.jpg",
      newPrice: 50.0,
      oldPrice: 70.0,
      date: "",
      rating: 3,
      status: "Available",
      waight: "1 pcs",
      location: "in Store, Online",
      brand: "Bhisma Organice",
      sku: 55555,
      category: "",
      quantity: 1,
    },
    {
      id: 2,
      title: "Rose Gold Earring",
      date: "",
      image: process.env.NEXT_PUBLIC_URL + "/assets/img/product-images/53_1.jpg",
      imageTwo: process.env.NEXT_PUBLIC_URL + "/assets/img/product-images/53_1.jpg",
      rating: 4,
      newPrice: 60.0,
      oldPrice: 80.0,
      status: "Out Of Stock",
      waight: "200g Pack",
      location: "in Store, Online",
      brand: "Bhisma Organice",
      sku: 65055,
      category: "",
      quantity: 1,
    },
    {
      id: 3,
      title: "Apple",
      image: process.env.NEXT_PUBLIC_URL + "/assets/img/product-images/21_1.jpg",
      imageTwo: process.env.NEXT_PUBLIC_URL + "/assets/img/product-images/21_1.jpg",
      newPrice: 10.0,
      oldPrice: 12.0,
      date: "",
      waight: "5 pcs",
      rating: 2,
      status: "Available",
      location: "Online",
      brand: "Bhisma Organice",
      sku: 24355,
      category: "",
      quantity: 1,
    },
  ],
  loading: false,
  error: null,
};

const wishlistReducer = (state = initialState, action: any): WishlistState => {
  switch (action.type) {
    case types.ADD_WISHLIST:
      return {
        ...state,
        wishlist: [...state.wishlist, action.payload],
      };

    case types.REMOVE_WISHLIST:
      return {
        ...state,
        wishlist: state.wishlist.filter(item => item.id !== action.payload),
      };

    // API Actions
    case types.FETCH_WISHLIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case types.FETCH_WISHLIST_SUCCESS:
      return {
        ...state,
        wishlist: action.payload,
        loading: false,
        error: null,
      };

    case types.FETCH_WISHLIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case types.ADD_TO_WISHLIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case types.ADD_TO_WISHLIST_SUCCESS:
      return {
        ...state,
        wishlist: action.payload,
        loading: false,
        error: null,
      };

    case types.ADD_TO_WISHLIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case types.REMOVE_FROM_WISHLIST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case types.REMOVE_FROM_WISHLIST_SUCCESS:
      return {
        ...state,
        wishlist: action.payload,
        loading: false,
        error: null,
      };

    case types.REMOVE_FROM_WISHLIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default wishlistReducer; 