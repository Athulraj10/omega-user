import * as types from "./types"

// Cart Action Creators
export const setItems = (items: any) => ({
   type: types.SET_ITEMS,
   payload: items,
})

export const addItem = (item: any) => ({
   type: types.ADD_ITEM,
   payload: item,
})

export const removeItem = (id: number) => ({
   type: types.REMOVE_ITEM,
   payload: id,
})

export const updateQuantity = (id: number, quantity: number) => ({
   type: types.UPDATE_QUANTITY,
   payload: { id, quantity },
})

export const updateItemQuantity = (id: number, quantity: number) => ({
   type: types.UPDATE_ITEM_QUANTITY,
   payload: { id, quantity },
})

export const addOrder = (order: any) => ({
   type: types.ADD_ORDER,
   payload: order,
})

export const setOrders = (orders: any) => ({
   type: types.SET_ORDERS,
   payload: orders,
})

export const clearCart = () => ({
   type: types.CLEAR_CART,
})

export const toggleSwitch = () => ({
   type: types.TOGGLE_SWITCH,
})

// Cart API Action Creators
export const fetchCartRequest = () => ({
   type: types.FETCH_CART_REQUEST,
})

export const fetchCartSuccess = (data: any) => ({
   type: types.FETCH_CART_SUCCESS,
   payload: data,
})

export const fetchCartFailure = (error: string) => ({
   type: types.FETCH_CART_FAILURE,
   payload: error,
})

export const addToCartRequest = (productData: any) => ({
   type: types.ADD_TO_CART_REQUEST,
   payload: productData,
})

export const addToCartSuccess = (data: any) => ({
   type: types.ADD_TO_CART_SUCCESS,
   payload: data,
})

export const addToCartFailure = (error: string) => ({
   type: types.ADD_TO_CART_FAILURE,
   payload: error,
})

export const removeFromCartRequest = (productId: number) => ({
   type: types.REMOVE_FROM_CART_REQUEST,
   payload: productId,
})

export const removeFromCartSuccess = (data: any) => ({
   type: types.REMOVE_FROM_CART_SUCCESS,
   payload: data,
})

export const removeFromCartFailure = (error: string) => ({
   type: types.REMOVE_FROM_CART_FAILURE,
   payload: error,
})

export const updateCartQuantityRequest = (productId: number, quantity: number) => ({
   type: types.UPDATE_CART_QUANTITY_REQUEST,
   payload: { productId, quantity },
})

export const updateCartQuantitySuccess = (data: any) => ({
   type: types.UPDATE_CART_QUANTITY_SUCCESS,
   payload: data,
})

export const updateCartQuantityFailure = (error: string) => ({
   type: types.UPDATE_CART_QUANTITY_FAILURE,
   payload: error,
})

export const clearCartRequest = () => ({
   type: types.CLEAR_CART_REQUEST,
})

export const clearCartSuccess = () => ({
   type: types.CLEAR_CART_SUCCESS,
})

export const clearCartFailure = (error: string) => ({
   type: types.CLEAR_CART_FAILURE,
   payload: error,
})

// Product Action Creators
export const fetchProductsRequest = (params?: any) => ({
   type: types.FETCH_PRODUCTS_REQUEST,
   payload: params,
})

export const fetchProductsSuccess = (products: any) => ({
   type: types.FETCH_PRODUCTS_SUCCESS,
   payload: products,
})

export const fetchProductsFailure = (error: string) => ({
   type: types.FETCH_PRODUCTS_FAILURE,
   payload: error,
})

export const fetchFeaturedProductsRequest = () => ({
   type: types.FETCH_FEATURED_PRODUCTS_REQUEST,
})

export const fetchFeaturedProductsSuccess = (products: any) => ({
   type: types.FETCH_FEATURED_PRODUCTS_SUCCESS,
   payload: products,
})

export const fetchFeaturedProductsFailure = (error: string) => ({
   type: types.FETCH_FEATURED_PRODUCTS_FAILURE,
   payload: error,
})

export const searchProductsRequest = (query: string) => ({
   type: types.SEARCH_PRODUCTS_REQUEST,
   payload: query,
})

export const searchProductsSuccess = (products: any) => ({
   type: types.SEARCH_PRODUCTS_SUCCESS,
   payload: products,
})

export const searchProductsFailure = (error: string) => ({
   type: types.SEARCH_PRODUCTS_FAILURE,
   payload: error,
})

// Enhanced Product Action Creators
export const fetchProductDetailRequest = (id: string) => ({
   type: types.FETCH_PRODUCT_DETAIL_REQUEST,
   payload: id,
})

