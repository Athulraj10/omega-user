import { AppDispatch } from "@/store";
import { fetchWithAuth } from "@/lib/auth";
import { setCartItems } from "../reducers/cartSlice";
import { setUserData } from "../reducers/registrationSlice";
import { setWishlistItems } from "../reducers/wishlistSlice";
import { setAddresses } from "../reducers/addressSlice";



export const fetchUserData = (token: string) => async (dispatch: AppDispatch) => {
    try {
        const [cart, wishlist, userData] = await Promise.all([
            fetchWithAuth('/api/cart', token),
            fetchWithAuth('/api/wishlist', token),
            fetchWithAuth('/api/users/user-profile', token),
        ]);
        console.log({ cart, wishlist, userData });

        if (cart?.data) {
            dispatch(setCartItems(cart.data));
        }

        if (wishlist?.data) {
            dispatch(setWishlistItems(wishlist.data.items));
        }

        if (userData?.data) {
            dispatch(setUserData(userData.data));
        }
    } catch (err) {
        console.error("Failed to fetch user data:", err);
    }
};

export const fetchAddressesData = (token: string) => async (dispatch: AppDispatch) => {
    try {
        const response = await fetchWithAuth('/api/addresses', token);
        if (response?.data) {
            dispatch(setAddresses(response.data));
        }
    } catch (err) {
        console.error("Failed to fetch addresses:", err);
    }
};
