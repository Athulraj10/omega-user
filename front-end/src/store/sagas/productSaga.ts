import { call, put } from "redux-saga/effects"
import { takeEvery } from "redux-saga"
import * as types from "../actions/types"
import * as actions from "../actions"
import { productAPI } from "../../services/api"

// Basic product sagas
function* handleFetchProducts(action: any) {
   try {
      const response = yield call(productAPI.getProducts, action.payload)
      yield put(actions.fetchProductsSuccess(response))
   } catch (error: any) {
      yield put(actions.fetchProductsFailure(error.message || "Failed to fetch products"))
   }
}

function* handleFetchFeaturedProducts() {
   try {
      const response = yield call(productAPI.getFeatured)
      yield put(actions.fetchFeaturedProductsSuccess(response))
   } catch (error: any) {
      yield put(
         actions.fetchFeaturedProductsFailure(
            error.message || "Failed to fetch featured products"
         )
      )
   }
}

function* handleSearchProducts(action: any) {
   try {
      const response = yield call(productAPI.searchProducts, action.payload)
      yield put(actions.searchProductsSuccess(response))
   } catch (error: any) {
      yield put(
         actions.searchProductsFailure(error.message || "Failed to search products")
      )
   }
}

// Enhanced product sagas
function* handleFetchProductDetail(action: any) {
   try {
      const response = yield call(productAPI.getProductById, action.payload)
      yield put(actions.fetchProductDetailSuccess(response))
   } catch (error: any) {
      yield put(
         actions.fetchProductDetailFailure(
            error.message || "Failed to fetch product detail"
         )
      )
   }
}

function* handleFetchProductBySlug(action: any) {
   try {
      const response = yield call(productAPI.getProductBySlug, action.payload)
      yield put(actions.fetchProductBySlugSuccess(response))
   } catch (error: any) {
      yield put(
         actions.fetchProductBySlugFailure(
            error.message || "Failed to fetch product by slug"
         )
      )
   }
}

function* handleFetchTrendingProducts(action: any) {
   try {
      const response = yield call(productAPI.getTrending, action.payload)
      yield put(actions.fetchTrendingProductsSuccess(response))
   } catch (error: any) {
      yield put(
         actions.fetchTrendingProductsFailure(
            error.message || "Failed to fetch trending products"
         )
      )
   }
}

function* handleFetchBestsellers(action: any) {
   try {
      const response = yield call(productAPI.getBestsellers, action.payload)
      yield put(actions.fetchBestsellersSuccess(response))
   } catch (error: any) {
      yield put(
         actions.fetchBestsellersFailure(error.message || "Failed to fetch bestsellers")
      )
   }
}

function* handleFetchNewArrivals(action: any) {
   try {
      const response = yield call(productAPI.getNewArrivals, action.payload)
      yield put(actions.fetchNewArrivalsSuccess(response))
   } catch (error: any) {
      yield put(
         actions.fetchNewArrivalsFailure(error.message || "Failed to fetch new arrivals")
      )
   }
}

function* handleFetchDeals(action: any) {
   try {
      const response = yield call(productAPI.getDeals, action.payload)
      yield put(actions.fetchDealsSuccess(response))
   } catch (error: any) {
      yield put(actions.fetchDealsFailure(error.message || "Failed to fetch deals"))
   }
}

function* handleFetchCategories() {
   try {
      const response = yield call(productAPI.getCategories)
      yield put(actions.fetchCategoriesSuccess(response))
   } catch (error: any) {
      yield put(
         actions.fetchCategoriesFailure(error.message || "Failed to fetch categories")
      )
   }
}

function* handleFetchBrands() {
   try {
      const response = yield call(productAPI.getBrands)
      yield put(actions.fetchBrandsSuccess(response))
   } catch (error: any) {
      yield put(actions.fetchBrandsFailure(error.message || "Failed to fetch brands"))
   }
}

function* handleFetchFilters() {
   try {
      const response = yield call(productAPI.getFilters)
      yield put(actions.fetchFiltersSuccess(response))
   } catch (error: any) {
      yield put(actions.fetchFiltersFailure(error.message || "Failed to fetch filters"))
   }
}

function* handleFetchSimilarProducts(action: any) {
   try {
      const { productId, limit } = action.payload
      const response = yield call(productAPI.getSimilarProducts, productId, limit)
      yield put(actions.fetchSimilarProductsSuccess(response))
   } catch (error: any) {
      yield put(
         actions.fetchSimilarProductsFailure(
            error.message || "Failed to fetch similar products"
         )
      )
   }
}

function* handleFetchRelatedProducts(action: any) {
   try {
      const { productId, limit } = action.payload
      const response = yield call(productAPI.getRelatedProducts, productId, limit)
      yield put(actions.fetchRelatedProductsSuccess(response))
   } catch (error: any) {
      yield put(
         actions.fetchRelatedProductsFailure(
            error.message || "Failed to fetch related products"
         )
      )
   }
}

