import * as types from "../actions/types"

interface Item {
   _id: string
   name: string
   price: number
   discountPrice?: number
   images: string[]
   category: string
   brand: string
   ratingsAverage: number
   ratingsCount: number
   stock: number
   status: string
}

export interface WishlistState {
   wishlist: Item[]
   loading: boolean
   error: string | null
}

const initialState: WishlistState = {
   wishlist: [],
   loading: false,
   error: null,
}

const wishlistReducer = (state = initialState, action: any): WishlistState => {
   switch (action.type) {
      case types.ADD_WISHLIST:
         return {
            ...state,
            wishlist: [...state.wishlist, action.payload],
         }

      case types.REMOVE_WISHLIST:
         return {
            ...state,
            wishlist: state.wishlist.filter((item) => item._id !== action.payload),
         }

      // API Actions
      case types.FETCH_WISHLIST_REQUEST:
         return {
            ...state,
            loading: true,
            error: null,
         }

      case types.FETCH_WISHLIST_SUCCESS:
         return {
            ...state,
            wishlist: action.payload,
            loading: false,
            error: null,
         }

      case types.FETCH_WISHLIST_FAILURE:
         return {
            ...state,
            loading: false,
            error: action.payload,
         }

      case types.ADD_TO_WISHLIST_REQUEST:
         return {
            ...state,
            loading: true,
            error: null,
         }

      case types.ADD_TO_WISHLIST_SUCCESS:
         return {
            ...state,
            wishlist: action.payload,
            loading: false,
            error: null,
         }

      case types.ADD_TO_WISHLIST_FAILURE:
         return {
            ...state,
            loading: false,
            error: action.payload,
         }

      case types.REMOVE_FROM_WISHLIST_REQUEST:
         return {
            ...state,
            loading: true,
            error: null,
         }

      case types.REMOVE_FROM_WISHLIST_SUCCESS:
         return {
            ...state,
            wishlist: action.payload,
            loading: false,
            error: null,
         }

      case types.REMOVE_FROM_WISHLIST_FAILURE:
         return {
            ...state,
            loading: false,
            error: action.payload,
         }

      default:
         return state
   }
}

export default wishlistReducer
