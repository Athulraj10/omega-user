import * as types from './types';

// Cart Action Creators
export const addItem = (item: any) => ({
  type: types.ADD_ITEM,
  payload: item,
});

export const removeItem = (id: number) => ({
  type: types.REMOVE_ITEM,
  payload: id,
});

export const updateQuantity = (id: number, quantity: number) => ({
  type: types.UPDATE_QUANTITY,
  payload: { id, quantity },
});

export const updateItemQuantity = (id: number, quantity: number) => ({
  type: types.UPDATE_ITEM_QUANTITY,
  payload: { id, quantity },
});

export const setItems = (items: any[]) => ({
  type: types.SET_ITEMS,
  payload: items,
});

export const addOrder = (order: any) => ({
  type: types.ADD_ORDER,
  payload: order,
});

export const setOrders = (orders: any[]) => ({
  type: types.SET_ORDERS,
  payload: orders,
});

export const clearCart = () => ({
  type: types.CLEAR_CART,
});

export const toggleSwitch = () => ({
  type: types.TOGGLE_SWITCH,
});

// Cart API Action Creators
export const fetchCartRequest = () => ({
  type: types.FETCH_CART_REQUEST,
});

export const fetchCartSuccess = (cart: any) => ({
  type: types.FETCH_CART_SUCCESS,
  payload: cart,
});

export const fetchCartFailure = (error: string) => ({
  type: types.FETCH_CART_FAILURE,
  payload: error,
});

export const addToCartRequest = (product: any) => ({
  type: types.ADD_TO_CART_REQUEST,
  payload: product,
});

export const addToCartSuccess = (cart: any) => ({
  type: types.ADD_TO_CART_SUCCESS,
  payload: cart,
});

export const addToCartFailure = (error: string) => ({
  type: types.ADD_TO_CART_FAILURE,
  payload: error,
});

export const removeFromCartRequest = (productId: number) => ({
  type: types.REMOVE_FROM_CART_REQUEST,
  payload: productId,
});

export const removeFromCartSuccess = (cart: any) => ({
  type: types.REMOVE_FROM_CART_SUCCESS,
  payload: cart,
});

export const removeFromCartFailure = (error: string) => ({
  type: types.REMOVE_FROM_CART_FAILURE,
  payload: error,
});

export const updateCartQuantityRequest = (productId: number, quantity: number) => ({
  type: types.UPDATE_CART_QUANTITY_REQUEST,
  payload: { productId, quantity },
});

export const updateCartQuantitySuccess = (cart: any) => ({
  type: types.UPDATE_CART_QUANTITY_SUCCESS,
  payload: cart,
});

export const updateCartQuantityFailure = (error: string) => ({
  type: types.UPDATE_CART_QUANTITY_FAILURE,
  payload: error,
});

export const clearCartRequest = () => ({
  type: types.CLEAR_CART_REQUEST,
});

export const clearCartSuccess = () => ({
  type: types.CLEAR_CART_SUCCESS,
});

export const clearCartFailure = (error: string) => ({
  type: types.CLEAR_CART_FAILURE,
  payload: error,
});

// Registration Action Creators
export const loginRequest = (credentials: any) => ({
  type: types.LOGIN_REQUEST,
  payload: credentials,
});

export const loginSuccess = (userData: any) => ({
  type: types.LOGIN_SUCCESS,
  payload: userData,
});

export const loginFailure = (error: string) => ({
  type: types.LOGIN_FAILURE,
  payload: error,
});

export const logout = () => ({
  type: types.LOGOUT,
});

export const setUserData = (userData: any) => ({
  type: types.SET_USER_DATA,
  payload: userData,
});

// Product Action Creators
export const fetchProductsRequest = (params?: any) => ({
  type: types.FETCH_PRODUCTS_REQUEST,
  payload: params,
});

export const fetchProductsSuccess = (products: any) => ({
  type: types.FETCH_PRODUCTS_SUCCESS,
  payload: products,
});

export const fetchProductsFailure = (error: string) => ({
  type: types.FETCH_PRODUCTS_FAILURE,
  payload: error,
});

export const fetchFeaturedProductsRequest = () => ({
  type: types.FETCH_FEATURED_PRODUCTS_REQUEST,
});

export const fetchFeaturedProductsSuccess = (products: any) => ({
  type: types.FETCH_FEATURED_PRODUCTS_SUCCESS,
  payload: products,
});

