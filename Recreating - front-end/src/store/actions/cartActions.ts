import { createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch } from "@/store";
import { fetchWithAuth } from "@/lib/auth";
import { setCartItems, setCartLoading, setCartError } from "../reducers/cartSlice";

// Async thunk for updating cart item quantity
export const updateCartItemQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ productId, quantity }: { productId: string; quantity: number }, { dispatch }) => {
    try {
      dispatch(setCartLoading(true));
      
      const response = await fetchWithAuth(`/api/cart/update/${productId}`, undefined, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity }),
      });

      if (response && response.data) {
        // Update the cart items in the store with the new data
        const cartData = response.data;
        const items = cartData.items || cartData;
        dispatch(setCartItems(items));
        return cartData;
      }
      
      throw new Error("Failed to update cart item");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to update cart item";
      dispatch(setCartError(errorMessage));
      throw error;
    } finally {
      dispatch(setCartLoading(false));
    }
  }
);

// Async thunk for removing item from cart
export const removeCartItem = createAsyncThunk(
  "cart/removeItem",
  async (productId: string, { dispatch }) => {
    try {
      dispatch(setCartLoading(true));
      
      const response = await fetchWithAuth(`/api/cart/remove/${productId}`, undefined, {
        method: "DELETE",
      });

      if (response && response.data) {
        // Update the cart items in the store with the new data
        const cartData = response.data;
        const items = cartData.items || cartData;
        dispatch(setCartItems(items));
        return cartData;
      }
      
      throw new Error("Failed to remove cart item");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to remove cart item";
      dispatch(setCartError(errorMessage));
      throw error;
    } finally {
      dispatch(setCartLoading(false));
    }
  }
);

// Async thunk for fetching cart items
export const fetchCartItems = createAsyncThunk(
  "cart/fetchItems",
  async (_, { dispatch }) => {
    try {
      dispatch(setCartLoading(true));
      
      const response = await fetchWithAuth("/api/cart");
      
      if (response && response.data) {
        const cartData = response.data;
        const items = cartData.items || cartData;
        dispatch(setCartItems(items));
        return cartData;
      }
      
      throw new Error("Failed to fetch cart items");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch cart items";
      dispatch(setCartError(errorMessage));
      throw error;
    } finally {
      dispatch(setCartLoading(false));
    }
  }
); 