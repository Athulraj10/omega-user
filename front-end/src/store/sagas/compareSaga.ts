import { call, put } from 'redux-saga/effects';
import { takeEvery } from 'redux-saga';
import * as types from '../actions/types';
import * as actions from '../actions';

// Example API call function (you can replace with your actual API)
const apiCall = async (endpoint: string, data?: any) => {
  return fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then(response => response.json());
};

// Saga for handling compare operations
function* handleAddCompare(action: any) {
  try {
    // You can add API calls here if needed
    // const response = yield call(apiCall, '/api/compare/add', action.payload);
    
    yield put({ type: types.ADD_COMPARE, payload: action.payload });
  } catch (error) {
    console.error('Error adding item to compare:', error);
  }
}

function* handleRemoveCompareItem(action: any) {
  try {
    // You can add API calls here if needed
    // const response = yield call(apiCall, '/api/compare/remove', { id: action.payload });
    
    yield put({ type: types.REMOVE_COMPARE_ITEM, payload: action.payload });
  } catch (error) {
    console.error('Error removing item from compare:', error);
  }
}

// Watcher saga
export function* compareSaga() {
  yield takeEvery(types.ADD_COMPARE, handleAddCompare);
  yield takeEvery(types.REMOVE_COMPARE_ITEM, handleRemoveCompareItem);
} 