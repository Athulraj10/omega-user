import { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

interface CartItem {
  id: string;
  title: string;
  image: string;
  newPrice: number;
  oldPrice: number;
  quantity: number;
  weight: string;
  unitPrice: number;
  totalPrice: number;
  isAvailable: boolean;
  stockAvailable: number;
  selectedOptions?: any;
}

interface CartData {
  items: CartItem[];
  subtotal: number;
  totalItems: number;
  finalTotal: number;
  appliedCoupon: {
    code?: string;
    discountAmount: number;
    discountType: string;
  };
  lastUpdated: string;
}

interface WishlistItem {
  id: string;
  title: string;
  image: string;
  newPrice: number;
  oldPrice: number;
  status: string;
  rating: number;
  brand: string;
  category: string;
  sku: string;
  weight: string;
  location: string;
  date: string;
  quantity: number;
}

interface WishlistData {
  items: WishlistItem[];
  totalItems: number;
  lastUpdated: string;
}

interface UseCartWishlistReturn {
  // Cart functionality
  addToCart: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateCartQuantity: (productId: string, quantity: number) => Promise<void>;
  getCartCount: () => Promise<number>;
  getCartData: () => Promise<CartData | null>;
  cartLoading: boolean;
  cartData: CartData | null;
  isInCart: (productId: string) => boolean;
  getCartItemQuantity: (productId: string) => number;
  
  // Wishlist functionality
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  checkWishlistStatus: (productId: string) => Promise<boolean>;
  isInWishlist: (productId: string) => boolean;
  wishlistLoading: boolean;
  wishlistData: WishlistData | null;
  getWishlistData: () => Promise<WishlistData | null>;
  refreshWishlist: () => Promise<void>;
  
  // Utility functions
  isAuthenticated: boolean;
  userToken: string | null;
  refreshCart: () => Promise<void>;
  updateTrigger: number; // Add this to force re-renders
}

export const useCartWishlist = (): UseCartWishlistReturn => {
  const authUser = useSelector((state: any) => state.registration.isAuthenticated);
  const userToken = useSelector((state: any) => state.registration.token);
  
  const [cartLoading, setCartLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistItems, setWishlistItems] = useState<Set<string>>(new Set());
  const [cartData, setCartData] = useState<CartData | null>(null);
  const [wishlistData, setWishlistData] = useState<WishlistData | null>(null);
  const [updateTrigger, setUpdateTrigger] = useState(0); // Force re-renders

  // Cache for wishlist status checks to prevent infinite calls
  const wishlistStatusCache = useRef<Map<string, { status: boolean; timestamp: number }>>(new Map());
  const checkingStatus = useRef<Set<string>>(new Set());

  // Function to force re-render
  const triggerUpdate = useCallback(() => {
    setUpdateTrigger(prev => prev + 1);
  }, []);

  // Cart Functions
  const getCartData = useCallback(async (): Promise<CartData | null> => {
    if (!authUser) return null;

    try {
      console.log("Fetching cart data...");
      const response = await fetch('/api/cart', {
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      });

      const result = await response.json();
      console.log("Cart API response:", result);
      
      if (response.ok) {
        // Backend wraps data in a 'data' property
        const cartData = result.data;
        console.log("Processed cart data:", cartData);
        return cartData;
      }
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
    
    return null;
  }, [authUser, userToken]);

  const refreshCart = useCallback(async (): Promise<void> => {
    console.log("Refreshing cart...");
    const data = await getCartData();
    console.log("Cart data received:", data);
    
    // Add a small delay to ensure state updates properly
    await new Promise(resolve => setTimeout(resolve, 50));
    
    setCartData(data);
    triggerUpdate(); // Force re-render after refresh
    console.log("Cart refresh completed");
  }, [getCartData, triggerUpdate]);

  // Wishlist Functions
  const getWishlistData = useCallback(async (): Promise<WishlistData | null> => {
    if (!authUser) {
      console.log("getWishlistData: User not authenticated");
      return null;
    }

    try {
      console.log("Fetching wishlist data...");
      console.log("User token:", userToken);
      
      const response = await fetch('/api/wishlist', {
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      });

      console.log("Wishlist API response status:", response.status);
      console.log("Wishlist API response headers:", response.headers);

      const result = await response.json();
      console.log("Wishlist API response:", result);
      
      if (response.ok) {
        // Backend wraps data in a 'data' property
        const wishlistData = result.data;
        console.log("Processed wishlist data:", wishlistData);
        console.log("Wishlist items count:", wishlistData?.items?.length);
        console.log("Wishlist total items:", wishlistData?.totalItems);
        return wishlistData;
      } else {
        console.error("Wishlist API error:", result);
      }
    } catch (error) {
      console.error("Error fetching wishlist data:", error);
    }
    
    return null;
  }, [authUser, userToken]);

  const refreshWishlist = useCallback(async (): Promise<void> => {
    console.log("Refreshing wishlist...");
    const data = await getWishlistData();
    console.log("Wishlist data received:", data);
    
    // Add a small delay to ensure state updates properly
    await new Promise(resolve => setTimeout(resolve, 50));
    
    setWishlistData(data);
    
    // Update wishlist items set for status checking
    if (data?.items) {
      const itemIds = new Set(data.items.map(item => item.id));
      console.log("Setting wishlist items:", itemIds);
      setWishlistItems(itemIds);
    } else {
      console.log("No wishlist items found, clearing set");
      setWishlistItems(new Set());
    }
    
    triggerUpdate(); // Force re-render after refresh
    console.log("Wishlist refresh completed");
  }, [getWishlistData, triggerUpdate]);

  const addToCart = useCallback(async (productId: string, quantity: number): Promise<void> => {
    if (!authUser) {
      toast.error("Please login to add items to cart");
      return;
    }

    setCartLoading(true);
    try {
      console.log("Adding product to cart:", productId, quantity);
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({ productId, quantity })
      });

      const result = await response.json();
      console.log("Add to cart response:", result);
      
             if (response.ok) {
         // Immediately update cart data for instant count update
         const currentData = cartData;
         if (currentData) {
           // Create a temporary updated data structure
           const updatedData = {
             ...currentData,
             items: [...(currentData.items || []), { id: productId, quantity } as any], // Add placeholder item
             totalItems: (currentData.totalItems || 0) + quantity
           };
           setCartData(updatedData);
           triggerUpdate(); // Force immediate re-render
         }
         
         toast.success("Product added to cart successfully!");
         // Force a small delay to ensure backend has processed the request
         await new Promise(resolve => setTimeout(resolve, 100));
         await refreshCart();
       } else {
        toast.error(result.message || "Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    } finally {
      setCartLoading(false);
    }
  }, [authUser, userToken, refreshCart, triggerUpdate]);

  const removeFromCart = useCallback(async (productId: string): Promise<void> => {
    if (!authUser) return;

    setCartLoading(true);
    try {
      console.log("Removing product from cart:", productId);
      const response = await fetch(`/api/cart/remove/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      });

      const result = await response.json();
      console.log("Remove from cart response:", result);
      
             if (response.ok) {
         // Immediately update cart data for instant count update
         const currentData = cartData;
         if (currentData) {
           const itemToRemove = currentData.items?.find(item => item.id === productId);
           const itemQuantity = itemToRemove?.quantity || 0;
           
           // Create a temporary updated data structure
           const updatedData = {
             ...currentData,
             items: (currentData.items || []).filter(item => item.id !== productId),
             totalItems: Math.max(0, (currentData.totalItems || 0) - itemQuantity)
           };
           setCartData(updatedData);
           triggerUpdate(); // Force immediate re-render
         }
         
         toast.success("Product removed from cart!");
         // Force a small delay to ensure backend has processed the request
         await new Promise(resolve => setTimeout(resolve, 100));
         await refreshCart();
       } else {
        toast.error(result.message || "Failed to remove from cart");
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast.error("Failed to remove from cart");
    } finally {
      setCartLoading(false);
    }
  }, [authUser, userToken, refreshCart, triggerUpdate]);

  const updateCartQuantity = useCallback(async (productId: string, quantity: number): Promise<void> => {
    if (!authUser) return;

    setCartLoading(true);
    try {
      console.log("Updating cart quantity:", productId, quantity);
      const response = await fetch(`/api/cart/update/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({ quantity })
      });

      const result = await response.json();
      console.log("Update cart response:", result);
      
      if (response.ok) {
        toast.success("Cart updated successfully!");
        // Force a small delay to ensure backend has processed the request
        await new Promise(resolve => setTimeout(resolve, 100));
        await refreshCart();
      } else {
        toast.error(result.message || "Failed to update cart");
      }
    } catch (error) {
      console.error("Error updating cart:", error);
      toast.error("Failed to update cart");
    } finally {
      setCartLoading(false);
    }
  }, [authUser, userToken, refreshCart, triggerUpdate]);

  const getCartCount = useCallback(async (): Promise<number> => {
    if (!authUser) return 0;

    try {
      const response = await fetch('/api/cart/count', {
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      });

      const result = await response.json();
      
      if (response.ok) {
        return result.data?.count || 0;
      }
    } catch (error) {
      console.error("Error getting cart count:", error);
    }
    
    return 0;
  }, [authUser, userToken]);

  // Wishlist Functions
  const addToWishlist = useCallback(async (productId: string): Promise<void> => {
    if (!authUser) {
      toast.error("Please login to add items to wishlist");
      return;
    }

    setWishlistLoading(true);
    try {
      console.log("Adding product to wishlist:", productId);
      const response = await fetch('/api/wishlist/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({ productId })
      });

      const result = await response.json();
      console.log("Add to wishlist response:", result);
      
             if (response.ok) {
         // Immediately update local state for instant UI feedback
         setWishlistItems(prev => new Set([...prev, productId]));
         // Update cache
         wishlistStatusCache.current.set(productId, { status: true, timestamp: Date.now() });
         
         // Immediately update wishlist data for instant count update
         const currentData = wishlistData;
         if (currentData) {
           // Create a temporary updated data structure
           const updatedData = {
             ...currentData,
             items: [...(currentData.items || []), { id: productId } as any], // Add placeholder item
             totalItems: (currentData.totalItems || 0) + 1
           };
           setWishlistData(updatedData);
           triggerUpdate(); // Force immediate re-render
         }
         
         // Force a small delay to ensure backend has processed the request
         await new Promise(resolve => setTimeout(resolve, 100));
         // Refresh wishlist data to get complete updated data
         await refreshWishlist();
         toast.success("Product added to wishlist!");
       } else {
        toast.error(result.message || "Failed to add to wishlist");
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error("Failed to add to wishlist");
    } finally {
      setWishlistLoading(false);
    }
  }, [authUser, userToken, refreshWishlist, triggerUpdate]);

  const removeFromWishlist = useCallback(async (productId: string): Promise<void> => {
    if (!authUser) return;

    setWishlistLoading(true);
    try {
      console.log("Removing product from wishlist:", productId);
      const response = await fetch(`/api/wishlist/remove/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      });

      const result = await response.json();
      console.log("Remove from wishlist response:", result);
      
             if (response.ok) {
         // Immediately update local state for instant UI feedback
         setWishlistItems(prev => {
           const newSet = new Set(prev);
           newSet.delete(productId);
           return newSet;
         });
         // Update cache
         wishlistStatusCache.current.set(productId, { status: false, timestamp: Date.now() });
         
         // Immediately update wishlist data for instant count update
         const currentData = wishlistData;
         if (currentData) {
           // Create a temporary updated data structure
           const updatedData = {
             ...currentData,
             items: (currentData.items || []).filter(item => item.id !== productId),
             totalItems: Math.max(0, (currentData.totalItems || 0) - 1)
           };
           setWishlistData(updatedData);
           triggerUpdate(); // Force immediate re-render
         }
         
         // Force a small delay to ensure backend has processed the request
         await new Promise(resolve => setTimeout(resolve, 100));
         // Refresh wishlist data to get complete updated data
         await refreshWishlist();
         toast.success("Product removed from wishlist!");
       } else {
        toast.error(result.message || "Failed to remove from wishlist");
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error("Failed to remove from wishlist");
    } finally {
      setWishlistLoading(false);
    }
  }, [authUser, userToken, refreshWishlist, triggerUpdate]);

  const checkWishlistStatus = useCallback(async (productId: string): Promise<boolean> => {
    if (!authUser) return false;

    // Check cache first (cache for 5 minutes)
    const cached = wishlistStatusCache.current.get(productId);
    if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
      return cached.status;
    }

    // Prevent duplicate calls for the same product
    if (checkingStatus.current.has(productId)) {
      return wishlistItems.has(productId);
    }

    checkingStatus.current.add(productId);

    try {
      const response = await fetch(`/api/wishlist/check/${productId}`, {
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      });

      const result = await response.json();
      
      if (response.ok) {
        const isInWishlist = result.data?.isInWishlist || false;
        
        // Update cache
        wishlistStatusCache.current.set(productId, { status: isInWishlist, timestamp: Date.now() });
        
        setWishlistItems(prev => {
          const newSet = new Set(prev);
          if (isInWishlist) {
            newSet.add(productId);
          } else {
            newSet.delete(productId);
          }
          return newSet;
        });
        
        return isInWishlist;
      }
    } catch (error) {
      console.error("Error checking wishlist status:", error);
    } finally {
      checkingStatus.current.delete(productId);
    }
    
    return false;
  }, [authUser, userToken, wishlistItems]);

  const isInWishlist = useCallback((productId: string): boolean => {
    return wishlistItems.has(productId);
  }, [wishlistItems]);

  // Cart status functions
  const isInCart = useCallback((productId: string): boolean => {
    const result = cartData?.items?.some(item => {
      const match = item.id === productId || item.id === String(productId) || String(item.id) === productId;
      return match;
    }) || false;
    return result;
  }, [cartData]);

  const getCartItemQuantity = useCallback((productId: string): number => {
    const cartItem = cartData?.items?.find(item => {
      const match = item.id === productId || item.id === String(productId) || String(item.id) === productId;
      return match;
    });
    const quantity = cartItem?.quantity || 0;
    return quantity;
  }, [cartData]);

  // Fetch cart and wishlist data on mount and when authentication changes
  useEffect(() => {
    console.log("useCartWishlist useEffect triggered - authUser:", authUser);
    if (authUser) {
      console.log("Fetching cart and wishlist data for authenticated user");
      refreshCart();
      refreshWishlist();
    } else {
      console.log("Clearing cart and wishlist data for unauthenticated user");
      setCartData(null);
      setWishlistData(null);
      setWishlistItems(new Set());
      wishlistStatusCache.current.clear();
    }
  }, [authUser, refreshCart, refreshWishlist]);

  return {
    // Cart functionality
    addToCart,
    removeFromCart,
    updateCartQuantity,
    getCartCount,
    getCartData,
    cartLoading,
    cartData,
    isInCart,
    getCartItemQuantity,
    refreshCart,
    
    // Wishlist functionality
    addToWishlist,
    removeFromWishlist,
    checkWishlistStatus,
    isInWishlist,
    wishlistLoading,
    wishlistData,
    getWishlistData,
    refreshWishlist,
    
    // Utility functions
    isAuthenticated: authUser,
    userToken,
    updateTrigger
  };
}; 