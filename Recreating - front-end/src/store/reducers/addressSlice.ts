import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Address } from "@/types/address";

interface AddressState {
  addresses: Address[];
}

const initialState: AddressState = {
  addresses: [],
};

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    setAddresses: (state, action: PayloadAction<Address[]>) => {
      state.addresses = action.payload;
    },
    addAddress: (state, action: PayloadAction<Address>) => {
      state.addresses.push(action.payload);
    },
    updateAddress: (state, action: PayloadAction<Address>) => {
      const index = state.addresses.findIndex(
        (address) => address._id === action.payload._id
      );
      if (index !== -1) {
        state.addresses[index] = action.payload;
      }
    },
    removeAddress: (state, action: PayloadAction<string>) => {
      state.addresses = state.addresses.filter(
        (address) => address._id !== action.payload
      );
    },
    setDefaultAddress: (state, action: PayloadAction<string>) => {
      state.addresses = state.addresses.map((address) => ({
        ...address,
        isDefault: address._id === action.payload,
      }));
    },
    clearAddresses: (state) => {
      state.addresses = [];
    },
  },
});

export const {
  setAddresses,
  addAddress,
  updateAddress,
  removeAddress,
  setDefaultAddress,
  clearAddresses,
} = addressSlice.actions;

export const selectAddresses = (state: { address: AddressState }) =>
  state.address.addresses;

export default addressSlice.reducer; 