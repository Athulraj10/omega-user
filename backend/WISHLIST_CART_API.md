# Wishlist and Cart Management API

This document describes the enhanced wishlist and cart management system with improved user management, product tracking, and additional features.

## Schema Structure

### Wishlist Schema

The wishlist schema has been enhanced to provide better user management and product tracking:

```javascript
const WishlistItemSchema = {
    product: ObjectId,           // Reference to Product
    addedAt: Date,              // When item was added
    productName: String,        // Cached product name
    productPrice: Number,       // Cached product price
    productImage: String,       // Cached product image
    productSku: String,         // Cached product SKU
    isAvailable: Boolean        // Product availability status
}

const WishlistSchema = {
    userId: ObjectId,           // Reference to User (indexed)
    items: [WishlistItemSchema], // Array of wishlist items
    totalItems: Number,         // Total number of items
    lastUpdated: Date,          // Last update timestamp
    isActive: Boolean,          // Wishlist status
    notes: String               // Optional notes
}
```

### Cart Schema

The cart schema has been enhanced with comprehensive cart management features:

```javascript
const CartItemSchema = {
    product: ObjectId,          // Reference to Product
    quantity: Number,           // Item quantity
    productName: String,        // Cached product name
    productPrice: Number,       // Cached product price
    productDiscountPrice: Number, // Cached discount price
    productImage: String,       // Cached product image
    productSku: String,         // Cached product SKU
    isAvailable: Boolean,       // Product availability
    stockAvailable: Number,     // Available stock
    unitPrice: Number,          // Current unit price
    totalPrice: Number,         // Item total price
    selectedOptions: Map,       // Product variants (size, color, etc.)
    addedAt: Date,             // When added to cart
    updatedAt: Date            // Last update
}

const CartSchema = {
    userId: ObjectId,           // Reference to User (indexed)
    items: [CartItemSchema],    // Array of cart items
    subtotal: Number,           // Cart subtotal
    totalItems: Number,         // Total number of items
    isActive: Boolean,          // Cart status
    lastUpdated: Date,          // Last update timestamp
    sessionId: String,          // Session tracking
    appliedCoupon: {            // Coupon information
        code: String,
        discountAmount: Number,
        discountType: String    // 'percentage' or 'fixed'
    },
    shippingAddress: ObjectId,  // Reference to Address
    notes: String               // Optional notes
}
```

## API Endpoints

### Wishlist Endpoints

#### 1. Get User's Wishlist
```
GET /api/wishlist
Authorization: Bearer <token>
```

**Response:**
```json
{
    "success": true,
    "data": {
        "items": [
            {
                "id": "product_id",
                "title": "Product Name",
                "image": "image_url",
                "imageTwo": "second_image_url",
                "newPrice": 99.99,
                "oldPrice": 129.99,
                "date": "2024-01-01T00:00:00.000Z",
                "rating": 4.5,
                "status": "Available",
                "weight": "1 pcs",
                "location": "Online",
                "brand": "Brand Name",
                "sku": "SKU123",
                "category": "category_id",
                "isAvailable": true,
                "productName": "Product Name",
                "productPrice": 129.99,
                "productImage": "image_url",
                "productSku": "SKU123"
            }
        ],
        "totalItems": 5,
        "lastUpdated": "2024-01-01T00:00:00.000Z"
    },
    "message": "Wishlist fetched successfully"
}
```

#### 2. Add Product to Wishlist
```
POST /api/wishlist/add
Authorization: Bearer <token>
Content-Type: application/json

{
    "productId": "product_id"
}
```

#### 3. Remove Product from Wishlist
```
DELETE /api/wishlist/remove/:productId
Authorization: Bearer <token>
```

#### 4. Clear Wishlist
```
DELETE /api/wishlist/clear
Authorization: Bearer <token>
```

#### 5. Check Wishlist Status
```
GET /api/wishlist/check/:productId
Authorization: Bearer <token>
```

**Response:**
```json
{
    "success": true,
    "data": {
        "isInWishlist": true
    },
    "message": "Wishlist status checked"
}
```

#### 6. Get Wishlist Count
```
GET /api/wishlist/count
Authorization: Bearer <token>
```

**Response:**
```json
{
    "success": true,
    "data": {
        "count": 5
    },
    "message": "Wishlist count fetched"
}
```

#### 7. Move Item to Cart
```
POST /api/wishlist/move-to-cart
Authorization: Bearer <token>
Content-Type: application/json

{
    "productId": "product_id"
}
```

