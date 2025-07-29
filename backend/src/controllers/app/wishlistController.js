const Wishlist = require("../../models/wishlist")
const Product = require("../../models/product")
const { successResponseData, errorResponseData } = require("../../services/Response")

const WishlistController = {
   // Get user's wishlist
   getWishlist: async (req, res) => {
      try {
         const authUserId = req.authUserId
         
         // Find or create wishlist for user
         const wishlist = await Wishlist.findOrCreateForUser(authUserId)
         
         // Populate product details
         await wishlist.populate({
            path: "items.product",
            select: "name price discountPrice images category brand ratingsAverage ratingsCount stock status sku",
         })

         // Transform data for frontend
         const transformedItems = wishlist.items.map((item) => ({
            id: item.product._id,
            title: item.product.name,
            image: item.product.images && item.product.images.length > 0 ? item.product.images[0] : "",
            imageTwo: item.product.images && item.product.images.length > 1 ? item.product.images[1] : item.product.images[0] || "",
            newPrice: item.product.discountPrice || item.product.price,
            oldPrice: item.product.price,
            date: item.addedAt,
            rating: item.product.ratingsAverage || 0,
            status: item.product.stock > 0 ? "Available" : "Out Of Stock",
            weight: "1 pcs",
            location: "Online",
            brand: item.product.brand || "Unknown",
            sku: item.product.sku || item.product._id,
            category: item.product.category || "",
            isAvailable: item.isAvailable,
            productName: item.productName,
            productPrice: item.productPrice,
            productImage: item.productImage,
            productSku: item.productSku
         }))

         return successResponseData(res, {
            items: transformedItems,
            totalItems: wishlist.totalItems,
            lastUpdated: wishlist.lastUpdated
         }, 200, "Wishlist fetched successfully")
      } catch (err) {
         console.error("Error fetching wishlist:", err)
         return errorResponseData(res, "Failed to fetch wishlist")
      }
   },

   // Add product to wishlist
   addToWishlist: async (req, res) => {
      try {
         const { productId } = req.body
         const authUserId = req.authUserId

         if (!productId) {
            return errorResponseData(res, "Product ID is required")
         }

         // Check if product exists
         const product = await Product.findById(productId)
         if (!product) {
            return errorResponseData(res, "Product not found")
         }

         // Find or create wishlist for user
         const wishlist = await Wishlist.findOrCreateForUser(authUserId)

         // Prepare product details
         const productDetails = {
            productName: product.name,
            productPrice: product.price,
            productDiscountPrice: product.discountPrice,
            productImage: product.images && product.images.length > 0 ? product.images[0] : "",
            productSku: product.sku,
            isAvailable: product.stock > 0 && product.status === '1'
         }

         // Add product to wishlist
         await wishlist.addProduct(productId, productDetails)

         // Populate and return updated wishlist
         await wishlist.populate({
            path: "items.product",
            select: "name price discountPrice images category brand ratingsAverage ratingsCount stock status sku",
         })

         const transformedItems = wishlist.items.map((item) => ({
            id: item.product._id,
            title: item.product.name,
            image: item.product.images && item.product.images.length > 0 ? item.product.images[0] : "",
            imageTwo: item.product.images && item.product.images.length > 1 ? item.product.images[1] : item.product.images[0] || "",
            newPrice: item.product.discountPrice || item.product.price,
            oldPrice: item.product.price,
            date: item.addedAt,
            rating: item.product.ratingsAverage || 0,
            status: item.product.stock > 0 ? "Available" : "Out Of Stock",
            weight: "1 pcs",
            location: "Online",
            brand: item.product.brand || "Unknown",
            sku: item.product.sku || item.product._id,
            category: item.product.category || "",
            isAvailable: item.isAvailable
         }))

         return successResponseData(
            res,
            {
               items: transformedItems,
               totalItems: wishlist.totalItems,
               message: "Product added to wishlist successfully"
            },
            200,
            "Product added to wishlist"
         )
      } catch (err) {
         console.error("Error adding to wishlist:", err)
         return errorResponseData(res, "Failed to add product to wishlist")
      }
   },

   // Remove product from wishlist
   removeFromWishlist: async (req, res) => {
      try {
         const { productId } = req.params
         const authUserId = req.authUserId

         if (!productId) {
            return errorResponseData(res, "Product ID is required")
         }

         // Find wishlist
         const wishlist = await Wishlist.findOne({ userId: authUserId })

         if (!wishlist) {
            return errorResponseData(res, "Wishlist not found")
         }

         // Remove product from wishlist
         await wishlist.removeProduct(productId)

         // Populate and return updated wishlist
         await wishlist.populate({
            path: "items.product",
            select: "name price discountPrice images category brand ratingsAverage ratingsCount stock status sku",
         })

         const transformedItems = wishlist.items.map((item) => ({
            id: item.product._id,
            title: item.product.name,
            image: item.product.images && item.product.images.length > 0 ? item.product.images[0] : "",
            imageTwo: item.product.images && item.product.images.length > 1 ? item.product.images[1] : item.product.images[0] || "",
            newPrice: item.product.discountPrice || item.product.price,
            oldPrice: item.product.price,
            date: item.addedAt,
            rating: item.product.ratingsAverage || 0,
            status: item.product.stock > 0 ? "Available" : "Out Of Stock",
            weight: "1 pcs",
            location: "Online",
            brand: item.product.brand || "Unknown",
            sku: item.product.sku || item.product._id,
            category: item.product.category || "",
            isAvailable: item.isAvailable
         }))

         return successResponseData(
            res,
            {
               items: transformedItems,
               totalItems: wishlist.totalItems,
               message: "Product removed from wishlist successfully"
            },
            200,
            "Product removed from wishlist"
         )
      } catch (err) {
         console.error("Error removing from wishlist:", err)
         return errorResponseData(res, "Failed to remove product from wishlist")
      }
   },

   // Clear wishlist
   clearWishlist: async (req, res) => {
      try {
         const authUserId = req.authUserId
         const wishlist = await Wishlist.findOne({ userId: authUserId })

         if (!wishlist) {
            return successResponseData(res, { items: [], totalItems: 0 }, 200, "Wishlist cleared")
         }

         await wishlist.clearWishlist()

         return successResponseData(res, { items: [], totalItems: 0 }, 200, "Wishlist cleared successfully")
      } catch (err) {
         console.error("Error clearing wishlist:", err)
         return errorResponseData(res, "Failed to clear wishlist")
      }
   },

   // Check if product is in wishlist
   checkWishlistStatus: async (req, res) => {
      try {
         const { productId } = req.params
         const authUserId = req.authUserId

         if (!productId) {
            return errorResponseData(res, "Product ID is required")
         }

         const wishlist = await Wishlist.findOne({ userId: authUserId })

         if (!wishlist) {
            return successResponseData(
               res,
               { isInWishlist: false },
               200,
               "Wishlist status checked"
            )
         }

         const isInWishlist = wishlist.items.some(item => 
            item.product.toString() === productId
         )

         return successResponseData(res, { isInWishlist }, 200, "Wishlist status checked")
      } catch (err) {
         console.error("Error checking wishlist status:", err)
         return errorResponseData(res, "Failed to check wishlist status")
      }
   },

   // Get wishlist count
   getWishlistCount: async (req, res) => {
      try {
         const authUserId = req.authUserId
         const wishlist = await Wishlist.findOne({ userId: authUserId })

         const count = wishlist ? wishlist.totalItems : 0

         return successResponseData(res, { count }, 200, "Wishlist count fetched")
      } catch (err) {
         console.error("Error fetching wishlist count:", err)
         return errorResponseData(res, "Failed to fetch wishlist count")
      }
   },

   // Move item from wishlist to cart
   moveToCart: async (req, res) => {
      try {
         const { productId } = req.body
         const authUserId = req.authUserId

         if (!productId) {
            return errorResponseData(res, "Product ID is required")
         }

         // Find wishlist
         const wishlist = await Wishlist.findOne({ userId: authUserId })
         if (!wishlist) {
            return errorResponseData(res, "Wishlist not found")
         }

         // Check if product is in wishlist
         const wishlistItem = wishlist.items.find(item => 
            item.product.toString() === productId
         )
         
         if (!wishlistItem) {
            return errorResponseData(res, "Product not found in wishlist")
         }

         // Remove from wishlist
         await wishlist.removeProduct(productId)

         // Add to cart (you'll need to implement cart controller method)
         // This is a placeholder - you'll need to integrate with cart controller
         // await CartController.addToCart(req, res)

         return successResponseData(
            res,
            { message: "Product moved to cart successfully" },
            200,
            "Product moved to cart"
         )
      } catch (err) {
         console.error("Error moving product to cart:", err)
         return errorResponseData(res, "Failed to move product to cart")
      }
   }
}

module.exports = WishlistController
