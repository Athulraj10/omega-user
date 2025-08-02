const router = require("express").Router()
const { userTokenAuth } = require("../../middlewares/user")
const orderController = require("../../controllers/app/orderController")
const { placeOrderValidation, completeCheckoutValidation } = require("../../services/OrderValidation")

router.use(userTokenAuth)

// Get checkout summary
router.get("/checkout/summary", orderController.getCheckoutSummary)

// Complete checkout process
router.post("/checkout/complete", completeCheckoutValidation, orderController.completeCheckout)

// Place order (legacy method)
router.post("/checkout", placeOrderValidation, orderController.placeOrder)

// List user orders
router.get("/", orderController.getOrders)

// Get order details
router.get("/:id", orderController.getOrderById)

// Cancel order
router.put("/:id/cancel", orderController.cancelOrder)

module.exports = router
