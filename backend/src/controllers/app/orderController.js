const { Order, Product } = require("../../models")
const { successResponseData, errorResponseData } = require("../../services/Response")

// Create (Place Order)
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
      const orders = await Order.find({ user }).sort({ createdAt: -1 })
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
      const order = await Order.findOneAndUpdate(
         { _id: req.params.id, user, status: { $in: ["pending", "processing"] } },
         { status: "cancelled" },
         { new: true }
      )
      if (!order)
         return errorResponseData(res, "Order not found or cannot be cancelled", 404)
      return successResponseData(res, order, 200, "Order cancelled")
   } catch (err) {
      return errorResponseData(res, err.message || "Failed to cancel order")
   }
}

// (Optional) Update order status (admin only)
// (Optional) Delete order (admin only)
