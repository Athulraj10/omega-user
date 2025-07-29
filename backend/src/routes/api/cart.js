const { userTokenAuth } = require("../../middlewares/user")
const CartController = require("../../controllers/app/cartController")

const router = require("express").Router()

router.use(userTokenAuth)

// Get user's cart
router.get("/", CartController.getCart)

// Add item to cart
router.post("/add", CartController.addToCart)

// Update cart item quantity
router.put("/update/:productId", CartController.updateQuantity)

// Remove item from cart
router.delete("/remove/:productId", CartController.removeFromCart)

// Clear cart
router.delete("/clear", CartController.clearCart)

// Apply coupon to cart
router.post("/apply-coupon", CartController.applyCoupon)

// Remove coupon from cart
router.delete("/remove-coupon", CartController.removeCoupon)

// Get cart count
router.get("/count", CartController.getCartCount)

// Merge guest cart with user cart
router.post("/merge-guest", CartController.mergeGuestCart)

module.exports = router
