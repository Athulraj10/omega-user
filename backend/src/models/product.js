const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true, index: true },
    description: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    images: [{ type: String }],
    stock: { type: Number, default: 0 },
    minimumOrder: { type: Number, default: 1, min: 1 },
    sku: { type: String, unique: true },
    status: { type: String, enum: ['1', '0'], default: '1' },
    ratingsAverage: { type: Number, default: 0 },
    ratingsCount: { type: Number, default: 0 },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    
    
    // Additional fields for user-side display
    sale: { type: String, default: '' }, // "Sale", "New", "Hot", etc.
    location: { type: String, default: 'Online' },
    brand: { type: String, default: '' },
    weight: { type: String, default: '' },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    availability: { type: String, enum: ['Available', 'Out of Stock', 'Pre-order'], default: 'Available' },
    
    // SEO and metadata
    metaTitle: { type: String },
    metaDescription: { type: String },
    keywords: [{ type: String }],
    
    // Product specifications
    specifications: { type: Map, of: String }, // Dynamic key-value pairs
    features: [{ type: String }],
    tags: [{ type: String }],
    
    // Pricing and offers
    isOnSale: { type: Boolean, default: false },
    saleStartDate: { type: Date },
    saleEndDate: { type: Date },
    discountPercentage: { type: Number, min: 0, max: 100 },
    
    // Inventory tracking
    lowStockThreshold: { type: Number, default: 5 },
    trackInventory: { type: Boolean, default: true },
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});

ProductSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Product', ProductSchema);
