import { createSlice } from "@reduxjs/toolkit";
import { Address, User, Wallet } from "@/types";

interface RegistrationState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  address: Address | null;
  wallet: Wallet | null;
}

const initialState: RegistrationState = {
  isAuthenticated: false,
  token: null,
  user: null,
  address: null,
  wallet: null,
};

const registrationSlice = createSlice({
  name: "registration",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload.meta.token;
      state.user = action.payload.data;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
    setUserData: (state, action) => {
      if (action.payload) {
        state.address = action.payload.address || null;
        state.wallet = action.payload.wallet || null;
        state.user = action.payload.user || null;
        state.isAuthenticated = action.payload.user ? true : false;
        state.token = action.payload.token ?? state.token;
      }
    },
  },
});


export const { logout, login, setUserData } = registrationSlice.actions;
export default registrationSlice.reducer;
