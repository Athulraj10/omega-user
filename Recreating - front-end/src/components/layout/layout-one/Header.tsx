"use client";
import HeaderManu from "./header/HeaderManu";
import HeaderOne from "./header/HeaderOne";
import HeaderTwo from "./header/HeaderTwo";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useEffect, useState } from "react";
import { fetchUserData } from "@/store/actions/userDataActions";
import { useAppDispatch } from "@/store/hooks";
import { useCartWishlist } from "@/hooks/useCartWishlist";

// import FeatureTools from "@/theme/ThemeSwitcher";

function Header() {
  const dispatch = useAppDispatch();
  const { cartData, wishlistData, refreshWishlist, refreshCart, updateTrigger } = useCartWishlist();
  const [forceUpdate, setForceUpdate] = useState(0);
  
  // Fallback to Redux state if backend data is not available
  const reduxCartItems = useSelector((state: RootState) => state.cart.items);
  const reduxWishlistItems = useSelector(
    (state: RootState) => state.wishlist.wishlist
  );

  const isAuthenticated = useSelector(
    (state: RootState) => state.registration.isAuthenticated
  );

  // Use backend data if available, otherwise fallback to Redux
  const cartItems = cartData?.items || reduxCartItems || [];
  const wishlistItems = wishlistData?.items || reduxWishlistItems || [];
  
  // Ensure we have the most accurate count - use the actual data from the hook
  const cartCount = cartData?.totalItems || cartItems.length;
  const wishlistCount = wishlistData?.totalItems || wishlistItems.length;
  
  // Use the actual items but ensure the count is correct
  const cartItemsForDisplay = cartItems;
  const wishlistItemsForDisplay = wishlistItems;
  
  // Force re-render when updateTrigger changes
  const key = updateTrigger; // This will force re-render when updateTrigger changes

  // Debug logging
  console.log("Header - cartData:", cartData);
  console.log("Header - cartItems:", cartItems);
  console.log("Header - cartItems.length:", cartItems.length);
  console.log("Header - wishlistData:", wishlistData);
  console.log("Header - wishlistItems:", wishlistItems);
  console.log("Header - wishlistItems.length:", wishlistItems.length);
  console.log("Header - isAuthenticated:", isAuthenticated);
  console.log("Header - wishlistData?.items?.length:", wishlistData?.items?.length);
  console.log("Header - wishlistData?.totalItems:", wishlistData?.totalItems);
  console.log("Header - cartCount:", cartCount);
  console.log("Header - wishlistCount:", wishlistCount);
  console.log("Header - updateTrigger:", updateTrigger);
  console.log("Header - forceUpdate:", forceUpdate);
  console.log("Header - cartItemsForDisplay.length:", cartItemsForDisplay.length);
  console.log("Header - wishlistItemsForDisplay.length:", wishlistItemsForDisplay.length);

  useEffect(() => {
    if (isAuthenticated) {
      const token = JSON.parse(localStorage.getItem('token') || '');
      dispatch(fetchUserData(token));
    }
  }, [isAuthenticated, dispatch]);

  // Force re-render when wishlist or cart data changes
  useEffect(() => {
    console.log("Header - Wishlist data changed:", wishlistData);
    console.log("Header - Cart data changed:", cartData);
    console.log("Header - New wishlist count:", wishlistData?.items?.length || 0);
    console.log("Header - New cart count:", cartData?.items?.length || 0);
    // Force re-render when data changes
    setForceUpdate(prev => prev + 1);
  }, [wishlistData, cartData]);

  // Force re-render when updateTrigger changes
  useEffect(() => {
    console.log("Header - Update trigger changed:", updateTrigger);
    setForceUpdate(prev => prev + 1);
  }, [updateTrigger]);

  // Track count changes
  useEffect(() => {
    console.log("Header - Counts updated - Cart:", cartCount, "Wishlist:", wishlistCount);
  }, [cartCount, wishlistCount]);



  return (
    <>
      <header className="gi-header" key={key}>
        {/* <FeatureTools /> */}
        <HeaderOne 
          key={`header-one-${key}`} 
          wishlistItems={wishlistItemsForDisplay} 
          cartItems={cartItemsForDisplay}
          cartCount={cartCount}
          wishlistCount={wishlistCount}
        />
        <HeaderTwo 
          key={`header-two-${key}`} 
          cartItems={cartItemsForDisplay} 
          wishlistItems={wishlistItemsForDisplay} 
          cartCount={cartCount}
          wishlistCount={wishlistCount}
          isAuthenticated={isAuthenticated} 
        />
        <HeaderManu />
      </header>
      {/* DebugWishlistCount removed */}
    </>
  );
}

export default Header;
