const ProductController = require("../../controllers/app/product/productController")
const { user } = require("../../middlewares/user")

const router = require("express").Router()

// Public routes (no authentication required)
// @route   GET /api/products
router.get("/", ProductController.listProduct)

// @route   GET /api/products/search
router.get("/search", ProductController.searchProduct)

// @route   GET /api/products/filters
router.get("/filters", ProductController.getFilters)

// @route   GET /api/products/featured
router.get("/featured", ProductController.getFeatured)

// @route   GET /api/products/bestsellers
router.get("/bestsellers", ProductController.getBestsellers)

// @route   GET /api/products/new-arrivals
router.get("/new-arrivals", ProductController.getNewArrivals)

// @route   GET /api/products/deals
router.get("/deals", ProductController.getDeals)

// @route   GET /api/products/trending
router.get("/trending", ProductController.getTrending)

// @route   GET /api/products/categories
router.get("/categories", ProductController.getCategories)

// @route   GET /api/products/brands
router.get("/brands", ProductController.getBrands)

// Product detail routes (must come before :id routes to avoid conflicts)
// @route   GET /api/products/:slug
router.get("/slug/:slug", ProductController.getProductBySlug)

// Product ID specific routes
// @route   GET /api/products/:id
router.get("/:id", ProductController.getProductById)

// @route   GET /api/products/:id/similar
router.get("/:id/similar", ProductController.getSimilarProducts)

// @route   GET /api/products/:id/related
router.get("/:id/related", ProductController.getRelatedProducts)

// @route   GET /api/products/:id/reviews
router.get("/:id/reviews", ProductController.getProductReviews)

// @route   GET /api/products/:id/ratings
router.get("/:id/ratings", ProductController.getProductRatings)

// @route   GET /api/products/:id/variants
router.get("/:id/variants", ProductController.getVariants)

// @route   GET /api/products/:id/availability
router.get("/:id/availability", ProductController.checkAvailability)

// @route   GET /api/products/:id/delivery-options
router.get("/:id/delivery-options", ProductController.getDeliveryOptions)

// @route   GET /api/products/:id/compare
router.get("/:id/compare", ProductController.getCompareData)

module.exports = router
