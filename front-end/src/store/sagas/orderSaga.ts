import { call, put } from "redux-saga/effects"
import { takeEvery } from "redux-saga"
import * as types from "../actions/types"
import * as actions from "../actions"
import { ordersAPI } from "../../services/api"

// Saga for handling order operations
function* handleFetchOrders() {
   try {
      yield put(actions.fetchOrdersRequest())
      const response = yield call(ordersAPI.getOrders)
      yield put(actions.fetchOrdersSuccess(response.data || response))
   } catch (error: any) {
      yield put(actions.fetchOrdersFailure(error.message || "Failed to fetch orders"))
   }
}

function* handleFetchOrderDetail(action: any) {
   try {
      yield put(actions.fetchOrderDetailRequest())
      const response = yield call(ordersAPI.getOrderById, action.payload)
      yield put(actions.fetchOrderDetailSuccess(response.data || response))
   } catch (error: any) {
      yield put(
         actions.fetchOrderDetailFailure(error.message || "Failed to fetch order detail")
      )
   }
}

function* handlePlaceOrder(action: any) {
   try {
      yield put(actions.placeOrderRequest())
      const response = yield call(ordersAPI.createOrder, action.payload)
      yield put(actions.placeOrderSuccess(response.data || response))
   } catch (error: any) {
      yield put(actions.placeOrderFailure(error.message || "Failed to place order"))
   }
}

function* handleCancelOrder(action: any) {
   try {
      yield put(actions.cancelOrderRequest())
      const response = yield call(ordersAPI.cancelOrder, action.payload)
      yield put(actions.cancelOrderSuccess(response.data || response))
   } catch (error: any) {
      yield put(actions.cancelOrderFailure(error.message || "Failed to cancel order"))
   }
}

// Watcher saga
export function* orderSaga() {
   yield takeEvery(types.FETCH_ORDERS_REQUEST, handleFetchOrders)
   yield takeEvery(types.FETCH_ORDER_DETAIL_REQUEST, handleFetchOrderDetail)
   yield takeEvery(types.PLACE_ORDER_REQUEST, handlePlaceOrder)
   yield takeEvery(types.CANCEL_ORDER_REQUEST, handleCancelOrder)
}
