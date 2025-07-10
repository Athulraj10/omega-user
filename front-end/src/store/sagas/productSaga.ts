import { call, put } from 'redux-saga/effects';
import { takeEvery } from 'redux-saga';
import * as types from '../actions/types';
import * as actions from '../actions';
import { productAPI } from '../../services/api';

// Saga for handling product operations
function* handleFetchProducts(action: any) {
  try {
    yield put(actions.fetchProductsRequest(action.payload));
    const response = yield call(productAPI.getProducts, action.payload);
    yield put(actions.fetchProductsSuccess(response));
  } catch (error: any) {
    yield put(actions.fetchProductsFailure(error.message || 'Failed to fetch products'));
  }
}

function* handleFetchFeaturedProducts() {
  try {
    yield put(actions.fetchFeaturedProductsRequest());
    const response = yield call(productAPI.getFeatured);
    yield put(actions.fetchFeaturedProductsSuccess(response));
  } catch (error: any) {
    yield put(actions.fetchFeaturedProductsFailure(error.message || 'Failed to fetch featured products'));
  }
}

function* handleSearchProducts(action: any) {
  try {
    yield put(actions.searchProductsRequest(action.payload));
    const response = yield call(productAPI.searchProducts, action.payload);
    yield put(actions.searchProductsSuccess(response));
  } catch (error: any) {
    yield put(actions.searchProductsFailure(error.message || 'Failed to search products'));
  }
}

// Watcher saga
export function* productSaga() {
  yield takeEvery(types.FETCH_PRODUCTS_REQUEST, handleFetchProducts);
  yield takeEvery(types.FETCH_FEATURED_PRODUCTS_REQUEST, handleFetchFeaturedProducts);
  yield takeEvery(types.SEARCH_PRODUCTS_REQUEST, handleSearchProducts);
} 