import * as types from "../actions/types"

interface Product {
   _id: string
   name: string
   slug: string
   description: string
   category: string
   brand: string
   price: number
   discountPrice?: number
   images: string[]
   imageTwo?: string
   stock: number
   sku: string
   status: string
   ratingsAverage: number
   ratingsCount: number
   weight?: string
   location?: string
   colors?: string[]
   sizes?: string[]
   tags?: string[]
   isFeatured?: boolean
   isBundle?: boolean
   sale?: string
   variants?: any[]
   createdAt: string
   updatedAt: string
}

export interface ProductState {
   products: Product[]
   featuredProducts: Product[]
   trendingProducts: Product[]
   bestsellers: Product[]
   newArrivals: Product[]
   deals: Product[]
   categories: string[]
   brands: string[]
   filters: any
   searchResults: Product[]
   productDetail: Product | null
   similarProducts: Product[]
   relatedProducts: Product[]
   productReviews: any[]
   productRatings: any
   productVariants: any[]
   productAvailability: any
   deliveryOptions: any[]
   compareData: any
   loading: boolean
   error: string | null
   searchLoading: boolean
   searchError: string | null
   detailLoading: boolean
   detailError: string | null
}

const initialState: ProductState = {
   products: [],
   featuredProducts: [],
   trendingProducts: [],
   bestsellers: [],
   newArrivals: [],
   deals: [],
   categories: [],
   brands: [],
   filters: null,
   searchResults: [],
   productDetail: null,
   similarProducts: [],
   relatedProducts: [],
   productReviews: [],
   productRatings: null,
   productVariants: [],
   productAvailability: null,
   deliveryOptions: [],
   compareData: null,
   loading: false,
   error: null,
   searchLoading: false,
   searchError: null,
   detailLoading: false,
   detailError: null,
}

