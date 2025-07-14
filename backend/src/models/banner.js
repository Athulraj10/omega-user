const mongoose = require("mongoose")

const BannerSchema = new mongoose.Schema(
   {
      title: { type: String, required: true },
      description: { type: String },
      image: { type: String, required: true },
      link: { type: String },
      linkText: { type: String },
      status: { type: String, enum: ["active", "inactive"], default: "active" },
      position: { type: String, enum: ["home", "category", "product", "sidebar"], default: "home" },
      priority: { type: Number, default: 0 }, // For ordering banners
      startDate: { type: Date },
      endDate: { type: Date },
      isActive: { type: Boolean, default: true },
      targetAudience: { type: String, enum: ["all", "new", "returning"], default: "all" },
      deviceType: { type: String, enum: ["all", "desktop", "mobile"], default: "all" },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
   },
   {
      timestamps: true,
   }
)

// Update timestamp before saving
BannerSchema.pre("save", function (next) {
   this.updatedAt = Date.now()
   next()
})

// Add text index for search
BannerSchema.index({
   title: "text",
   description: "text",
})

module.exports = mongoose.model("Banner", BannerSchema) 