export const fetchFeaturedProductsFailure = (error: string) => ({
  type: types.FETCH_FEATURED_PRODUCTS_FAILURE,
  payload: error,
});

export const searchProductsRequest = (query: string) => ({
  type: types.SEARCH_PRODUCTS_REQUEST,
  payload: query,
});

export const searchProductsSuccess = (products: any) => ({
  type: types.SEARCH_PRODUCTS_SUCCESS,
  payload: products,
});

export const searchProductsFailure = (error: string) => ({
  type: types.SEARCH_PRODUCTS_FAILURE,
  payload: error,
});

// Wishlist Action Creators
export const addWishlist = (item: any) => ({
  type: types.ADD_WISHLIST,
  payload: item,
});

export const removeWishlist = (id: number) => ({
  type: types.REMOVE_WISHLIST,
  payload: id,
});

// Wishlist API Action Creators
export const fetchWishlistRequest = () => ({
  type: types.FETCH_WISHLIST_REQUEST,
});

export const fetchWishlistSuccess = (wishlist: any) => ({
  type: types.FETCH_WISHLIST_SUCCESS,
  payload: wishlist,
});

export const fetchWishlistFailure = (error: string) => ({
  type: types.FETCH_WISHLIST_FAILURE,
  payload: error,
});

export const addToWishlistRequest = (product: any) => ({
  type: types.ADD_TO_WISHLIST_REQUEST,
  payload: product,
});

export const addToWishlistSuccess = (wishlist: any) => ({
  type: types.ADD_TO_WISHLIST_SUCCESS,
  payload: wishlist,
});

export const addToWishlistFailure = (error: string) => ({
  type: types.ADD_TO_WISHLIST_FAILURE,
  payload: error,
});

export const removeFromWishlistRequest = (productId: number) => ({
  type: types.REMOVE_FROM_WISHLIST_REQUEST,
  payload: productId,
});

export const removeFromWishlistSuccess = (wishlist: any) => ({
  type: types.REMOVE_FROM_WISHLIST_SUCCESS,
  payload: wishlist,
});

export const removeFromWishlistFailure = (error: string) => ({
  type: types.REMOVE_FROM_WISHLIST_FAILURE,
  payload: error,
});

// Compare Action Creators
export const addCompare = (item: any) => ({
  type: types.ADD_COMPARE,
  payload: item,
});

export const removeCompareItem = (id: number) => ({
  type: types.REMOVE_COMPARE_ITEM,
  payload: id,
});

// Step Action Creators
export const markStepAsDone = (stepIndex: number) => ({
  type: types.MARK_STEP_AS_DONE,
  payload: stepIndex,
});

// Filter Action Creators
export const setSelectedCategory = (categories: string[]) => ({
  type: types.SET_SELECTED_CATEGORY,
  payload: categories,
});

export const setSelectedWeight = (weights: string[]) => ({
  type: types.SET_SELECTED_WEIGHT,
  payload: weights,
});

export const setPriceRange = (range: { min: number; max: number }) => ({
  type: types.SET_PRICE_RANGE,
  payload: range,
});

export const setRange = (range: { min: number; max: number }) => ({
  type: types.SET_RANGE,
  payload: range,
});

export const setSortOption = (option: string) => ({
  type: types.SET_SORT_OPTION,
  payload: option,
});

export const setSearchTerm = (term: string) => ({
  type: types.SET_SEARCH_TERM,
  payload: term,
});

export const setMinPrice = (price: number) => ({
  type: types.SET_MIN_PRICE,
  payload: price,
});

export const setMaxPrice = (price: number) => ({
  type: types.SET_MAX_PRICE,
  payload: price,
});

export const setSelectedBrands = (brands: string[]) => ({
  type: types.SET_SELECTED_BRANDS,
  payload: brands,
});

export const setSelectedColor = (colors: string[]) => ({
  type: types.SET_SELECTED_COLOR,
  payload: colors,
});

export const setSelectedTags = (tags: string[]) => ({
  type: types.SET_SELECTED_TAGS,
  payload: tags,
});

// Theme Action Creators
export const setTheme = (theme: string) => ({
  type: types.SET_THEME,
  payload: theme,
});

export const toggleMode = () => ({
  type: types.TOGGLE_MODE,
});

export const setDirection = (direction: 'LTR' | 'RTL') => ({
  type: types.SET_DIRECTION,
  payload: direction,
}); 