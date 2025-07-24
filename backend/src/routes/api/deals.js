const ProductController = require("../../controllers/app/product/productController")
const { user } = require("../../middlewares/user")

const router = require("express").Router()

// Public routes (no authentication required)
// @route   GET /api/deals
router.get("/", ProductController.getDeals)

// @route   GET /api/deals/featured
router.get("/featured", ProductController.getFeaturedDeals)

// @route   GET /api/deals/flash-sale
router.get("/flash-sale", ProductController.getFlashSaleDeals)

// @route   GET /api/deals/ending-soon
router.get("/ending-soon", ProductController.getEndingSoonDeals)

// @route   GET /api/deals/category/:category
router.get("/category/:category", ProductController.getDealsByCategory)

// @route   GET /api/deals/brand/:brand
router.get("/brand/:brand", ProductController.getDealsByBrand)

// @route   GET /api/deals/price-range
router.get("/price-range", ProductController.getDealsByPriceRange)

module.exports = router 