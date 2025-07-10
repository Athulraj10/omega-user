const Wishlist = require("../../models/wishlist")
const Product = require("../../models/product")
const { successResponseData, errorResponseData } = require("../../services/response")

const WishlistController = {
   // Get user's wishlist
   getWishlist: async (req, res) => {
      try {
         const wishlist = await Wishlist.findOne({ user: req.user._id }).populate({
            path: "products",
            select:
               "name price discountPrice images category brand ratingsAverage ratingsCount stock status",
         })

         if (!wishlist) {
            // Create empty wishlist if it doesn't exist
            const newWishlist = new Wishlist({
               user: req.user._id,
               products: [],
            })
            await newWishlist.save()
            return successResponseData(res, [], 200, "Wishlist fetched")
         }

         return successResponseData(res, wishlist.products, 200, "Wishlist fetched")
      } catch (err) {
         console.error("Error fetching wishlist:", err)
         return errorResponseData(res, "Failed to fetch wishlist")
      }
   },

   // Add product to wishlist
   addToWishlist: async (req, res) => {
      try {
         const { productId } = req.body

         if (!productId) {
            return errorResponseData(res, "Product ID is required")
         }

         // Check if product exists
         const product = await Product.findById(productId)
         if (!product) {
            return errorResponseData(res, "Product not found")
         }

         // Find or create wishlist
         let wishlist = await Wishlist.findOne({ user: req.user._id })

         if (!wishlist) {
            wishlist = new Wishlist({
               user: req.user._id,
               products: [],
            })
         }

         // Check if product is already in wishlist
         if (wishlist.products.includes(productId)) {
            return errorResponseData(res, "Product already in wishlist")
         }

         // Add product to wishlist
         wishlist.products.push(productId)
         await wishlist.save()

         // Populate and return updated wishlist
         await wishlist.populate({
            path: "products",
            select:
               "name price discountPrice images category brand ratingsAverage ratingsCount stock status",
         })

         return successResponseData(
            res,
            wishlist.products,
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

         if (!productId) {
            return errorResponseData(res, "Product ID is required")
         }

         // Find wishlist
         const wishlist = await Wishlist.findOne({ user: req.user._id })

         if (!wishlist) {
            return errorResponseData(res, "Wishlist not found")
         }

         // Check if product is in wishlist
         if (!wishlist.products.includes(productId)) {
            return errorResponseData(res, "Product not in wishlist")
         }

         // Remove product from wishlist
         wishlist.products = wishlist.products.filter((id) => id.toString() !== productId)
         await wishlist.save()

         // Populate and return updated wishlist
         await wishlist.populate({
            path: "products",
            select:
               "name price discountPrice images category brand ratingsAverage ratingsCount stock status",
         })

         return successResponseData(
            res,
            wishlist.products,
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
         const wishlist = await Wishlist.findOne({ user: req.user._id })

         if (!wishlist) {
            return successResponseData(res, [], 200, "Wishlist cleared")
         }

         wishlist.products = []
         await wishlist.save()

         return successResponseData(res, [], 200, "Wishlist cleared")
      } catch (err) {
         console.error("Error clearing wishlist:", err)
         return errorResponseData(res, "Failed to clear wishlist")
      }
   },

   // Check if product is in wishlist
   checkWishlistStatus: async (req, res) => {
      try {
         const { productId } = req.params

         if (!productId) {
            return errorResponseData(res, "Product ID is required")
         }

         const wishlist = await Wishlist.findOne({ user: req.user._id })

         if (!wishlist) {
            return successResponseData(
               res,
               { isInWishlist: false },
               200,
               "Wishlist status checked"
            )
         }

         const isInWishlist = wishlist.products.includes(productId)

         return successResponseData(res, { isInWishlist }, 200, "Wishlist status checked")
      } catch (err) {
         console.error("Error checking wishlist status:", err)
         return errorResponseData(res, "Failed to check wishlist status")
      }
   },
}

module.exports = WishlistController
