import { call, put } from 'redux-saga/effects';
import { takeEvery } from 'redux-saga';
import * as types from '../actions/types';
import * as actions from '../actions';
import { cartAPI } from '../../services/api';

// Saga for handling cart operations
function* handleFetchCart() {
  try {
    yield put(actions.fetchCartRequest());
    const response = yield call(cartAPI.getCart);
    yield put(actions.fetchCartSuccess(response));
  } catch (error: any) {
    yield put(actions.fetchCartFailure(error.message || 'Failed to fetch cart'));
  }
}

function* handleAddItem(action: any) {
  try {
    yield put(actions.addToCartRequest(action.payload));
    const response = yield call(cartAPI.addToCart, action.payload);
    yield put(actions.addToCartSuccess(response));
  } catch (error: any) {
    yield put(actions.addToCartFailure(error.message || 'Failed to add item to cart'));
  }
}

function* handleRemoveItem(action: any) {
  try {
    yield put(actions.removeFromCartRequest(action.payload));
    const response = yield call(cartAPI.removeFromCart, action.payload);
    yield put(actions.removeFromCartSuccess(response));
  } catch (error: any) {
    yield put(actions.removeFromCartFailure(error.message || 'Failed to remove item from cart'));
  }
}

function* handleUpdateQuantity(action: any) {
  try {
    yield put(actions.updateCartQuantityRequest(action.payload.id, action.payload.quantity));
    const response = yield call(cartAPI.updateQuantity, action.payload.id, action.payload.quantity);
    yield put(actions.updateCartQuantitySuccess(response));
  } catch (error: any) {
    yield put(actions.updateCartQuantityFailure(error.message || 'Failed to update quantity'));
  }
}

function* handleAddOrder(action: any) {
  try {
    // You can add API calls here if needed
    // const response = yield call(apiCall, '/api/orders/create', action.payload);
    
    yield put({ type: types.ADD_ORDER, payload: action.payload });
  } catch (error) {
    console.error('Error adding order:', error);
  }
}

function* handleClearCart() {
  try {
    yield put(actions.clearCartRequest());
    yield call(cartAPI.clearCart);
    yield put(actions.clearCartSuccess());
  } catch (error: any) {
    yield put(actions.clearCartFailure(error.message || 'Failed to clear cart'));
  }
}

// Watcher sagas
export function* cartSaga() {
  yield takeEvery(types.FETCH_CART_REQUEST, handleFetchCart);
  yield takeEvery(types.ADD_ITEM, handleAddItem);
  yield takeEvery(types.REMOVE_ITEM, handleRemoveItem);
  yield takeEvery(types.UPDATE_QUANTITY, handleUpdateQuantity);
  yield takeEvery(types.ADD_ORDER, handleAddOrder);
  yield takeEvery(types.CLEAR_CART, handleClearCart);
} 