export const fetchProductDetailSuccess = (product: any) => ({
   type: types.FETCH_PRODUCT_DETAIL_SUCCESS,
   payload: product,
})

export const fetchProductDetailFailure = (error: string) => ({
   type: types.FETCH_PRODUCT_DETAIL_FAILURE,
   payload: error,
})

export const fetchProductBySlugRequest = (slug: string) => ({
   type: types.FETCH_PRODUCT_BY_SLUG_REQUEST,
   payload: slug,
})

export const fetchProductBySlugSuccess = (product: any) => ({
   type: types.FETCH_PRODUCT_BY_SLUG_SUCCESS,
   payload: product,
})

export const fetchProductBySlugFailure = (error: string) => ({
   type: types.FETCH_PRODUCT_BY_SLUG_FAILURE,
   payload: error,
})

export const fetchTrendingProductsRequest = (limit?: number) => ({
   type: types.FETCH_TRENDING_PRODUCTS_REQUEST,
   payload: limit,
})

export const fetchTrendingProductsSuccess = (products: any) => ({
   type: types.FETCH_TRENDING_PRODUCTS_SUCCESS,
   payload: products,
})

export const fetchTrendingProductsFailure = (error: string) => ({
   type: types.FETCH_TRENDING_PRODUCTS_FAILURE,
   payload: error,
})

export const fetchBestsellersRequest = (limit?: number) => ({
   type: types.FETCH_BESTSELLERS_REQUEST,
   payload: limit,
})

export const fetchBestsellersSuccess = (products: any) => ({
   type: types.FETCH_BESTSELLERS_SUCCESS,
   payload: products,
})

export const fetchBestsellersFailure = (error: string) => ({
   type: types.FETCH_BESTSELLERS_FAILURE,
   payload: error,
})

export const fetchNewArrivalsRequest = (limit?: number) => ({
   type: types.FETCH_NEW_ARRIVALS_REQUEST,
   payload: limit,
})

export const fetchNewArrivalsSuccess = (products: any) => ({
   type: types.FETCH_NEW_ARRIVALS_SUCCESS,
   payload: products,
})

export const fetchNewArrivalsFailure = (error: string) => ({
   type: types.FETCH_NEW_ARRIVALS_FAILURE,
   payload: error,
})

export const fetchDealsRequest = (limit?: number) => ({
   type: types.FETCH_DEALS_REQUEST,
   payload: limit,
})

export const fetchDealsSuccess = (products: any) => ({
   type: types.FETCH_DEALS_SUCCESS,
   payload: products,
})

export const fetchDealsFailure = (error: string) => ({
   type: types.FETCH_DEALS_FAILURE,
   payload: error,
})

export const fetchCategoriesRequest = () => ({
   type: types.FETCH_CATEGORIES_REQUEST,
})

export const fetchCategoriesSuccess = (categories: any) => ({
   type: types.FETCH_CATEGORIES_SUCCESS,
   payload: categories,
})

export const fetchCategoriesFailure = (error: string) => ({
   type: types.FETCH_CATEGORIES_FAILURE,
   payload: error,
})

export const fetchBrandsRequest = () => ({
   type: types.FETCH_BRANDS_REQUEST,
})

export const fetchBrandsSuccess = (brands: any) => ({
   type: types.FETCH_BRANDS_SUCCESS,
   payload: brands,
})

export const fetchBrandsFailure = (error: string) => ({
   type: types.FETCH_BRANDS_FAILURE,
   payload: error,
})

export const fetchFiltersRequest = () => ({
   type: types.FETCH_FILTERS_REQUEST,
})

export const fetchFiltersSuccess = (filters: any) => ({
   type: types.FETCH_FILTERS_SUCCESS,
   payload: filters,
})

export const fetchFiltersFailure = (error: string) => ({
   type: types.FETCH_FILTERS_FAILURE,
   payload: error,
})

export const fetchSimilarProductsRequest = (productId: string, limit?: number) => ({
   type: types.FETCH_SIMILAR_PRODUCTS_REQUEST,
   payload: { productId, limit },
})

export const fetchSimilarProductsSuccess = (products: any) => ({
   type: types.FETCH_SIMILAR_PRODUCTS_SUCCESS,
   payload: products,
})

export const fetchSimilarProductsFailure = (error: string) => ({
   type: types.FETCH_SIMILAR_PRODUCTS_FAILURE,
   payload: error,
})

export const fetchRelatedProductsRequest = (productId: string, limit?: number) => ({
   type: types.FETCH_RELATED_PRODUCTS_REQUEST,
   payload: { productId, limit },
})