const productReducer = (state = initialState, action: any): ProductState => {
   switch (action.type) {
      // Basic product actions
      case types.FETCH_PRODUCTS_REQUEST:
         return {
            ...state,
            loading: true,
            error: null,
         }

      case types.FETCH_PRODUCTS_SUCCESS:
         return {
            ...state,
            products: action.payload.data || action.payload,
            loading: false,
            error: null,
         }

      case types.FETCH_PRODUCTS_FAILURE:
         return {
            ...state,
            loading: false,
            error: action.payload,
         }

      case types.FETCH_FEATURED_PRODUCTS_REQUEST:
         return {
            ...state,
            loading: true,
            error: null,
         }

      case types.FETCH_FEATURED_PRODUCTS_SUCCESS:
         return {
            ...state,
            featuredProducts: action.payload.data || action.payload,
            loading: false,
            error: null,
         }

      case types.FETCH_FEATURED_PRODUCTS_FAILURE:
         return {
            ...state,
            loading: false,
            error: action.payload,
         }

      case types.SEARCH_PRODUCTS_REQUEST:
         return {
            ...state,
            searchLoading: true,
            searchError: null,
         }

      case types.SEARCH_PRODUCTS_SUCCESS:
         return {
            ...state,
            searchResults: action.payload.data || action.payload,
            searchLoading: false,
            searchError: null,
         }

      case types.SEARCH_PRODUCTS_FAILURE:
         return {
            ...state,
            searchLoading: false,
            searchError: action.payload,
         }

      // Enhanced product actions
      case types.FETCH_PRODUCT_DETAIL_REQUEST:
         return {
            ...state,
            detailLoading: true,
            detailError: null,
         }

      case types.FETCH_PRODUCT_DETAIL_SUCCESS:
         return {
            ...state,
            productDetail: action.payload.data || action.payload,
            detailLoading: false,
            detailError: null,
         }

      case types.FETCH_PRODUCT_DETAIL_FAILURE:
         return {
            ...state,
            detailLoading: false,
            detailError: action.payload,
         }

      case types.FETCH_PRODUCT_BY_SLUG_REQUEST:
         return {
            ...state,
            detailLoading: true,
            detailError: null,
         }

      case types.FETCH_PRODUCT_BY_SLUG_SUCCESS:
         return {
            ...state,
            productDetail: action.payload.data || action.payload,
            detailLoading: false,
            detailError: null,
         }

      case types.FETCH_PRODUCT_BY_SLUG_FAILURE:
         return {
            ...state,
            detailLoading: false,
            detailError: action.payload,
         }

      case types.FETCH_TRENDING_PRODUCTS_REQUEST:
         return {
            ...state,
            loading: true,
            error: null,
         }

      case types.FETCH_TRENDING_PRODUCTS_SUCCESS:
         return {
            ...state,
            trendingProducts: action.payload.data || action.payload,
            loading: false,
            error: null,
         }

      case types.FETCH_TRENDING_PRODUCTS_FAILURE:
         return {
            ...state,
            loading: false,
            error: action.payload,
         }

      case types.FETCH_BESTSELLERS_REQUEST:
         return {
            ...state,
            loading: true,
            error: null,
         }

      case types.FETCH_BESTSELLERS_SUCCESS:
         return {
            ...state,
            bestsellers: action.payload.data || action.payload,
            loading: false,
            error: null,
         }

      case types.FETCH_BESTSELLERS_FAILURE:
         return {
            ...state,
            loading: false,
            error: action.payload,
         }

      case types.FETCH_NEW_ARRIVALS_REQUEST:
         return {
            ...state,
            loading: true,
            error: null,
         }

      case types.FETCH_NEW_ARRIVALS_SUCCESS:
         return {
            ...state,
            newArrivals: action.payload.data || action.payload,
            loading: false,
            error: null,
         }

      case types.FETCH_NEW_ARRIVALS_FAILURE:
         return {
            ...state,
            loading: false,
            error: action.payload,
         }

      case types.FETCH_DEALS_REQUEST:
         return {
            ...state,
            loading: true,
            error: null,
         }

      case types.FETCH_DEALS_SUCCESS:
         return {
            ...state,
            deals: action.payload.data || action.payload,
            loading: false,
            error: null,
         }

      case types.FETCH_DEALS_FAILURE:
         return {
            ...state,
            loading: false,
            error: action.payload,
         }

      case types.FETCH_CATEGORIES_REQUEST:
         return {
            ...state,
            loading: true,
            error: null,
         }

      case types.FETCH_CATEGORIES_SUCCESS:
         return {
            ...state,
            categories: action.payload.data || action.payload,
            loading: false,
            error: null,
         }

      case types.FETCH_CATEGORIES_FAILURE:
         return {
            ...state,
            loading: false,
            error: action.payload,
         }

      case types.FETCH_BRANDS_REQUEST:
         return {
            ...state,
            loading: true,
            error: null,
         }

      case types.FETCH_BRANDS_SUCCESS:
         return {
            ...state,
            brands: action.payload.data || action.payload,
            loading: false,
            error: null,
         }

      case types.FETCH_BRANDS_FAILURE:
         return {
            ...state,
            loading: false,
            error: action.payload,
         }

      case types.FETCH_FILTERS_REQUEST:
         return {
            ...state,
            loading: true,
            error: null,
         }

      case types.FETCH_FILTERS_SUCCESS:
         return {
            ...state,
            filters: action.payload.data || action.payload,
            loading: false,
            error: null,
         }

      case types.FETCH_FILTERS_FAILURE:
         return {
            ...state,
            loading: false,
            error: action.payload,
         }

      case types.FETCH_SIMILAR_PRODUCTS_REQUEST:
         return {
            ...state,
            loading: true,
            error: null,
         }

      case types.FETCH_SIMILAR_PRODUCTS_SUCCESS:
         return {
            ...state,
            similarProducts: action.payload.data || action.payload,
            loading: false,
            error: null,
         }

      case types.FETCH_SIMILAR_PRODUCTS_FAILURE:
         return {
            ...state,
            loading: false,
            error: action.payload,
         }

      case types.FETCH_RELATED_PRODUCTS_REQUEST:
         return {
            ...state,
            loading: true,
            error: null,
         }

      case types.FETCH_RELATED_PRODUCTS_SUCCESS:
         return {
            ...state,
            relatedProducts: action.payload.data || action.payload,
            loading: false,
            error: null,
         }

      case types.FETCH_RELATED_PRODUCTS_FAILURE:
         return {
            ...state,
            loading: false,
            error: action.payload,
         }

      case types.FETCH_PRODUCT_REVIEWS_REQUEST:
         return {
            ...state,
            loading: true,
            error: null,
         }

      case types.FETCH_PRODUCT_REVIEWS_SUCCESS:
         return {
            ...state,
            productReviews: action.payload.data || action.payload,
            loading: false,
            error: null,
         }

      case types.FETCH_PRODUCT_REVIEWS_FAILURE:
         return {
            ...state,
            loading: false,
            error: action.payload,
         }

      case types.FETCH_PRODUCT_RATINGS_REQUEST:
         return {
            ...state,
            loading: true,
            error: null,
         }

      case types.FETCH_PRODUCT_RATINGS_SUCCESS:
         return {
            ...state,
            productRatings: action.payload.data || action.payload,
            loading: false,
            error: null,
         }

      case types.FETCH_PRODUCT_RATINGS_FAILURE:
         return {
            ...state,
            loading: false,
            error: action.payload,
         }

      case types.FETCH_PRODUCT_VARIANTS_REQUEST:
         return {
            ...state,
            loading: true,
            error: null,
         }

      case types.FETCH_PRODUCT_VARIANTS_SUCCESS:
         return {
            ...state,
            productVariants: action.payload.data || action.payload,
            loading: false,
            error: null,
         }

      case types.FETCH_PRODUCT_VARIANTS_FAILURE:
         return {
            ...state,
            loading: false,
            error: action.payload,
         }

      case types.CHECK_PRODUCT_AVAILABILITY_REQUEST:
         return {
            ...state,
            loading: true,
            error: null,
         }

      case types.CHECK_PRODUCT_AVAILABILITY_SUCCESS:
         return {
            ...state,
            productAvailability: action.payload.data || action.payload,
            loading: false,
            error: null,
         }

      case types.CHECK_PRODUCT_AVAILABILITY_FAILURE:
         return {
            ...state,
            loading: false,
            error: action.payload,
         }

      case types.FETCH_DELIVERY_OPTIONS_REQUEST:
         return {
            ...state,
            loading: true,
            error: null,
         }

      case types.FETCH_DELIVERY_OPTIONS_SUCCESS:
         return {
            ...state,
            deliveryOptions: action.payload.data || action.payload,
            loading: false,
            error: null,
         }

      case types.FETCH_DELIVERY_OPTIONS_FAILURE:
         return {
            ...state,
            loading: false,
            error: action.payload,
         }

      case types.FETCH_COMPARE_DATA_REQUEST:
         return {
            ...state,
            loading: true,
            error: null,
         }

      case types.FETCH_COMPARE_DATA_SUCCESS:
         return {
            ...state,
            compareData: action.payload.data || action.payload,
            loading: false,
            error: null,
         }

      case types.FETCH_COMPARE_DATA_FAILURE:
         return {
            ...state,
            loading: false,
            error: action.payload,
         }

      default:
         return state
   }
}

export default productReducer
