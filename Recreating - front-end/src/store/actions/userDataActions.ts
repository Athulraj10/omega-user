import { AppDispatch } from "@/store";
import { fetchWithAuth } from "@/lib/auth";
import { setWishlist } from "../reducers/wishlistSlice";
import { setCartItems } from "../reducers/cartSlice";
import { setUserData } from "../reducers/registrationSlice";
// Add more slices as needed

export const fetchUserData = (token: string) => async (dispatch: AppDispatch) => {
    try {
        const [cart, wishlist,userData] = await Promise.all([
            fetchWithAuth('/api/cart', token),
            fetchWithAuth('/api/wishlist', token),
            fetchWithAuth('/api/users/user-profile', token),
        ]);

        dispatch(setCartItems(cart.data));
        dispatch(setWishlist(wishlist.data));
        dispatch(setUserData(userData.data));
    } catch (err) {
        console.error("Failed to fetch user data:", err);
    }
};
