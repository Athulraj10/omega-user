import { useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store"
import {
   addToWishlistRequest,
   removeFromWishlistRequest,
   fetchWishlistRequest,
} from "@/store/actions"
import { useAuth } from "@/components/auth/AuthProvider"

export const useWishlist = () => {
   const dispatch = useDispatch()
   const { isAuthenticated } = useAuth()

   const wishlistState = useSelector((state: RootState) => state.wishlist)
   const wishlist = wishlistState?.wishlist || []
   const loading = wishlistState?.loading || false
   const error = wishlistState?.error || null

   const fetchWishlist = useCallback(() => {
      if (isAuthenticated) {
         dispatch(fetchWishlistRequest())
      }
   }, [dispatch, isAuthenticated])

   const addToWishlist = useCallback(
      (productId: string) => {
         if (!isAuthenticated) {
            alert("Please login to add items to wishlist")
            return
         }
         dispatch(addToWishlistRequest({ productId }))
      },
      [dispatch, isAuthenticated]
   )

   const removeFromWishlist = useCallback(
      (productId: string) => {
         if (!isAuthenticated) {
            alert("Please login to manage wishlist")
            return
         }
         const numericId =
            parseInt(productId.replace(/[^0-9]/g, "")) ||
            Math.floor(Math.random() * 10000)
         dispatch(removeFromWishlistRequest(numericId))
      },
      [dispatch, isAuthenticated]
   )

   const isInWishlist = useCallback(
      (productId: string) => {
         return wishlist.some((item) => item._id === productId)
      },
      [wishlist]
   )

   const toggleWishlist = useCallback(
      (productId: string) => {
         if (isInWishlist(productId)) {
            removeFromWishlist(productId)
         } else {
            addToWishlist(productId)
         }
      },
      [isInWishlist, removeFromWishlist, addToWishlist]
   )

   return {
      wishlist,
      loading,
      error,
      fetchWishlist,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      toggleWishlist,
      isAuthenticated,
   }
}