export const fetchRelatedProductsSuccess = (products: any) => ({
   type: types.FETCH_RELATED_PRODUCTS_SUCCESS,
   payload: products,
})

export const fetchRelatedProductsFailure = (error: string) => ({
   type: types.FETCH_RELATED_PRODUCTS_FAILURE,
   payload: error,
})

export const fetchProductReviewsRequest = (productId: string, params?: any) => ({
   type: types.FETCH_PRODUCT_REVIEWS_REQUEST,
   payload: { productId, params },
})

export const fetchProductReviewsSuccess = (reviews: any) => ({
   type: types.FETCH_PRODUCT_REVIEWS_SUCCESS,
   payload: reviews,
})

export const fetchProductReviewsFailure = (error: string) => ({
   type: types.FETCH_PRODUCT_REVIEWS_FAILURE,
   payload: error,
})

export const fetchProductRatingsRequest = (productId: string) => ({
   type: types.FETCH_PRODUCT_RATINGS_REQUEST,
   payload: productId,
})

export const fetchProductRatingsSuccess = (ratings: any) => ({
   type: types.FETCH_PRODUCT_RATINGS_SUCCESS,
   payload: ratings,
})

export const fetchProductRatingsFailure = (error: string) => ({
   type: types.FETCH_PRODUCT_RATINGS_FAILURE,
   payload: error,
})

export const fetchProductVariantsRequest = (productId: string) => ({
   type: types.FETCH_PRODUCT_VARIANTS_REQUEST,
   payload: productId,
})

export const fetchProductVariantsSuccess = (variants: any) => ({
   type: types.FETCH_PRODUCT_VARIANTS_SUCCESS,
   payload: variants,
})

export const fetchProductVariantsFailure = (error: string) => ({
   type: types.FETCH_PRODUCT_VARIANTS_FAILURE,
   payload: error,
})

export const checkProductAvailabilityRequest = (
   productId: string,
   variantId?: string
) => ({
   type: types.CHECK_PRODUCT_AVAILABILITY_REQUEST,
   payload: { productId, variantId },
})

export const checkProductAvailabilitySuccess = (availability: any) => ({
   type: types.CHECK_PRODUCT_AVAILABILITY_SUCCESS,
   payload: availability,
})

export const checkProductAvailabilityFailure = (error: string) => ({
   type: types.CHECK_PRODUCT_AVAILABILITY_FAILURE,
   payload: error,
})

export const fetchDeliveryOptionsRequest = (productId: string) => ({
   type: types.FETCH_DELIVERY_OPTIONS_REQUEST,
   payload: productId,
})

export const fetchDeliveryOptionsSuccess = (options: any) => ({
   type: types.FETCH_DELIVERY_OPTIONS_SUCCESS,
   payload: options,
})

export const fetchDeliveryOptionsFailure = (error: string) => ({
   type: types.FETCH_DELIVERY_OPTIONS_FAILURE,
   payload: error,
})

export const fetchCompareDataRequest = (productId: string) => ({
   type: types.FETCH_COMPARE_DATA_REQUEST,
   payload: productId,
})

export const fetchCompareDataSuccess = (data: any) => ({
   type: types.FETCH_COMPARE_DATA_SUCCESS,
   payload: data,
})

export const fetchCompareDataFailure = (error: string) => ({
   type: types.FETCH_COMPARE_DATA_FAILURE,
   payload: error,
})

// Wishlist Action Creators
export const addWishlist = (item: any) => ({
   type: types.ADD_WISHLIST,
   payload: item,
})

export const removeWishlist = (id: number) => ({
   type: types.REMOVE_WISHLIST,
   payload: id,
})

// Wishlist API Action Creators
export const fetchWishlistRequest = () => ({
   type: types.FETCH_WISHLIST_REQUEST,
})

export const fetchWishlistSuccess = (wishlist: any) => ({
   type: types.FETCH_WISHLIST_SUCCESS,
   payload: wishlist,
})

export const fetchWishlistFailure = (error: string) => ({
   type: types.FETCH_WISHLIST_FAILURE,
   payload: error,
})

export const addToWishlistRequest = (productData: any) => ({
   type: types.ADD_TO_WISHLIST_REQUEST,
   payload: productData,
})

export const addToWishlistSuccess = (wishlist: any) => ({
   type: types.ADD_TO_WISHLIST_SUCCESS,
   payload: wishlist,
})

export const addToWishlistFailure = (error: string) => ({
   type: types.ADD_TO_WISHLIST_FAILURE,
   payload: error,
})

