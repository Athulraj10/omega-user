const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
    product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true 
    },
    quantity: { 
        type: Number, 
        default: 1, 
        min: 1 
    },
    // Store product details for quick access and price calculations
    productName: { 
        type: String 
    },
    productPrice: { 
        type: Number 
    },
    productDiscountPrice: { 
        type: Number 
    },
    productImage: { 
        type: String 
    },
    productSku: { 
        type: String 
    },
    // Track availability and stock
    isAvailable: { 
        type: Boolean, 
        default: true 
    },
    stockAvailable: { 
        type: Number, 
        default: 0 
    },
    // Price calculations
    unitPrice: { 
        type: Number 
    },
    totalPrice: { 
        type: Number 
    },
    // Additional options
    selectedOptions: { 
        type: Map, 
        of: String 
    }, // For product variants like size, color, etc.
    addedAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
});

const CartSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
        index: true 
    },
    items: [CartItemSchema],
    // Cart totals
    subtotal: { 
        type: Number, 
        default: 0 
    },
    totalItems: { 
        type: Number, 
        default: 0 
    },
    // Cart metadata
    isActive: { 
        type: Boolean, 
        default: true 
    },
    lastUpdated: { 
        type: Date, 
        default: Date.now 
    },
    // Session tracking
    sessionId: { 
        type: String 
    },
    // Coupon/discount tracking
    appliedCoupon: {
        code: { type: String },
        discountAmount: { type: Number, default: 0 },
        discountType: { type: String, enum: ['percentage', 'fixed'], default: 'fixed' }
    },
    // Shipping information
    shippingAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address'
    },
    // Notes
    notes: { 
        type: String, 
        maxLength: 500 
    }
}, {
    timestamps: true,
    collection: 'carts'
});

// Indexes for better query performance
CartSchema.index({ userId: 1, 'items.product': 1 });
CartSchema.index({ sessionId: 1 });

// Pre-save middleware to update totals
CartSchema.pre('save', function (next) {
    this.calculateTotals();
    this.lastUpdated = Date.now();
    next();
});

// Method to calculate cart totals
CartSchema.methods.calculateTotals = function() {
    this.totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
    this.subtotal = this.items.reduce((total, item) => {
        const itemTotal = (item.unitPrice || item.productPrice || 0) * item.quantity;
        return total + itemTotal;
    }, 0);
};

// Method to add product to cart
CartSchema.methods.addProduct = async function(productId, quantity = 1, productDetails = {}, options = {}) {
    // Check if product already exists
    const existingItem = this.items.find(item => 
        item.product.toString() === productId.toString()
    );
    
    if (existingItem) {
        // Update existing item
        existingItem.quantity += quantity;
        Object.assign(existingItem, productDetails);
        existingItem.updatedAt = Date.now();
    } else {
        // Add new item
        this.items.push({
            product: productId,
            quantity,
            ...productDetails,
            selectedOptions: options
        });
    }
    
    return this.save();
};

// Method to update product quantity
CartSchema.methods.updateQuantity = async function(productId, quantity) {
    const item = this.items.find(item => 
        item.product.toString() === productId.toString()
    );
    
    if (item) {
        if (quantity <= 0) {
            // Remove item if quantity is 0 or negative
            this.items = this.items.filter(item => 
                item.product.toString() !== productId.toString()
            );
        } else {
            item.quantity = quantity;
            item.updatedAt = Date.now();
        }
        return this.save();
    }
    
    throw new Error('Product not found in cart');
};

// Method to remove product from cart
CartSchema.methods.removeProduct = async function(productId) {
    this.items = this.items.filter(item => 
        item.product.toString() !== productId.toString()
    );
    return this.save();
};

// Method to clear cart
CartSchema.methods.clearCart = async function() {
    this.items = [];
    this.appliedCoupon = {};
    return this.save();
};

// Method to apply coupon
CartSchema.methods.applyCoupon = async function(couponCode, discountAmount, discountType = 'fixed') {
    this.appliedCoupon = {
        code: couponCode,
        discountAmount,
        discountType
    };
    return this.save();
};

// Method to remove coupon
CartSchema.methods.removeCoupon = async function() {
    this.appliedCoupon = {};
    return this.save();
};

// Method to get final total with discounts
CartSchema.methods.getFinalTotal = function() {
    let finalTotal = this.subtotal;
    
    if (this.appliedCoupon.discountAmount) {
        if (this.appliedCoupon.discountType === 'percentage') {
            finalTotal -= (this.subtotal * this.appliedCoupon.discountAmount / 100);
        } else {
            finalTotal -= this.appliedCoupon.discountAmount;
        }
    }
    
    return Math.max(0, finalTotal);
};

// Static method to find or create cart for user
CartSchema.statics.findOrCreateForUser = async function(userId, sessionId = null) {
    let cart = await this.findOne({ userId });
    
    if (!cart) {
        cart = new this({ 
            userId, 
            sessionId 
        });
        await cart.save();
    }
    
    return cart;
};

// Static method to merge guest cart with user cart
CartSchema.statics.mergeGuestCart = async function(guestCartId, userId) {
    const guestCart = await this.findById(guestCartId);
    const userCart = await this.findOrCreateForUser(userId);
    
    if (guestCart && guestCart.items.length > 0) {
        for (const item of guestCart.items) {
            await userCart.addProduct(
                item.product, 
                item.quantity, 
                {
                    productName: item.productName,
                    productPrice: item.productPrice,
                    productDiscountPrice: item.productDiscountPrice,
                    productImage: item.productImage,
                    productSku: item.productSku,
                    unitPrice: item.unitPrice,
                    selectedOptions: item.selectedOptions
                }
            );
        }
        
        // Delete guest cart after merging
        await this.findByIdAndDelete(guestCartId);
    }
    
    return userCart;
};

module.exports = mongoose.model('Cart', CartSchema);
