const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema(
   {
      name: { type: String, required: true, index: true },
      slug: { type: String, unique: true, index: true },
      description: { type: String },
      category: { type: String, index: true },
      brand: { type: String, index: true },
      price: { type: Number, required: true },
      discountPrice: { type: Number },
      images: [{ type: String }],
      imageTwo: { type: String }, // Hover image
      stock: { type: Number, default: 0 },
      sku: { type: String, unique: true },
      status: { type: String, enum: ["active", "inactive"], default: "active" },
      ratingsAverage: { type: Number, default: 0 },
      ratingsCount: { type: Number, default: 0 },
      weight: { type: String }, // e.g., "500g", "1 pcs"
      location: { type: String, default: "Online" }, // e.g., "Online", "in Store, Online"
      colors: [{ type: String }],
      sizes: [{ type: String }],
      tags: [{ type: String }],
      isFeatured: { type: Boolean, default: false },
      isBundle: { type: Boolean, default: false },
      sale: { type: String, enum: ["Sale", "New", null] }, // Sale badge
      variants: [
         {
            name: String,
            value: String,
            price: Number,
            stock: Number,
         },
      ],
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
   },
   {
      timestamps: true,
   }
)

// Create slug from name before saving
ProductSchema.pre("save", function (next) {
   this.updatedAt = Date.now()

   // Generate slug if not provided
   if (!this.slug && this.name) {
      this.slug = this.name
         .toLowerCase()
         .replace(/[^a-z0-9]+/g, "-")
         .replace(/(^-|-$)/g, "")
   }

   next()
})

// Add text index for search
ProductSchema.index({
   name: "text",
   description: "text",
   category: "text",
   brand: "text",
})

module.exports = mongoose.model("Product", ProductSchema)