### Cart Endpoints

#### 1. Get User's Cart
```
GET /api/cart
Authorization: Bearer <token>
```

**Response:**
```json
{
    "success": true,
    "data": {
        "items": [
            {
                "id": "product_id",
                "title": "Product Name",
                "image": "image_url",
                "imageTwo": "second_image_url",
                "newPrice": 99.99,
                "oldPrice": 129.99,
                "date": "2024-01-01T00:00:00.000Z",
                "rating": 4.5,
                "status": "Available",
                "weight": "1 pcs",
                "location": "Online",
                "brand": "Brand Name",
                "sku": "SKU123",
                "category": "category_id",
                "quantity": 2,
                "unitPrice": 99.99,
                "totalPrice": 199.98,
                "isAvailable": true,
                "stockAvailable": 10,
                "selectedOptions": {
                    "size": "L",
                    "color": "Blue"
                }
            }
        ],
        "subtotal": 199.98,
        "totalItems": 2,
        "finalTotal": 189.98,
        "appliedCoupon": {
            "code": "SAVE10",
            "discountAmount": 10,
            "discountType": "fixed"
        },
        "lastUpdated": "2024-01-01T00:00:00.000Z"
    },
    "message": "Cart fetched successfully"
}
```

#### 2. Add Item to Cart
```
POST /api/cart/add
Authorization: Bearer <token>
Content-Type: application/json

{
    "productId": "product_id",
    "quantity": 2,
    "options": {
        "size": "L",
        "color": "Blue"
    }
}
```

#### 3. Update Cart Item Quantity
```
PUT /api/cart/update/:productId
Authorization: Bearer <token>
Content-Type: application/json

{
    "quantity": 3
}
```

#### 4. Remove Item from Cart
```
DELETE /api/cart/remove/:productId
Authorization: Bearer <token>
```

#### 5. Clear Cart
```
DELETE /api/cart/clear
Authorization: Bearer <token>
```

#### 6. Apply Coupon
```
POST /api/cart/apply-coupon
Authorization: Bearer <token>
Content-Type: application/json

{
    "couponCode": "SAVE10",
    "discountAmount": 10,
    "discountType": "fixed"
}
```

#### 7. Remove Coupon
```
DELETE /api/cart/remove-coupon
Authorization: Bearer <token>
```

#### 8. Get Cart Count
```
GET /api/cart/count
Authorization: Bearer <token>
```

**Response:**
```json
{
    "success": true,
    "data": {
        "count": 3
    },
    "message": "Cart count fetched"
}
```

#### 9. Merge Guest Cart
```
POST /api/cart/merge-guest
Authorization: Bearer <token>
Content-Type: application/json

{
    "guestCartId": "guest_cart_id"
}
```

## Key Features

### 1. User Management
- Each user has their own wishlist and cart
- Automatic creation of wishlist/cart on first use
- User authentication required for all operations

### 2. Product Tracking
- Cached product details for quick access
- Real-time availability checking
- Stock tracking and validation

### 3. Cart Features
- Automatic total calculations
- Coupon/discount support
- Product variant support (size, color, etc.)
- Guest cart merging functionality

### 4. Wishlist Features
- Product availability tracking
- Move to cart functionality
- Wishlist count for UI badges

### 5. Performance Optimizations
- Database indexes on frequently queried fields
- Cached product information
- Efficient query patterns

## Error Handling

All endpoints return consistent error responses:

```json
{
    "success": false,
    "message": "Error description"
}
```

Common error scenarios:
- Invalid product ID
- Insufficient stock
- Product not found
- User not authenticated
- Invalid quantity

## Database Indexes

The following indexes are created for optimal performance:

```javascript
// Wishlist indexes
WishlistSchema.index({ userId: 1, 'items.product': 1 });

// Cart indexes
CartSchema.index({ userId: 1, 'items.product': 1 });
CartSchema.index({ sessionId: 1 });
```

## Usage Examples

### Frontend Integration

```javascript
// Add to wishlist
const addToWishlist = async (productId) => {
    const response = await fetch('/api/wishlist/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId })
    });
    return response.json();
};

// Add to cart
const addToCart = async (productId, quantity, options) => {
    const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantity, options })
    });
    return response.json();
};

// Get cart count for badge
const getCartCount = async () => {
    const response = await fetch('/api/cart/count', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await response.json();
    return data.data.count;
};
```

This enhanced system provides a robust foundation for e-commerce wishlist and cart management with improved user experience and performance. 