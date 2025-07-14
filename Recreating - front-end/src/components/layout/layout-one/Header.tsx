"use client";
import HeaderManu from "./header/HeaderManu";
import HeaderOne from "./header/HeaderOne";
import HeaderTwo from "./header/HeaderTwo";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useEffect } from "react";
import { fetchUserData } from "@/store/actions/userDataActions";
import { useAppDispatch } from "@/store/hooks";
// import FeatureTools from "@/theme/ThemeSwitcher";

function Header() {
  const dispatch = useAppDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const wishlistItems = useSelector(
    (state: RootState) => state.wishlist.wishlist
  );

  const isAuthenticated = useSelector(
    (state: RootState) => state.registration.isAuthenticated
  );

  useEffect(() => {
    if (isAuthenticated) {
      const token = JSON.parse(localStorage.getItem('token') || '');
      dispatch(fetchUserData(token));
    }
  }, [isAuthenticated, dispatch]);

  return (
    <>
      <header className="gi-header">
        {/* <FeatureTools /> */}
        <HeaderOne wishlistItems={wishlistItems} cartItems={cartItems} />
        <HeaderTwo cartItems={cartItems} wishlistItems={wishlistItems} isAuthenticated={isAuthenticated} />
        <HeaderManu />
      </header>
    </>
  );
}

export default Header;
