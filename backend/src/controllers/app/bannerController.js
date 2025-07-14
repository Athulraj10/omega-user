const {
   successResponseData,
   errorResponseData,
   validationErrorResponseData,
} = require("../../services/Response")
const { Banner } = require("../../models")

module.exports = {
   // Get all banners with filtering and pagination
   getAllBanners: async (req, res) => {
      try {
         const {
            position,
            status,
            page = 1,
            limit = 20,
            search,
         } = req.query

         const query = {}

         // Position filter
         if (position) {
            query.position = position
         }

         // Status filter
         if (status) {
            query.status = status
         }

         // Search filter
         if (search) {
            query.$text = { $search: search }
         }

         const skip = (page - 1) * limit

         const banners = await Banner.find(query)
            .sort({ priority: -1, createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))

         const total = await Banner.countDocuments(query)

         return successResponseData(res, banners, 200, "Banners fetched successfully", {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / limit),
         })
      } catch (err) {
         console.error("Get All Banners Error:", err)
         return errorResponseData(res, "Failed to fetch banners")
      }
   },

   // Get active banners (for frontend display)
   getActiveBanners: async (req, res) => {
      try {
         const { position, deviceType = "all" } = req.query

         const query = {
            status: "active",
            isActive: true,
         }

         // Position filter
         if (position) {
            query.position = position
         }

         // Device type filter
         if (deviceType !== "all") {
            query.$or = [
               { deviceType: "all" },
               { deviceType: deviceType }
            ]
         }

         // Date range filter (if startDate and endDate are set)
         const now = new Date()
         query.$or = [
            { startDate: { $exists: false }, endDate: { $exists: false } },
            { startDate: { $lte: now }, endDate: { $exists: false } },
            { startDate: { $exists: false }, endDate: { $gte: now } },
            { startDate: { $lte: now }, endDate: { $gte: now } }
         ]

         const banners = await Banner.find(query)
            .sort({ priority: -1, createdAt: -1 })

         return successResponseData(res, banners, 200, "Active banners fetched successfully")
      } catch (err) {
         console.error("Get Active Banners Error:", err)
         return errorResponseData(res, "Failed to fetch active banners")
      }
   },

   // Get banners by position
   getBannersByPosition: async (req, res) => {
      try {
         const { position } = req.params
         const { deviceType = "all" } = req.query

         if (!position) {
            return validationErrorResponseData(res, "Position is required")
         }

         const query = {
            position: position,
            status: "active",
            isActive: true,
         }

         // Device type filter
         if (deviceType !== "all") {
            query.$or = [
               { deviceType: "all" },
               { deviceType: deviceType }
            ]
         }

         // Date range filter
         const now = new Date()
         query.$or = [
            { startDate: { $exists: false }, endDate: { $exists: false } },
            { startDate: { $lte: now }, endDate: { $exists: false } },
            { startDate: { $exists: false }, endDate: { $gte: now } },
            { startDate: { $lte: now }, endDate: { $gte: now } }
         ]

         const banners = await Banner.find(query)
            .sort({ priority: -1, createdAt: -1 })

         return successResponseData(res, banners, 200, `Banners for ${position} position fetched successfully`)
      } catch (err) {
         console.error("Get Banners By Position Error:", err)
         return errorResponseData(res, "Failed to fetch banners by position")
      }
   },

   // Get banner by ID
   getBannerById: async (req, res) => {
      try {
         const banner = await Banner.findById(req.params.id)
         if (!banner) {
            return errorResponseData(res, "Banner not found", 404)
         }
         return successResponseData(res, banner, 200, "Banner found successfully")
      } catch (err) {
         console.error("Get Banner By ID Error:", err)
         return errorResponseData(res, "Error fetching banner")
      }
   },

   // Get home page banners
   getHomeBanners: async (req, res) => {
      try {
         const { deviceType = "all" } = req.query

         const query = {
            position: "home",
            status: "active",
            isActive: true,
         }

         // Device type filter
         if (deviceType !== "all") {
            query.$or = [
               { deviceType: "all" },
               { deviceType: deviceType }
            ]
         }

         // Date range filter
         const now = new Date()
         query.$or = [
            { startDate: { $exists: false }, endDate: { $exists: false } },
            { startDate: { $lte: now }, endDate: { $exists: false } },
            { startDate: { $exists: false }, endDate: { $gte: now } },
            { startDate: { $lte: now }, endDate: { $gte: now } }
         ]

         const banners = await Banner.find(query)
            .sort({ priority: -1, createdAt: -1 })

         return successResponseData(res, banners, 200, "Home banners fetched successfully")
      } catch (err) {
         console.error("Get Home Banners Error:", err)
         return errorResponseData(res, "Failed to fetch home banners")
      }
   },

   // Get category page banners
   getCategoryBanners: async (req, res) => {
      try {
         const { deviceType = "all" } = req.query

         const query = {
            position: "category",
            status: "active",
            isActive: true,
         }

         // Device type filter
         if (deviceType !== "all") {
            query.$or = [
               { deviceType: "all" },
               { deviceType: deviceType }
            ]
         }

         // Date range filter
         const now = new Date()
         query.$or = [
            { startDate: { $exists: false }, endDate: { $exists: false } },
            { startDate: { $lte: now }, endDate: { $exists: false } },
            { startDate: { $exists: false }, endDate: { $gte: now } },
            { startDate: { $lte: now }, endDate: { $gte: now } }
         ]

         const banners = await Banner.find(query)
            .sort({ priority: -1, createdAt: -1 })

         return successResponseData(res, banners, 200, "Category banners fetched successfully")
      } catch (err) {
         console.error("Get Category Banners Error:", err)
         return errorResponseData(res, "Failed to fetch category banners")
      }
   },

   // Get sidebar banners
   getSidebarBanners: async (req, res) => {
      try {
         const { deviceType = "all" } = req.query

         const query = {
            position: "sidebar",
            status: "active",
            isActive: true,
         }

         // Device type filter
         if (deviceType !== "all") {
            query.$or = [
               { deviceType: "all" },
               { deviceType: deviceType }
            ]
         }

         // Date range filter
         const now = new Date()
         query.$or = [
            { startDate: { $exists: false }, endDate: { $exists: false } },
            { startDate: { $lte: now }, endDate: { $exists: false } },
            { startDate: { $exists: false }, endDate: { $gte: now } },
            { startDate: { $lte: now }, endDate: { $gte: now } }
         ]

         const banners = await Banner.find(query)
            .sort({ priority: -1, createdAt: -1 })

         return successResponseData(res, banners, 200, "Sidebar banners fetched successfully")
      } catch (err) {
         console.error("Get Sidebar Banners Error:", err)
         return errorResponseData(res, "Failed to fetch sidebar banners")
      }
   },
} 