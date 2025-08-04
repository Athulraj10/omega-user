const express = require("express");
const router = express.Router();
const OrderController = require("../../controllers/app/orderController");
const { userTokenAuth } = require("../../middlewares/user");

// User routes (require authentication)
router.use(userTokenAuth);

// Create a new order
router.post("/", OrderController.createOrder);

// Get user's order history with pagination and filtering
router.get("/", OrderController.getUserOrders);

// Get order statistics for user
router.get("/stats", OrderController.getOrderStats);

// Get order by order number
router.get("/number/:orderNumber", OrderController.getOrderByNumber);

// Get single order by ID (must be last to avoid catching other routes)
router.get("/:id", OrderController.getOrderById);

// Cancel order
router.patch("/:id/cancel", OrderController.cancelOrder);

module.exports = router;
