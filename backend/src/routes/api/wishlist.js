const { userTokenAuth } = require("../../middlewares/user")
const WishlistController = require("../../controllers/app/wishlistController")

const router = require("express").Router()

router.use(userTokenAuth)

// Get user's wishlist
router.get("/", WishlistController.getWishlist)

// Add product to wishlist
router.post("/add", WishlistController.addToWishlist)

// Remove product from wishlist
router.delete("/remove/:productId", WishlistController.removeFromWishlist)

// Clear wishlist
router.delete("/clear", WishlistController.clearWishlist)

// Check if product is in wishlist
router.get("/check/:productId", WishlistController.checkWishlistStatus)

// Get wishlist count
router.get("/count", WishlistController.getWishlistCount)

// Move item from wishlist to cart
router.post("/move-to-cart", WishlistController.moveToCart)

module.exports = router
