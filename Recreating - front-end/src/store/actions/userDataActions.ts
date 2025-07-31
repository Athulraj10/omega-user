import { AppDispatch } from "@/store";
import { fetchWithAuth } from "@/lib/auth";
import { setCartItems } from "../reducers/cartSlice";
import { setUserData } from "../reducers/registrationSlice";
import { setWishlistItems } from "../reducers/wishlistSlice";

export const fetchUserData = (token: string) => async (dispatch: AppDispatch) => {
    try {
        const [cart, wishlist, userData] = await Promise.all([
            fetchWithAuth('/api/cart', token),
            fetchWithAuth('/api/wishlist', token),
            fetchWithAuth('/api/users/user-profile', token),
        ]);

        if (cart && cart?.data) {
            dispatch(setCartItems(cart.data));
        }
        
        if (wishlist && wishlist?.data) {
            dispatch(setWishlistItems(wishlist.data.items));
        }
        
        if (userData && userData?.data) {
            dispatch(setUserData(userData.data));
        }
    } catch (err) {
        console.error("Failed to fetch user data:", err);
    }
};
