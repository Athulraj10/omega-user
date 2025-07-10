import { call, put } from 'redux-saga/effects';
import { takeEvery } from 'redux-saga';
import * as types from '../actions/types';
import * as actions from '../actions';
import { wishlistAPI } from '../../services/api';

// Saga for handling wishlist operations
function* handleFetchWishlist() {
  try {
    yield put(actions.fetchWishlistRequest());
    const response = yield call(wishlistAPI.getWishlist);
    yield put(actions.fetchWishlistSuccess(response));
  } catch (error: any) {
    yield put(actions.fetchWishlistFailure(error.message || 'Failed to fetch wishlist'));
  }
}

function* handleAddWishlist(action: any) {
  try {
    yield put(actions.addToWishlistRequest(action.payload));
    const response = yield call(wishlistAPI.addToWishlist, action.payload);
    yield put(actions.addToWishlistSuccess(response));
  } catch (error: any) {
    yield put(actions.addToWishlistFailure(error.message || 'Failed to add item to wishlist'));
  }
}

function* handleRemoveWishlist(action: any) {
  try {
    yield put(actions.removeFromWishlistRequest(action.payload));
    const response = yield call(wishlistAPI.removeFromWishlist, action.payload);
    yield put(actions.removeFromWishlistSuccess(response));
  } catch (error: any) {
    yield put(actions.removeFromWishlistFailure(error.message || 'Failed to remove item from wishlist'));
  }
}

// Watcher saga
export function* wishlistSaga() {
  yield takeEvery(types.FETCH_WISHLIST_REQUEST, handleFetchWishlist);
  yield takeEvery(types.ADD_WISHLIST, handleAddWishlist);
  yield takeEvery(types.REMOVE_WISHLIST, handleRemoveWishlist);
} 