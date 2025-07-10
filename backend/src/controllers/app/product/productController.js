const mongoose = require("mongoose")
const {
   successResponseData,
   errorResponseData,
   validationErrorResponseData,
} = require("../../../services/Response")
const { Product, Review, Wishlist, User } = require("../../../models")

module.exports = {
   // Get all products with filtering, sorting, and pagination
   listProduct: async (req, res) => {
      try {
         const {
            category,
            brand,
            minPrice,
            maxPrice,
            sort,
            search,
            page = 1,
            limit = 20,
            colors,
            sizes,
            tags,
            isFeatured,
            isBundle,
         } = req.query

         const query = { status: "active" }

         // Category filter
         if (category) {
            if (Array.isArray(category)) {
               query.category = { $in: category }
            } else {
               query.category = category
            }
         }

         // Brand filter
         if (brand) {
            if (Array.isArray(brand)) {
               query.brand = { $in: brand }
            } else {
               query.brand = brand
            }
         }

         // Price range filter
         if (minPrice || maxPrice) {
            query.price = {}
            if (minPrice) query.price.$gte = parseFloat(minPrice)
            if (maxPrice) query.price.$lte = parseFloat(maxPrice)
         }

         // Search filter
         if (search) {
            query.$text = { $search: search }
         }

         // Color filter
         if (colors) {
            if (Array.isArray(colors)) {
               query.colors = { $in: colors }
            } else {
               query.colors = colors
            }
         }

         // Size filter
         if (sizes) {
            if (Array.isArray(sizes)) {
               query.sizes = { $in: sizes }
            } else {
               query.sizes = sizes
            }
         }

         // Tags filter
         if (tags) {
            if (Array.isArray(tags)) {
               query.tags = { $in: tags }
            } else {
               query.tags = tags
            }
         }

         // Featured filter
         if (isFeatured !== undefined) {
            query.isFeatured = isFeatured === "true"
         }

         // Bundle filter
         if (isBundle !== undefined) {
            query.isBundle = isBundle === "true"
         }

         const skip = (page - 1) * limit

         // Sort options
         const sortQuery = {}
         if (sort) {
            switch (sort) {
               case "price_asc":
                  sortQuery.price = 1
                  break
               case "price_desc":
                  sortQuery.price = -1
                  break
               case "newest":
                  sortQuery.createdAt = -1
                  break
               case "oldest":
                  sortQuery.createdAt = 1
                  break
               case "rating":
                  sortQuery.ratingsAverage = -1
                  break
               case "popular":
                  sortQuery.ratingsCount = -1
                  break
               default:
                  sortQuery.createdAt = -1
            }
         } else {
            sortQuery.createdAt = -1
         }

         const products = await Product.find(query)
            .sort(sortQuery)
            .skip(skip)
            .limit(parseInt(limit))

         const total = await Product.countDocuments(query)

         return successResponseData(res, products, 200, "Products fetched", {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / limit),
         })
      } catch (err) {
         console.error("List Products Error:", err)
         return errorResponseData(res, "Failed to fetch products")
      }
   },

   // Get product by ID
   getProductById: async (req, res) => {
      try {
         const product = await Product.findById(req.params.id)
         if (!product) {
            return errorResponseData(res, "Product not found", 404)
         }
         return successResponseData(res, product, 200, "Product found")
      } catch (err) {
         return errorResponseData(res, "Error fetching product")
      }
   },

   // Get product by slug
   getProductBySlug: async (req, res) => {
      try {
         const product = await Product.findOne({ slug: req.params.slug })
         if (!product) {
            return errorResponseData(res, "Product not found", 404)
         }
         return successResponseData(res, product, 200, "Product found")
      } catch (err) {
         return errorResponseData(res, "Error fetching product")
      }
   },

   // Search products
   searchProduct: async (req, res) => {
      const { q, limit = 10, page = 1 } = req.query
      try {
         if (!q) {
            return validationErrorResponseData(res, "Search query is required")
         }

         const skip = (page - 1) * limit
         const products = await Product.find({
            $text: { $search: q },
            status: "active",
         })
            .sort({ score: { $meta: "textScore" } })
            .skip(skip)
            .limit(parseInt(limit))

         const total = await Product.countDocuments({
            $text: { $search: q },
            status: "active",
         })

         return successResponseData(res, products, 200, "Search results", {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
         })
      } catch (err) {
         return errorResponseData(res, "Failed to search products")
      }
   },

   // Get similar products
   getSimilarProducts: async (req, res) => {
      try {
         const { id } = req.params
         const { limit = 4 } = req.query

         const current = await Product.findById(id)
         if (!current) {
            return errorResponseData(res, "Product not found")
         }

         const similar = await Product.find({
            category: current.category,
            _id: { $ne: id },
            status: "active",
         }).limit(parseInt(limit))

         return successResponseData(res, similar, 200, "Similar products")
      } catch (err) {
         return errorResponseData(res, "Failed to fetch similar products")
      }
   },

   // Get related products
   getRelatedProducts: async (req, res) => {
      try {
         const { limit = 4 } = req.query
         const related = await Product.aggregate([
            { $match: { status: "active" } },
            { $sample: { size: parseInt(limit) } },
         ])
         return successResponseData(res, related, 200, "Related products")
      } catch (err) {
         return errorResponseData(res, "Error getting related products")
      }
   },

   // Get product filters
   getFilters: async (req, res) => {
      try {
         const categories = await Product.distinct("category")
         const brands = await Product.distinct("brand")
         const colors = await Product.distinct("colors")
         const sizes = await Product.distinct("sizes")
         const tags = await Product.distinct("tags")

         const prices = await Product.aggregate([
            { $match: { status: "active" } },
            {
               $group: {
                  _id: null,
                  min: { $min: "$price" },
                  max: { $max: "$price" },
               },
            },
         ])

         return successResponseData(
            res,
            {
               categories,
               brands,
               colors,
               sizes,
               tags,
               priceRange: prices[0] || { min: 0, max: 0 },
            },
            200,
            "Available filters"
         )
      } catch (err) {
         return errorResponseData(res, "Error getting filters")
      }
   },

   // Get featured products
   getFeatured: async (req, res) => {
      try {
         const { limit = 8 } = req.query
         const products = await Product.find({
            isFeatured: true,
            status: "active",
         }).limit(parseInt(limit))
         return successResponseData(res, products, 200, "Featured products")
      } catch (err) {
         return errorResponseData(res, "Failed to fetch featured products")
      }
   },

   // Get bestselling products
   getBestsellers: async (req, res) => {
      try {
         const { limit = 8 } = req.query
         const products = await Product.find({ status: "active" })
            .sort({ ratingsCount: -1 })
            .limit(parseInt(limit))
         return successResponseData(res, products, 200, "Bestselling products")
      } catch (err) {
         return errorResponseData(res, "Failed to fetch bestsellers")
      }
   },

   // Get new arrivals
   getNewArrivals: async (req, res) => {
      try {
         const { limit = 8 } = req.query
         const products = await Product.find({ status: "active" })
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
         return successResponseData(res, products, 200, "New arrivals")
      } catch (err) {
         return errorResponseData(res, "Failed to fetch new arrivals")
      }
   },

   // Get deals (products with discount)
   getDeals: async (req, res) => {
      try {
         const { limit = 8 } = req.query
         const products = await Product.find({
            status: "active",
            discountPrice: { $exists: true, $ne: null, $lt: "$price" },
         }).limit(parseInt(limit))
         return successResponseData(res, products, 200, "Deals")
      } catch (err) {
         return errorResponseData(res, "Failed to fetch deals")
      }
   },

   // Get trending products
   getTrending: async (req, res) => {
      try {
         const { limit = 8 } = req.query
         const products = await Product.find({ status: "active" })
            .sort({ ratingsAverage: -1 })
            .limit(parseInt(limit))
         return successResponseData(res, products, 200, "Trending products")
      } catch (err) {
         return errorResponseData(res, "Failed to fetch trending")
      }
   },

   // Get categories
   getCategories: async (req, res) => {
      try {
         const categories = await Product.distinct("category")
         return successResponseData(res, categories, 200, "Categories fetched")
      } catch (err) {
         return errorResponseData(res, "Failed to fetch categories")
      }
   },

   // Get brands
   getBrands: async (req, res) => {
      try {
         const brands = await Product.distinct("brand")
         return successResponseData(res, brands, 200, "Brands fetched")
      } catch (err) {
         return errorResponseData(res, "Failed to fetch brands")
      }
   },

   // Get product reviews
   getProductReviews: async (req, res) => {
      try {
         const { id } = req.params
         const { sort = "newest", page = 1, limit = 10 } = req.query

         const sortOptions = {
            newest: { createdAt: -1 },
            highest: { rating: -1 },
            lowest: { rating: 1 },
         }

         const skip = (page - 1) * limit

         const reviews = await Review.find({ product: id })
            .populate("user", "first_name last_name profile_pic")
            .sort(sortOptions[sort] || sortOptions.newest)
            .skip(skip)
            .limit(parseInt(limit))

         const total = await Review.countDocuments({ product: id })

         return successResponseData(res, reviews, 200, "Product reviews", {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
         })
      } catch (err) {
         return errorResponseData(res, "Failed to get reviews")
      }
   },

   // Get product ratings
   getProductRatings: async (req, res) => {
      try {
         const { id } = req.params

         const result = await Review.aggregate([
            { $match: { product: new mongoose.Types.ObjectId(id) } },
            {
               $group: {
                  _id: "$rating",
                  count: { $sum: 1 },
               },
            },
         ])

         let total = 0
         let sum = 0
         const breakdown = {}

         result.forEach(({ _id, count }) => {
            breakdown[_id] = count
            total += count
            sum += _id * count
         })

         const average = total ? (sum / total).toFixed(1) : 0

         return successResponseData(
            res,
            {
               average: parseFloat(average),
               count: total,
               breakdown,
            },
            200,
            "Rating summary"
         )
      } catch (err) {
         return errorResponseData(res, "Failed to fetch ratings")
      }
   },

   // Get product variants
   getVariants: async (req, res) => {
      try {
         const product = await Product.findById(req.params.id)
         if (!product) {
            return errorResponseData(res, "Product not found")
         }
         return successResponseData(res, product?.variants || [], 200, "Variants fetched")
      } catch (err) {
         return errorResponseData(res, "Failed to fetch variants")
      }
   },

   // Check product availability
   checkAvailability: async (req, res) => {
      try {
         const { variantId } = req.query
         const product = await Product.findById(req.params.id)
         if (!product) {
            return errorResponseData(res, "Product not found")
         }

         let availableStock = product.stock
         if (variantId && product.variants) {
            const variant = product.variants.find((v) => v._id.toString() === variantId)
            if (variant) {
               availableStock = variant.stock
            }
         }

         return successResponseData(res, { availableStock }, 200, "Stock availability")
      } catch (err) {
         return errorResponseData(res, "Failed to check availability")
      }
   },

   // Get delivery options
   getDeliveryOptions: async (req, res) => {
      try {
         const options = [
            { type: "Standard", time: "3-5 days", cost: 0 },
            { type: "Express", time: "1-2 days", cost: 50 },
         ]
         return successResponseData(res, options, 200, "Delivery options")
      } catch (err) {
         return errorResponseData(res, "Failed to fetch delivery options")
      }
   },

   // Get comparison data
   getCompareData: async (req, res) => {
      try {
         const { id } = req.params
         const current = await Product.findById(id)
         if (!current) {
            return errorResponseData(res, "Product not found")
         }

         const similar = await Product.find({
            _id: { $ne: id },
            category: current.category,
            status: "active",
         }).limit(4)

         return successResponseData(
            res,
            {
               base: current,
               compareWith: similar,
            },
            200,
            "Comparison data"
         )
      } catch (err) {
         return errorResponseData(res, "Failed to compare products")
      }
   },
}