function* handleFetchProductReviews(action: any) {
   try {
      const { productId, params } = action.payload
      const response = yield call(
         productAPI.getProductReviews,
         productId,
         params?.sort,
         params?.page,
         params?.limit
      )
      yield put(actions.fetchProductReviewsSuccess(response))
   } catch (error: any) {
      yield put(
         actions.fetchProductReviewsFailure(
            error.message || "Failed to fetch product reviews"
         )
      )
   }
}

function* handleFetchProductRatings(action: any) {
   try {
      const response = yield call(productAPI.getProductRatings, action.payload)
      yield put(actions.fetchProductRatingsSuccess(response))
   } catch (error: any) {
      yield put(
         actions.fetchProductRatingsFailure(
            error.message || "Failed to fetch product ratings"
         )
      )
   }
}

function* handleFetchProductVariants(action: any) {
   try {
      const response = yield call(productAPI.getProductVariants, action.payload)
      yield put(actions.fetchProductVariantsSuccess(response))
   } catch (error: any) {
      yield put(
         actions.fetchProductVariantsFailure(
            error.message || "Failed to fetch product variants"
         )
      )
   }
}

function* handleCheckProductAvailability(action: any) {
   try {
      const { productId, variantId } = action.payload
      const response = yield call(productAPI.checkAvailability, productId, variantId)
      yield put(actions.checkProductAvailabilitySuccess(response))
   } catch (error: any) {
      yield put(
         actions.checkProductAvailabilityFailure(
            error.message || "Failed to check product availability"
         )
      )
   }
}

function* handleFetchDeliveryOptions(action: any) {
   try {
      const response = yield call(productAPI.getDeliveryOptions, action.payload)
      yield put(actions.fetchDeliveryOptionsSuccess(response))
   } catch (error: any) {
      yield put(
         actions.fetchDeliveryOptionsFailure(
            error.message || "Failed to fetch delivery options"
         )
      )
   }
}

function* handleFetchCompareData(action: any) {
   try {
      const response = yield call(productAPI.getCompareData, action.payload)
      yield put(actions.fetchCompareDataSuccess(response))
   } catch (error: any) {
      yield put(
         actions.fetchCompareDataFailure(error.message || "Failed to fetch compare data")
      )
   }
}

// Watcher saga
export function* productSaga() {
   // Basic product actions
   yield takeEvery(types.FETCH_PRODUCTS_REQUEST, handleFetchProducts)
   yield takeEvery(types.FETCH_FEATURED_PRODUCTS_REQUEST, handleFetchFeaturedProducts)
   yield takeEvery(types.SEARCH_PRODUCTS_REQUEST, handleSearchProducts)

   // Enhanced product actions
   yield takeEvery(types.FETCH_PRODUCT_DETAIL_REQUEST, handleFetchProductDetail)
   yield takeEvery(types.FETCH_PRODUCT_BY_SLUG_REQUEST, handleFetchProductBySlug)
   yield takeEvery(types.FETCH_TRENDING_PRODUCTS_REQUEST, handleFetchTrendingProducts)
   yield takeEvery(types.FETCH_BESTSELLERS_REQUEST, handleFetchBestsellers)
   yield takeEvery(types.FETCH_NEW_ARRIVALS_REQUEST, handleFetchNewArrivals)
   yield takeEvery(types.FETCH_DEALS_REQUEST, handleFetchDeals)
   yield takeEvery(types.FETCH_CATEGORIES_REQUEST, handleFetchCategories)
   yield takeEvery(types.FETCH_BRANDS_REQUEST, handleFetchBrands)
   yield takeEvery(types.FETCH_FILTERS_REQUEST, handleFetchFilters)
   yield takeEvery(types.FETCH_SIMILAR_PRODUCTS_REQUEST, handleFetchSimilarProducts)
   yield takeEvery(types.FETCH_RELATED_PRODUCTS_REQUEST, handleFetchRelatedProducts)
   yield takeEvery(types.FETCH_PRODUCT_REVIEWS_REQUEST, handleFetchProductReviews)
   yield takeEvery(types.FETCH_PRODUCT_RATINGS_REQUEST, handleFetchProductRatings)
   yield takeEvery(types.FETCH_PRODUCT_VARIANTS_REQUEST, handleFetchProductVariants)
   yield takeEvery(
      types.CHECK_PRODUCT_AVAILABILITY_REQUEST,
      handleCheckProductAvailability
   )
   yield takeEvery(types.FETCH_DELIVERY_OPTIONS_REQUEST, handleFetchDeliveryOptions)
   yield takeEvery(types.FETCH_COMPARE_DATA_REQUEST, handleFetchCompareData)
}
