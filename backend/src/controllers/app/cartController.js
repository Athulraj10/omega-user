const Cart = require("../../models/cart")
const Product = require("../../models/product")
const { successResponseData } = require("../../services/Response")

const CartController = {
   // Get user's cart
   getCart: async (req, res) => {
      try {
         const authUserId = req.authUserId
         const cart = await Cart.findOne({ user: authUserId }).populate({
            path: "items.product",
            select:
               "name price discountPrice images category brand ratingsAverage ratingsCount stock status slug",
         })
         if (!cart) {
            return successResponseData(res, [], 200, "Cart fetched")
         }

         const transformedItems = cart.items.map((item) => ({
            id: item.product._id,
            title: item.product.name,
            image:
               item.product.images && item.product.images.length > 0
                  ? item.product.images[0]
                  : "",
            imageTwo:
               item.product.images && item.product.images.length > 1
                  ? item.product.images[1]
                  : item.product.images[0] || "",
            newPrice: item.product.discountPrice || item.product.price,
            oldPrice: item.product.price,
            date: item.product.createdAt,
            rating: item.product.ratingsAverage || 0,
            status: item.product.stock > 0 ? "Available" : "Out Of Stock",
            waight: "1 pcs",
            location: "Online",
            brand: item.product.brand || "Unknown",
            sku: item.product._id,
            category: item.product.category || "",
            quantity: item.quantity,
         }))

         return successResponseData(res, transformedItems, 200, "Cart fetched")
      } catch (err) {
         console.error("Error fetching cart:", err)
         return errorResponseData(res, "Failed to fetch cart")
      }
   },

   // Add item to cart
   addToCart: async (req, res) => {
      try {
         const { productId, quantity = 1 } = req.body

         if (!productId) {
            return errorResponseData(res, "Product ID is required")
         }

         // Check if product exists
         const product = await Product.findById(productId)
         if (!product) {
            return errorResponseData(res, "Product not found")
         }

         // Check stock availability
         if (product.stock < quantity) {
            return errorResponseData(res, "Insufficient stock")
         }

         // Find or create cart
         let cart = await Cart.findOne({ user: req.user._id })

         if (!cart) {
            cart = new Cart({
               user: req.user._id,
               items: [],
            })
         }

         // Check if product is already in cart
         const existingItemIndex = cart.items.findIndex(
            (item) => item.product.toString() === productId
         )

         if (existingItemIndex > -1) {
            // Update quantity if product already exists
            cart.items[existingItemIndex].quantity += quantity
         } else {
            // Add new item
            cart.items.push({
               product: productId,
               quantity: quantity,
            })
         }

         await cart.save()

         // Populate and return updated cart
         await cart.populate({
            path: "items.product",
            select:
               "name price discountPrice images category brand ratingsAverage ratingsCount stock status slug",
         })

         // Transform cart items to match frontend format
         const transformedItems = cart.items.map((item) => ({
            id: item.product._id,
            title: item.product.name,
            image:
               item.product.images && item.product.images.length > 0
                  ? item.product.images[0]
                  : "",
            imageTwo:
               item.product.images && item.product.images.length > 1
                  ? item.product.images[1]
                  : item.product.images[0] || "",
            newPrice: item.product.discountPrice || item.product.price,
            oldPrice: item.product.price,
            date: item.product.createdAt,
            rating: item.product.ratingsAverage || 0,
            status: item.product.stock > 0 ? "Available" : "Out Of Stock",
            waight: "1 pcs",
            location: "Online",
            brand: item.product.brand || "Unknown",
            sku: item.product._id,
            category: item.product.category || "",
            quantity: item.quantity,
         }))

         return successResponseData(res, transformedItems, 200, "Product added to cart")
      } catch (err) {
         console.error("Error adding to cart:", err)
         return errorResponseData(res, "Failed to add product to cart")
      }
   },

   // Update cart item quantity
   updateQuantity: async (req, res) => {
      try {
         const { productId } = req.params
         const { quantity } = req.body

         if (!productId) {
            return errorResponseData(res, "Product ID is required")
         }

         if (!quantity || quantity < 1) {
            return errorResponseData(res, "Valid quantity is required")
         }

         // Check if product exists and has sufficient stock
         const product = await Product.findById(productId)
         if (!product) {
            return errorResponseData(res, "Product not found")
         }

         if (product.stock < quantity) {
            return errorResponseData(res, "Insufficient stock")
         }

         // Find cart
         const cart = await Cart.findOne({ user: req.user._id })

         if (!cart) {
            return errorResponseData(res, "Cart not found")
         }

         // Find and update item
         const itemIndex = cart.items.findIndex(
            (item) => item.product.toString() === productId
         )

         if (itemIndex === -1) {
            return errorResponseData(res, "Product not in cart")
         }

         cart.items[itemIndex].quantity = quantity
         await cart.save()

         // Populate and return updated cart
         await cart.populate({
            path: "items.product",
            select:
               "name price discountPrice images category brand ratingsAverage ratingsCount stock status slug",
         })

         // Transform cart items to match frontend format
         const transformedItems = cart.items.map((item) => ({
            id: item.product._id,
            title: item.product.name,
            image:
               item.product.images && item.product.images.length > 0
                  ? item.product.images[0]
                  : "",
            imageTwo:
               item.product.images && item.product.images.length > 1
                  ? item.product.images[1]
                  : item.product.images[0] || "",
            newPrice: item.product.discountPrice || item.product.price,
            oldPrice: item.product.price,
            date: item.product.createdAt,
            rating: item.product.ratingsAverage || 0,
            status: item.product.stock > 0 ? "Available" : "Out Of Stock",
            waight: "1 pcs",
            location: "Online",
            brand: item.product.brand || "Unknown",
            sku: item.product._id,
            category: item.product.category || "",
            quantity: item.quantity,
         }))

         return successResponseData(res, transformedItems, 200, "Cart quantity updated")
      } catch (err) {
         console.error("Error updating cart quantity:", err)
         return errorResponseData(res, "Failed to update cart quantity")
      }
   },

   // Remove item from cart
   removeFromCart: async (req, res) => {
      try {
         const { productId } = req.params

         if (!productId) {
            return errorResponseData(res, "Product ID is required")
         }

         // Find cart
         const cart = await Cart.findOne({ user: req.user._id })

         if (!cart) {
            return errorResponseData(res, "Cart not found")
         }

         // Remove item from cart
         cart.items = cart.items.filter((item) => item.product.toString() !== productId)

         await cart.save()

         // Populate and return updated cart
         await cart.populate({
            path: "items.product",
            select:
               "name price discountPrice images category brand ratingsAverage ratingsCount stock status slug",
         })

         // Transform cart items to match frontend format
         const transformedItems = cart.items.map((item) => ({
            id: item.product._id,
            title: item.product.name,
            image:
               item.product.images && item.product.images.length > 0
                  ? item.product.images[0]
                  : "",
            imageTwo:
               item.product.images && item.product.images.length > 1
                  ? item.product.images[1]
                  : item.product.images[0] || "",
            newPrice: item.product.discountPrice || item.product.price,
            oldPrice: item.product.price,
            date: item.product.createdAt,
            rating: item.product.ratingsAverage || 0,
            status: item.product.stock > 0 ? "Available" : "Out Of Stock",
            waight: "1 pcs",
            location: "Online",
            brand: item.product.brand || "Unknown",
            sku: item.product._id,
            category: item.product.category || "",
            quantity: item.quantity,
         }))

         return successResponseData(
            res,
            transformedItems,
            200,
            "Product removed from cart"
         )
      } catch (err) {
         console.error("Error removing from cart:", err)
         return errorResponseData(res, "Failed to remove product from cart")
      }
   },

   // Clear cart
   clearCart: async (req, res) => {
      try {
         const cart = await Cart.findOne({ user: req.user._id })

         if (!cart) {
            return successResponseData(res, [], 200, "Cart cleared")
         }

         cart.items = []
         await cart.save()

         return successResponseData(res, [], 200, "Cart cleared")
      } catch (err) {
         console.error("Error clearing cart:", err)
         return errorResponseData(res, "Failed to clear cart")
      }
   },
}

module.exports = CartController
