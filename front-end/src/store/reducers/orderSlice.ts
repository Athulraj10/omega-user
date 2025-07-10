import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface OrderItem {
   product: string
   quantity: number
   priceAtPurchase: number
}

export interface Order {
   _id: string
   user: string
   items: OrderItem[]
   shippingAddress: any
   status: string
   paymentStatus: string
   totalAmount: number
   createdAt: string
   updatedAt: string
}

interface OrdersState {
   orders: Order[]
   orderDetails: Order | null
   loading: boolean
   error: string | null
}

const initialState: OrdersState = {
   orders: [],
   orderDetails: null,
   loading: false,
   error: null,
}

const orderSlice = createSlice({
   name: "orders",
   initialState,
   reducers: {
      fetchOrdersStart(state) {
         state.loading = true
         state.error = null
      },
      fetchOrdersSuccess(state, action: PayloadAction<Order[]>) {
         state.orders = action.payload
         state.loading = false
      },
      fetchOrdersFailure(state, action: PayloadAction<string>) {
         state.loading = false
         state.error = action.payload
      },
      fetchOrderDetailStart(state) {
         state.loading = true
         state.error = null
      },
      fetchOrderDetailSuccess(state, action: PayloadAction<Order>) {
         state.orderDetails = action.payload
         state.loading = false
      },
      fetchOrderDetailFailure(state, action: PayloadAction<string>) {
         state.loading = false
         state.error = action.payload
      },
      placeOrderStart(state) {
         state.loading = true
         state.error = null
      },
      placeOrderSuccess(state, action: PayloadAction<Order>) {
         state.orders.unshift(action.payload)
         state.loading = false
      },
      placeOrderFailure(state, action: PayloadAction<string>) {
         state.loading = false
         state.error = action.payload
      },
      cancelOrderStart(state) {
         state.loading = true
         state.error = null
      },
      cancelOrderSuccess(state, action: PayloadAction<Order>) {
         const idx = state.orders.findIndex((o) => o._id === action.payload._id)
         if (idx !== -1) state.orders[idx] = action.payload
         state.loading = false
      },
      cancelOrderFailure(state, action: PayloadAction<string>) {
         state.loading = false
         state.error = action.payload
      },
      clearOrderError(state) {
         state.error = null
      },
   },
})

export const {
   fetchOrdersStart,
   fetchOrdersSuccess,
   fetchOrdersFailure,
   fetchOrderDetailStart,
   fetchOrderDetailSuccess,
   fetchOrderDetailFailure,
   placeOrderStart,
   placeOrderSuccess,
   placeOrderFailure,
   cancelOrderStart,
   cancelOrderSuccess,
   cancelOrderFailure,
   clearOrderError,
} = orderSlice.actions

export default orderSlice.reducer
