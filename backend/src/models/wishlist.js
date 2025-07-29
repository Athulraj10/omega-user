const mongoose = require('mongoose');

const WishlistItemSchema = new mongoose.Schema({
    product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true 
    },
    addedAt: { 
        type: Date, 
        default: Date.now 
    },
    // Store some product details for quick access
    productName: { 
        type: String 
    },
    productPrice: { 
        type: Number 
    },
    productImage: { 
        type: String 
    },
    productSku: { 
        type: String 
    },
    // Track if product is still available
    isAvailable: { 
        type: Boolean, 
        default: true 
    }
});

const WishlistSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
        index: true 
    },
    items: [WishlistItemSchema],
    totalItems: { 
        type: Number, 
        default: 0 
    },
    lastUpdated: { 
        type: Date, 
        default: Date.now 
    },
    // Track wishlist metadata
    isActive: { 
        type: Boolean, 
        default: true 
    },
    notes: { 
        type: String, 
        maxLength: 500 
    }
}, {
    timestamps: true,
    collection: 'wishlists'
});

// Index for better query performance
WishlistSchema.index({ userId: 1, 'items.product': 1 });

// Pre-save middleware to update totalItems
WishlistSchema.pre('save', function (next) {
    this.totalItems = this.items.length;
    this.lastUpdated = Date.now();
    next();
});

// Method to add product to wishlist
WishlistSchema.methods.addProduct = async function(productId, productDetails = {}) {
    // Check if product already exists
    const existingItem = this.items.find(item => 
        item.product.toString() === productId.toString()
    );
    
    if (existingItem) {
        // Update existing item
        Object.assign(existingItem, productDetails);
        existingItem.addedAt = Date.now();
    } else {
        // Add new item
        this.items.push({
            product: productId,
            ...productDetails
        });
    }
    
    return this.save();
};

// Method to remove product from wishlist
WishlistSchema.methods.removeProduct = async function(productId) {
    this.items = this.items.filter(item => 
        item.product.toString() !== productId.toString()
    );
    return this.save();
};

// Method to clear wishlist
WishlistSchema.methods.clearWishlist = async function() {
    this.items = [];
    return this.save();
};

// Static method to find or create wishlist for user
WishlistSchema.statics.findOrCreateForUser = async function(userId) {
    let wishlist = await this.findOne({ userId });
    
    if (!wishlist) {
        wishlist = new this({ userId });
        await wishlist.save();
    }
    
    return wishlist;
};

module.exports = mongoose.model('Wishlist', WishlistSchema);
