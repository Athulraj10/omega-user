import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Item {
  _id: number;
  title: string;
  oldPrice: number;
  waight: string;
  image: string;
  imageTwo: string;
  date: string;
  status: string;
  rating: number;
  newPrice: number;
  location: string;
  brand: string;
  sku: number;
  category: string;
  quantity: number;
}

interface Order {
  orderId: string;
  date: string;
  shippingMethod: string;
  totalItems: number;
  totalPrice: number;
  status: string;
  products: Item[];
  address: any;
}

export interface CartState {
  items: Item[];
  orders: Order[];
  isSwitchOn: boolean;
}

const initialState: CartState = {
  items: [],
  orders: [],
  isSwitchOn:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("switch") || "false")
      : false,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartItems(state, action: PayloadAction<any>) {
      state.items = action.payload;
    },
  },
});

export const {
  setCartItems,
} = cartSlice.actions;

export default cartSlice.reducer;
