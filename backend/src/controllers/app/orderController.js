const { Order, Product, Cart } = require("../../models")
const { successResponseData, errorResponseData } = require("../../services/Response")
const CheckoutService = require("../../services/CheckoutService")

// Complete checkout process
exports.completeCheckout = async (req, res) => {
   try {
      const userId = req.user._id
      const { shippingAddress, paymentMethod = 'cod', couponCode } = req.body

      // Validate shipping address
      if (!shippingAddress || !shippingAddress.addressLine1 || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) {
         return errorResponseData(res, "Complete shipping address is required", 400)
      }

      // Process checkout using service
      const order = await CheckoutService.processCheckout(userId, shippingAddress, paymentMethod, couponCode)

      // Populate order with product details for response
      await order.populate({
         path: 'items.product',
         select: 'name images sku brand'
      })

      return successResponseData(res, {
         order: order,
         message: "Order placed successfully"
      }, 201, "Checkout completed successfully")

   } catch (err) {
      console.error("Checkout error:", err)
      return errorResponseData(res, err.message || "Failed to complete checkout")
   }
}

// Create (Place Order) - Legacy method
exports.placeOrder = async (req, res) => {
   try {
      const user = req.user._id
      const { items, shippingAddress, totalAmount } = req.body
      if (!items || !Array.isArray(items) || items.length === 0) {
         return errorResponseData(res, "Order items required", 400)
      }
      // Optionally: Validate products and stock here
      const order = await Order.create({
         user,
         items,
         shippingAddress,
         totalAmount,
         status: "pending",
         paymentStatus: "pending",
      })
      return successResponseData(res, order, 201, "Order placed successfully")
   } catch (err) {
      return errorResponseData(res, err.message || "Failed to place order")
   }
}

// List all orders for user
exports.getOrders = async (req, res) => {
   try {
      const user = req.user._id
      const orders = await Order.find({ user })
         .populate({
            path: 'items.product',
            select: 'name images sku brand'
         })
         .sort({ createdAt: -1 })
      return successResponseData(res, orders, 200, "Orders fetched")
   } catch (err) {
      return errorResponseData(res, err.message || "Failed to fetch orders")
   }
}

// Get order details
exports.getOrderById = async (req, res) => {
   try {
      const user = req.user._id
      const order = await Order.findOne({ _id: req.params.id, user })
         .populate({
            path: 'items.product',
            select: 'name images sku brand description'
         })
      if (!order) return errorResponseData(res, "Order not found", 404)
      return successResponseData(res, order, 200, "Order details fetched")
   } catch (err) {
      return errorResponseData(res, err.message || "Failed to fetch order")
   }
}

// Cancel order
exports.cancelOrder = async (req, res) => {
   try {
      const user = req.user._id
      const orderId = req.params.id

      const updatedOrder = await CheckoutService.cancelOrder(orderId, user)

      return successResponseData(res, updatedOrder, 200, "Order cancelled successfully")
   } catch (err) {
      return errorResponseData(res, err.message || "Failed to cancel order")
   }
}

// Get order summary for checkout
exports.getCheckoutSummary = async (req, res) => {
   try {
      const userId = req.user._id
      
      const summary = await CheckoutService.getCheckoutSummary(userId)

      return successResponseData(res, summary, 200, "Checkout summary generated")

   } catch (err) {
      console.error("Checkout summary error:", err)
      return errorResponseData(res, err.message || "Failed to generate checkout summary")
   }
}

// (Optional) Update order status (admin only)
// (Optional) Delete order (admin only)
