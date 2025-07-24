const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  dealType: {
    type: String,
    enum: ['percentage', 'fixed', 'buy_one_get_one', 'free_shipping', 'flash_sale'],
    default: 'percentage'
  },
  discountValue: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  dealPrice: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  brand: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    default: 'Online'
  },
  sku: {
    type: String,
    unique: true,
    sparse: true
  },
  id: {
    type: Number,
    unique: true
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1
  },
  weight: {
    type: String,
    trim: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  status: {
    type: String,
    enum: ['Available', 'Out of Stock', 'Pre-order'],
    default: 'Available'
  },
  sale: {
    type: String,
    trim: true
  },
  images: [{
    type: String
  }],
  imageTwo: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  maxUses: {
    type: Number,
    default: -1 // -1 means unlimited
  },
  usedCount: {
    type: Number,
    default: 0
  },
  minOrderValue: {
    type: Number,
    default: 0
  },
  applicableProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  applicableCategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  tags: [{
    type: String,
    trim: true
  }],
  conditions: {
    type: String,
    trim: true
  },
  terms: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller'
  }
}, {
  timestamps: true
});

// Index for better query performance
dealSchema.index({ isActive: 1, startDate: 1, endDate: 1 });
dealSchema.index({ category: 1 });
dealSchema.index({ brand: 1 });
dealSchema.index({ dealType: 1 });

// Virtual for calculating discount percentage
dealSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice > 0) {
    return Math.round(((this.originalPrice - this.dealPrice) / this.originalPrice) * 100);
  }
  return 0;
});

// Virtual for checking if deal is currently active
dealSchema.virtual('isCurrentlyActive').get(function() {
  const now = new Date();
  return this.isActive && 
         this.startDate <= now && 
         this.endDate >= now &&
         (this.maxUses === -1 || this.usedCount < this.maxUses);
});

// Pre-save middleware to auto-generate SKU and ID
dealSchema.pre('save', async function(next) {
  if (!this.sku) {
    this.sku = `DEAL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  if (!this.id) {
    const lastDeal = await this.constructor.findOne({}, {}, { sort: { 'id': -1 } });
    this.id = lastDeal ? lastDeal.id + 1 : 1;
  }
  
  next();
});

// Method to increment usage count
dealSchema.methods.incrementUsage = function() {
  if (this.maxUses === -1 || this.usedCount < this.maxUses) {
    this.usedCount += 1;
    return this.save();
  }
  return Promise.reject(new Error('Deal usage limit exceeded'));
};

// Static method to get active deals
dealSchema.statics.getActiveDeals = function() {
  const now = new Date();
  return this.find({
    isActive: true,
    startDate: { $lte: now },
    endDate: { $gte: now },
    $or: [
      { maxUses: -1 },
      { $expr: { $lt: ['$usedCount', '$maxUses'] } }
    ]
  }).populate('applicableProducts').populate('applicableCategories');
};

module.exports = mongoose.model('Deal', dealSchema); 