export const removeFromWishlistRequest = (productId: number) => ({
   type: types.REMOVE_FROM_WISHLIST_REQUEST,
   payload: productId,
})

export const removeFromWishlistSuccess = (wishlist: any) => ({
   type: types.REMOVE_FROM_WISHLIST_SUCCESS,
   payload: wishlist,
})

export const removeFromWishlistFailure = (error: string) => ({
   type: types.REMOVE_FROM_WISHLIST_FAILURE,
   payload: error,
})

// Compare Action Creators
export const addCompare = (item: any) => ({
   type: types.ADD_COMPARE,
   payload: item,
})

export const removeCompareItem = (id: number) => ({
   type: types.REMOVE_COMPARE_ITEM,
   payload: id,
})

// Registration Action Creators
export const loginRequest = (credentials: any) => ({
   type: types.LOGIN_REQUEST,
   payload: credentials,
})

export const loginSuccess = (userData: any) => ({
   type: types.LOGIN_SUCCESS,
   payload: userData,
})

export const loginFailure = (error: string) => ({
   type: types.LOGIN_FAILURE,
   payload: error,
})

export const logout = () => ({
   type: types.LOGOUT,
})

export const setUserData = (userData: any) => ({
   type: types.SET_USER_DATA,
   payload: userData,
})

// Filter Action Creators
export const setSelectedCategory = (category: any) => ({
   type: types.SET_SELECTED_CATEGORY,
   payload: category,
})

export const setSelectedWeight = (weight: any) => ({
   type: types.SET_SELECTED_WEIGHT,
   payload: weight,
})

export const setPriceRange = (range: any) => ({
   type: types.SET_PRICE_RANGE,
   payload: range,
})

export const setRange = (range: any) => ({
   type: types.SET_RANGE,
   payload: range,
})

export const setSortOption = (option: string) => ({
   type: types.SET_SORT_OPTION,
   payload: option,
})

export const setSearchTerm = (term: string) => ({
   type: types.SET_SEARCH_TERM,
   payload: term,
})

export const setMinPrice = (price: number) => ({
   type: types.SET_MIN_PRICE,
   payload: price,
})

export const setMaxPrice = (price: number) => ({
   type: types.SET_MAX_PRICE,
   payload: price,
})

export const setSelectedBrands = (brands: any) => ({
   type: types.SET_SELECTED_BRANDS,
   payload: brands,
})

export const setSelectedColor = (color: any) => ({
   type: types.SET_SELECTED_COLOR,
   payload: color,
})

export const setSelectedTags = (tags: any) => ({
   type: types.SET_SELECTED_TAGS,
   payload: tags,
})

// Step Action Creators
export const setStep = (step: number) => ({
   type: types.SET_STEP,
   payload: step,
})

// Theme Action Creators
export const setTheme = (theme: string) => ({
   type: types.SET_THEME,
   payload: theme,
})

// Order Action Creators
export const fetchOrdersRequest = () => ({
   type: types.FETCH_ORDERS_REQUEST,
})

export const fetchOrdersSuccess = (orders: any) => ({
   type: types.FETCH_ORDERS_SUCCESS,
   payload: orders,
})

export const fetchOrdersFailure = (error: string) => ({
   type: types.FETCH_ORDERS_FAILURE,
   payload: error,
})

export const fetchOrderDetailRequest = (orderId: string) => ({
   type: types.FETCH_ORDER_DETAIL_REQUEST,
   payload: orderId,
})

export const fetchOrderDetailSuccess = (order: any) => ({
   type: types.FETCH_ORDER_DETAIL_SUCCESS,
   payload: order,
})

export const fetchOrderDetailFailure = (error: string) => ({
   type: types.FETCH_ORDER_DETAIL_FAILURE,
   payload: error,
})

export const placeOrderRequest = (orderData: any) => ({
   type: types.PLACE_ORDER_REQUEST,
   payload: orderData,
})

export const placeOrderSuccess = (order: any) => ({
   type: types.PLACE_ORDER_SUCCESS,
   payload: order,
})

export const placeOrderFailure = (error: string) => ({
   type: types.PLACE_ORDER_FAILURE,
   payload: error,
})

export const cancelOrderRequest = (orderId: string) => ({
   type: types.CANCEL_ORDER_REQUEST,
   payload: orderId,
})

export const cancelOrderSuccess = (order: any) => ({
   type: types.CANCEL_ORDER_SUCCESS,
   payload: order,
})

export const cancelOrderFailure = (error: string) => ({
   type: types.CANCEL_ORDER_FAILURE,
   payload: error,
})
