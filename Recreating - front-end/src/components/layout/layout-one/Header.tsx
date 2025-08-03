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
  const wishlist  = useSelector((state: RootState) => state.wishlist.items);
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const [forceUpdate, setForceUpdate] = useState(0);

  const isAuthenticated = useSelector(
    (state: RootState) => state.registration.isAuthenticated
  );




  return (
    <>
      <header className="gi-header" key={forceUpdate}>
        {/* <FeatureTools /> */}
        <HeaderOne
          key={`header-one-${forceUpdate}`}
          wishlistItems={wishlist}
          cartItems={cartItems}
          cartCount={cartItems.length}
          wishlistCount={wishlist.length}
        />
        <HeaderTwo
          key={`header-two-${forceUpdate}`}
          cartItems={cartItems}
          wishlistItems={wishlist}
          cartCount={cartItems.length}
          wishlistCount={wishlist.length}
          isAuthenticated={isAuthenticated}
        />
      </header>
    </>
  );
}

export default Header;
