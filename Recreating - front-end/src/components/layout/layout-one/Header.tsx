"use client";
import HeaderManu from "./header/HeaderManu";
import HeaderOne from "./header/HeaderOne";
import HeaderTwo from "./header/HeaderTwo";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useEffect, useState } from "react";
import { fetchUserData } from "@/store/actions/userDataActions";
import { useAppDispatch } from "@/store/hooks";

// import FeatureTools from "@/theme/ThemeSwitcher";

function Header() {
  const dispatch = useAppDispatch();
  const wishlist  = useSelector((state: RootState) => state.wishlist);
  const cartItems = useSelector((state: RootState) => state.cart.items);

  // Use the new Redux-based wishlist hook

  const [forceUpdate, setForceUpdate] = useState(0);

  // Get cart items from Redux

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
      <header className="gi-header" key={forceUpdate}>
        <HeaderOne
          key={`header-one-${forceUpdate}`}
          wishlistItems={wishlist}
          cartItems={cartItems}
          cartCount={cartItems.length}
          wishlistCount={0}
        />
        <HeaderTwo
          key={`header-two-${forceUpdate}`}
          cartItems={cartItems}
          wishlistItems={wishlist}
          cartCount={0}
          wishlistCount={0}
          isAuthenticated={isAuthenticated}
        />
      </header>
    </>
  );
}

export default Header;
