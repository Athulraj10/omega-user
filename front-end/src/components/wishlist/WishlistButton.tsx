"use client"

import React from "react"
import { useWishlist } from "@/hooks/useWishlist"

interface WishlistButtonProps {
   productId: string
   className?: string
   children?: React.ReactNode
}

const WishlistButton: React.FC<WishlistButtonProps> = ({
   productId,
   className = "gi-btn-1 gi-wishlist-btn",
   children,
}) => {
   const { isInWishlist, toggleWishlist, loading, isAuthenticated } = useWishlist()

   const handleClick = () => {
      if (!isAuthenticated) {
         alert("Please login to add items to wishlist")
         return
      }
      toggleWishlist(productId)
   }

   return (
      <button
         className={`${className} ${isInWishlist(productId) ? "active" : ""}`}
         onClick={handleClick}
         disabled={loading}
         title={isInWishlist(productId) ? "Remove from wishlist" : "Add to wishlist"}
      >
         {loading ? (
            <i className='fi-rr-spinner animate-spin'></i>
         ) : (
            children || (
               <i
                  className={`fi-rr-heart ${
                     isInWishlist(productId) ? "text-red-500" : ""
                  }`}
               ></i>
            )
         )}
      </button>
   )
}

export default WishlistButton
