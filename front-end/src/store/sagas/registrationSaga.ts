import { call, put } from "redux-saga/effects"
import { takeLatest } from "redux-saga"
import * as types from "../actions/types"
import * as actions from "../actions"
import { authAPI } from "../../services/api"

// Saga for handling login
function* handleLogin(action: any) {
   try {
      // Call the login API
      const response = yield call(authAPI.login, action.payload)

      if (response.success) {
         // Store token in localStorage
         if (typeof window !== "undefined") {
            localStorage.setItem("token", response.token)
         }
         // Dispatch success action
         yield put(actions.loginSuccess(response.data))
      } else {
         // Dispatch failure action
         yield put(actions.loginFailure(response.message || "Login failed"))
      }
   } catch (error: any) {
      // Dispatch failure action
      yield put(actions.loginFailure(error.message || "Network error occurred"))
   }
}

// Saga for handling registration
function* handleRegister(action: any) {
   try {
      const response = yield call(authAPI.register, action.payload)

      if (response.success) {
         // Store token in localStorage if provided
         if (response.token && typeof window !== "undefined") {
            localStorage.setItem("token", response.token)
         }
         yield put(actions.loginSuccess(response.data))
      } else {
         yield put(actions.loginFailure(response.message || "Registration failed"))
      }
   } catch (error: any) {
      yield put(actions.loginFailure(error.message || "Network error occurred"))
   }
}

// Saga for handling logout
function* handleLogout() {
   try {
      // Call logout API
      yield call(authAPI.logout)

      // Clear token from localStorage
      if (typeof window !== "undefined") {
         localStorage.removeItem("token")
         sessionStorage.removeItem("token")
      }

      // Dispatch logout action
      yield put(actions.logout())
   } catch (error: any) {
      // Even if logout API fails, clear local storage and logout
      if (typeof window !== "undefined") {
         localStorage.removeItem("token")
         sessionStorage.removeItem("token")
      }
      yield put(actions.logout())
   }
}

// Saga for handling forgot password
function* handleForgotPassword(action: any) {
   try {
      const response = yield call(authAPI.forgotPassword, action.payload)

      if (response.success) {
         // You might want to dispatch a success action here
         console.log("Password reset email sent")
      } else {
         console.error("Failed to send password reset email:", response.message)
      }
   } catch (error: any) {
      console.error("Error sending password reset email:", error.message)
   }
}

// Saga for handling reset password
function* handleResetPassword(action: any) {
   try {
      const response = yield call(
         authAPI.resetPassword,
         action.payload.token,
         action.payload.password
      )

      if (response.success) {
         console.log("Password reset successful")
      } else {
         console.error("Password reset failed:", response.message)
      }
   } catch (error: any) {
      console.error("Error resetting password:", error.message)
   }
}

// Watcher saga
export function* registrationSaga() {
   yield takeLatest(types.LOGIN_REQUEST, handleLogin)
   yield takeLatest(types.REGISTER_REQUEST, handleRegister)
   yield takeLatest(types.LOGOUT, handleLogout)
   yield takeLatest(types.FORGOT_PASSWORD_REQUEST, handleForgotPassword)
   yield takeLatest(types.RESET_PASSWORD_REQUEST, handleResetPassword)
}
