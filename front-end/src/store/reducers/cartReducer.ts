import * as types from "../actions/types"

interface Item {
   id: number
   title: string
   oldPrice: number
   waight: string
   image: string
   imageTwo: string
   date: string
   status: string
   rating: number
   newPrice: number
   location: string
   brand: string
   sku: number
   category: string
   quantity: number
}

export interface CartState {
   items: Item[]
   orders: object[]
   isSwitchOn: boolean
   loading: boolean
   error: string | null
}

const defaultItems: Item[] = []

const defaultOrders: object[] = [
   {
      orderId: "65820",
      date: "2024-08-23T06:45:41.989Z",
      shippingMethod: "free",
      totalItems: 3,
      totalPrice: 194.4,
      status: "Completed",
      products: [
         {
            id: 1,
            title: "Women's wallet Hand Purse",
            image: process.env.NEXT_PUBLIC_URL + "/assets/img/product-images/48_1.jpg",
            imageTwo: process.env.NEXT_PUBLIC_URL + "/assets/img/product-images/48_1.jpg",
            newPrice: 50,
            oldPrice: 70,
            date: "",
            rating: 3,
            status: "Available",
            waight: "1 pcs",
            location: "in Store",
            brand: "Darsh Mart",
            sku: 12332,
            category: "",
            quantity: 1,
         },
         {
            id: 2,
            title: "Rose Gold Earring",
            date: "",
            image: process.env.NEXT_PUBLIC_URL + "/assets/img/product-images/53_1.jpg",
            imageTwo: process.env.NEXT_PUBLIC_URL + "/assets/img/product-images/53_1.jpg",
            rating: 4,
            newPrice: 60,
            oldPrice: 80,
            status: "Out Of Stock",
            waight: "200g Pack",
            location: "Online",
            brand: "Bhisma Organice",
            sku: 64532,
            category: "",
            quantity: 1,
         },
         {
            id: 3,
            title: "Apple",
            image: process.env.NEXT_PUBLIC_URL + "/assets/img/product-images/21_1.jpg",
            imageTwo: process.env.NEXT_PUBLIC_URL + "/assets/img/product-images/21_1.jpg",
            newPrice: 10,
            oldPrice: 12,
            date: "",
            waight: "5 pcs",
            rating: 2,
            status: "Available",
            location: "in Store, Online",
            brand: "Peoples Store",
            sku: 23445,
            category: "",
            quantity: 1,
         },
      ],
      address: {
         id: "1724395538835",
         firstName: "John",
         lastName: "Smith",
         address: "    My Street, Big town BG23 4YZ",
         city: "Shaghat",
         postalCode: "395004",
         country: "AM",
         state: "SU",
         countryName: "Armenia",
         stateName: "Syunik Province",
      },
   },
]

const initialState: CartState = {
   items: defaultItems,
   orders: defaultOrders,
   isSwitchOn: false,
   loading: false,
   error: null,
}

const cartReducer = (state = initialState, action: any): CartState => {
   switch (action.type) {
      case types.SET_ITEMS:
         return {
            ...state,
            items: action.payload,
         }

      case types.ADD_ITEM:
         const existingItem = state.items.find((item) => item.id === action.payload.id)
         if (existingItem) {
            return {
               ...state,
               items: state.items.map((item) =>
                  item.id === action.payload.id
                     ? { ...item, quantity: item.quantity + 1 }
                     : item
               ),
            }
         }
         return {
            ...state,
            items: [...state.items, { ...action.payload, quantity: 1 }],
         }

      case types.REMOVE_ITEM:
         return {
            ...state,
            items: state.items.filter((item) => item.id !== action.payload),
         }

      case types.UPDATE_QUANTITY:
         return {
            ...state,
            items: state.items.map((item) =>
               item.id === action.payload.id
                  ? { ...item, quantity: action.payload.quantity }
                  : item
            ),
         }

      case types.UPDATE_ITEM_QUANTITY:
         return {
            ...state,
            items: state.items.map((item) =>
               item.id === action.payload.id
                  ? { ...item, quantity: action.payload.quantity }
                  : item
            ),
         }

      case types.ADD_ORDER:
         return {
            ...state,
            orders: [...state.orders, action.payload],
         }

      case types.SET_ORDERS:
         return {
            ...state,
            orders: action.payload,
         }

      case types.CLEAR_CART:
         return {
            ...state,
            items: [],
         }

      case types.TOGGLE_SWITCH:
         return {
            ...state,
            isSwitchOn: !state.isSwitchOn,
         }

      // API Actions
      case types.FETCH_CART_REQUEST:
         return {
            ...state,
            loading: true,
            error: null,
         }

      case types.FETCH_CART_SUCCESS:
         return {
            ...state,
            items: action.payload.items || [],
            loading: false,
            error: null,
         }

      case types.FETCH_CART_FAILURE:
         return {
            ...state,
            loading: false,
            error: action.payload,
         }

      case types.ADD_TO_CART_REQUEST:
         return {
            ...state,
            loading: true,
            error: null,
         }

      case types.ADD_TO_CART_SUCCESS:
         return {
            ...state,
            items: action.payload.items || state.items,
            loading: false,
            error: null,
         }

      case types.ADD_TO_CART_FAILURE:
         return {
            ...state,
            loading: false,
            error: action.payload,
         }

      case types.REMOVE_FROM_CART_REQUEST:
         return {
            ...state,
            loading: true,
            error: null,
         }

      case types.REMOVE_FROM_CART_SUCCESS:
         return {
            ...state,
            items: action.payload.items || state.items,
            loading: false,
            error: null,
         }

      case types.REMOVE_FROM_CART_FAILURE:
         return {
            ...state,
            loading: false,
            error: action.payload,
         }

      case types.UPDATE_CART_QUANTITY_REQUEST:
         return {
            ...state,
            loading: true,
            error: null,
         }

      case types.UPDATE_CART_QUANTITY_SUCCESS:
         return {
            ...state,
            items: action.payload.items || state.items,
            loading: false,
            error: null,
         }

      case types.UPDATE_CART_QUANTITY_FAILURE:
         return {
            ...state,
            loading: false,
            error: action.payload,
         }

      case types.CLEAR_CART_REQUEST:
         return {
            ...state,
            loading: true,
            error: null,
         }

      case types.CLEAR_CART_SUCCESS:
         return {
            ...state,
            items: [],
            loading: false,
            error: null,
         }

      case types.CLEAR_CART_FAILURE:
         return {
            ...state,
            loading: false,
            error: action.payload,
         }

      default:
         return state
   }
}

export default cartReducer
