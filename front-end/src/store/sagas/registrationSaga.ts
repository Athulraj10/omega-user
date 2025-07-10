import { call, put } from 'redux-saga/effects';
import { takeLatest } from 'redux-saga';
import * as types from '../actions/types';
import * as actions from '../actions';
import { authAPI } from '../../services/api';

// Saga for handling login
function* handleLogin(action: any) {
  try {
    // Call the login API
    const response = yield call(authAPI.login, action.payload);
    
    if (response.success) {
      // Dispatch success action
      yield put(actions.loginSuccess(response.data));
    } else {
      // Dispatch failure action
      yield put(actions.loginFailure(response.message || 'Login failed'));
    }
  } catch (error: any) {
    // Dispatch failure action
    yield put(actions.loginFailure(error.message || 'Network error occurred'));
  }
}

// Watcher saga
export function* registrationSaga() {
  yield takeLatest(types.LOGIN_REQUEST, handleLogin);
} 