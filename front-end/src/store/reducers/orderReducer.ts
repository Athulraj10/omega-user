import * as types from "../actions/types"

interface OrderItem {
   product: string
   quantity: number
   priceAtPurchase: number
}

interface Order {
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

const orderReducer = (state = initialState, action: any): OrdersState => {
   switch (action.type) {
      case types.FETCH_ORDERS_REQUEST:
         return {
            ...state,
            loading: true,
            error: null,
         }
      case types.FETCH_ORDERS_SUCCESS:
         return {
            ...state,
            orders: action.payload,
            loading: false,
         }
      case types.FETCH_ORDERS_FAILURE:
         return {
            ...state,
            loading: false,
            error: action.payload,
         }
      case types.FETCH_ORDER_DETAIL_REQUEST:
         return {
            ...state,
            loading: true,
            error: null,
         }
      case types.FETCH_ORDER_DETAIL_SUCCESS:
         return {
            ...state,
            orderDetails: action.payload,
            loading: false,
         }
      case types.FETCH_ORDER_DETAIL_FAILURE:
         return {
            ...state,
            loading: false,
            error: action.payload,
         }
      case types.PLACE_ORDER_REQUEST:
         return {
            ...state,
            loading: true,
            error: null,
         }
      case types.PLACE_ORDER_SUCCESS:
         return {
            ...state,
            orders: [action.payload, ...state.orders],
            loading: false,
         }
      case types.PLACE_ORDER_FAILURE:
         return {
            ...state,
            loading: false,
            error: action.payload,
         }
      case types.CANCEL_ORDER_REQUEST:
         return {
            ...state,
            loading: true,
            error: null,
         }
      case types.CANCEL_ORDER_SUCCESS:
         return {
            ...state,
            orders: state.orders.map((order) =>
               order._id === action.payload._id ? action.payload : order
            ),
            loading: false,
         }
      case types.CANCEL_ORDER_FAILURE:
         return {
            ...state,
            loading: false,
            error: action.payload,
         }
      default:
         return state
   }
}

export default orderReducer
