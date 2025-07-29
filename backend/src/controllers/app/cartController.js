const Cart = require("../../models/cart")
const Product = require("../../models/product")
const { successResponseData, errorResponseData } = require("../../services/Response")

const CartController = {
   // Get user's cart
   getCart: async (req, res) => {
      try {
         const authUserId = req.authUserId
         
         // Find or create cart for user
         const cart = await Cart.findOrCreateForUser(authUserId)
         
         // Populate product details
         await cart.populate({
            path: "items.product",
            select: "name price discountPrice images category brand ratingsAverage ratingsCount stock status sku",
         })

         // Transform data for frontend
         const transformedItems = cart.items.map((item) => ({
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
            quantity: item.quantity,
            unitPrice: item.unitPrice || item.product.price,
            totalPrice: (item.unitPrice || item.product.price) * item.quantity,
            isAvailable: item.isAvailable,
            stockAvailable: item.stockAvailable || item.product.stock,
            selectedOptions: item.selectedOptions
         }))

         return successResponseData(res, {
            items: transformedItems,
            subtotal: cart.subtotal,
            totalItems: cart.totalItems,
            finalTotal: cart.getFinalTotal(),
            appliedCoupon: cart.appliedCoupon,
            lastUpdated: cart.lastUpdated
         }, 200, "Cart fetched successfully")
      } catch (err) {
         console.error("Error fetching cart:", err)
         return errorResponseData(res, "Failed to fetch cart")
      }
   },

   // Add item to cart
   addToCart: async (req, res) => {
      try {
         const { productId, quantity = 1, options = {} } = req.body
         const authUserId = req.authUserId

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

         // Find or create cart for user
         const cart = await Cart.findOrCreateForUser(authUserId)

         // Prepare product details
         const productDetails = {
            productName: product.name,
            productPrice: product.price,
            productDiscountPrice: product.discountPrice,
            productImage: product.images && product.images.length > 0 ? product.images[0] : "",
            productSku: product.sku,
            unitPrice: product.discountPrice || product.price,
            isAvailable: product.stock > 0 && product.status === '1',
            stockAvailable: product.stock
         }

         // Add product to cart
         await cart.addProduct(productId, quantity, productDetails, options)

         // Populate and return updated cart
         await cart.populate({
            path: "items.product",
            select: "name price discountPrice images category brand ratingsAverage ratingsCount stock status sku",
         })

         // Transform cart items to match frontend format
         const transformedItems = cart.items.map((item) => ({
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
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            isAvailable: item.isAvailable,
            stockAvailable: item.stockAvailable,
            selectedOptions: item.selectedOptions
         }))

         return successResponseData(res, {
            items: transformedItems,
            subtotal: cart.subtotal,
            totalItems: cart.totalItems,
            finalTotal: cart.getFinalTotal(),
            message: "Product added to cart successfully"
         }, 200, "Product added to cart")
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
         const authUserId = req.authUserId

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
         const cart = await Cart.findOne({ userId: authUserId })

         if (!cart) {
            return errorResponseData(res, "Cart not found")
         }

         // Update quantity
         await cart.updateQuantity(productId, quantity)

         // Populate and return updated cart
         await cart.populate({
            path: "items.product",
            select: "name price discountPrice images category brand ratingsAverage ratingsCount stock status sku",
         })

         // Transform cart items to match frontend format
         const transformedItems = cart.items.map((item) => ({
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
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            isAvailable: item.isAvailable,
            stockAvailable: item.stockAvailable,
            selectedOptions: item.selectedOptions
         }))

         return successResponseData(res, {
            items: transformedItems,
            subtotal: cart.subtotal,
            totalItems: cart.totalItems,
            finalTotal: cart.getFinalTotal(),
            message: "Cart quantity updated successfully"
         }, 200, "Cart quantity updated")
      } catch (err) {
         console.error("Error updating cart quantity:", err)
         return errorResponseData(res, "Failed to update cart quantity")
      }
   },

   // Remove item from cart
   removeFromCart: async (req, res) => {
      try {
         const { productId } = req.params
         const authUserId = req.authUserId

         if (!productId) {
            return errorResponseData(res, "Product ID is required")
         }

         // Find cart
         const cart = await Cart.findOne({ userId: authUserId })

         if (!cart) {
            return errorResponseData(res, "Cart not found")
         }

         // Remove item from cart
         await cart.removeProduct(productId)

         // Populate and return updated cart
         await cart.populate({
            path: "items.product",
            select: "name price discountPrice images category brand ratingsAverage ratingsCount stock status sku",
         })

         // Transform cart items to match frontend format
         const transformedItems = cart.items.map((item) => ({
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
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            isAvailable: item.isAvailable,
            stockAvailable: item.stockAvailable,
            selectedOptions: item.selectedOptions
         }))

         return successResponseData(
            res,
            {
               items: transformedItems,
               subtotal: cart.subtotal,
               totalItems: cart.totalItems,
               finalTotal: cart.getFinalTotal(),
               message: "Product removed from cart successfully"
            },
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
         const authUserId = req.authUserId
         const cart = await Cart.findOne({ userId: authUserId })

         if (!cart) {
            return successResponseData(res, { items: [], subtotal: 0, totalItems: 0, finalTotal: 0 }, 200, "Cart cleared")
         }

         await cart.clearCart()

         return successResponseData(res, { items: [], subtotal: 0, totalItems: 0, finalTotal: 0 }, 200, "Cart cleared successfully")
      } catch (err) {
         console.error("Error clearing cart:", err)
         return errorResponseData(res, "Failed to clear cart")
      }
   },

   // Apply coupon to cart
   applyCoupon: async (req, res) => {
      try {
         const { couponCode, discountAmount, discountType = 'fixed' } = req.body
         const authUserId = req.authUserId

         if (!couponCode || !discountAmount) {
            return errorResponseData(res, "Coupon code and discount amount are required")
         }

         const cart = await Cart.findOne({ userId: authUserId })
         if (!cart) {
            return errorResponseData(res, "Cart not found")
         }

         await cart.applyCoupon(couponCode, discountAmount, discountType)

         return successResponseData(res, {
            appliedCoupon: cart.appliedCoupon,
            finalTotal: cart.getFinalTotal(),
            message: "Coupon applied successfully"
         }, 200, "Coupon applied")
      } catch (err) {
         console.error("Error applying coupon:", err)
         return errorResponseData(res, "Failed to apply coupon")
      }
   },

   // Remove coupon from cart
   removeCoupon: async (req, res) => {
      try {
         const authUserId = req.authUserId
         const cart = await Cart.findOne({ userId: authUserId })

         if (!cart) {
            return errorResponseData(res, "Cart not found")
         }

         await cart.removeCoupon()

         return successResponseData(res, {
            appliedCoupon: cart.appliedCoupon,
            finalTotal: cart.getFinalTotal(),
            message: "Coupon removed successfully"
         }, 200, "Coupon removed")
      } catch (err) {
         console.error("Error removing coupon:", err)
         return errorResponseData(res, "Failed to remove coupon")
      }
   },

   // Get cart count
   getCartCount: async (req, res) => {
      try {
         const authUserId = req.authUserId
         const cart = await Cart.findOne({ userId: authUserId })

         const count = cart ? cart.totalItems : 0

         return successResponseData(res, { count }, 200, "Cart count fetched")
      } catch (err) {
         console.error("Error fetching cart count:", err)
         return errorResponseData(res, "Failed to fetch cart count")
      }
   },

   // Merge guest cart with user cart
   mergeGuestCart: async (req, res) => {
      try {
         const { guestCartId } = req.body
         const authUserId = req.authUserId

         if (!guestCartId) {
            return errorResponseData(res, "Guest cart ID is required")
         }

         const mergedCart = await Cart.mergeGuestCart(guestCartId, authUserId)

         return successResponseData(res, {
            message: "Guest cart merged successfully",
            cartId: mergedCart._id
         }, 200, "Cart merged")
      } catch (err) {
         console.error("Error merging guest cart:", err)
         return errorResponseData(res, "Failed to merge guest cart")
      }
   }
}

module.exports = CartController
