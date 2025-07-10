const router = require("express").Router()
const { userTokenAuth } = require("../../middlewares/user")
const orderController = require("../../controllers/app/orderController")

router.use(userTokenAuth)

// Place order
router.post("/checkout", orderController.placeOrder)

// List user orders
router.get("/", orderController.getOrders)

// Get order details
router.get("/:id", orderController.getOrderById)

// Cancel order
router.put("/:id/cancel", orderController.cancelOrder)

module.exports = router
