const BannerController = require("../../controllers/app/bannerController")

const router = require("express").Router()

// Public routes (no authentication required)
// @route   GET /api/banners
router.get("/", BannerController.getAllBanners)

// @route   GET /api/banners/active
router.get("/active", BannerController.getActiveBanners)

// @route   GET /api/banners/home
router.get("/home", BannerController.getHomeBanners)

// @route   GET /api/banners/category
router.get("/category", BannerController.getCategoryBanners)

// @route   GET /api/banners/sidebar
router.get("/sidebar", BannerController.getSidebarBanners)

// @route   GET /api/banners/position/:position
router.get("/position/:position", BannerController.getBannersByPosition)

// @route   GET /api/banners/:id
router.get("/:id", BannerController.getBannerById)

module.exports = router 