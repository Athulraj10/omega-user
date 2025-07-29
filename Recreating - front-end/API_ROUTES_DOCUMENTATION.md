# Next.js API Routes Documentation

## Overview

This project now uses Next.js API routes (folder-based routing) to proxy requests to the backend server. All API calls go through Next.js routes first, which then forward the requests to the backend server running on `localhost:8000`.

## 🏗️ **API Route Structure**

### **Cart API Routes**

```
src/app/api/cart/
├── route.ts                    # GET - Get cart data
├── add/
│   └── route.ts               # POST - Add item to cart
├── remove/
│   └── [productId]/
│       └── route.ts           # DELETE - Remove item from cart
├── update/
│   └── [productId]/
│       └── route.ts           # PUT - Update cart item quantity
└── count/
    └── route.ts               # GET - Get cart count
```

### **Wishlist API Routes**

```
src/app/api/wishlist/
├── route.ts                    # GET - Get wishlist data
├── add/
│   └── route.ts               # POST - Add item to wishlist
├── remove/
│   └── [productId]/
│       └── route.ts           # DELETE - Remove item from wishlist
├── check/
│   └── [productId]/
│       └── route.ts           # GET - Check if item is in wishlist
└── count/
    └── route.ts               # GET - Get wishlist count
```

## 🔗 **API Endpoints**

### **Cart Endpoints**

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/cart` | Get user's cart | - | Cart data |
| POST | `/api/cart/add` | Add item to cart | `{ productId, quantity }` | Success message |
| PUT | `/api/cart/update/[productId]` | Update item quantity | `{ quantity }` | Success message |
| DELETE | `/api/cart/remove/[productId]` | Remove item from cart | - | Success message |
| GET | `/api/cart/count` | Get cart item count | - | Count data |

### **Wishlist Endpoints**

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/wishlist` | Get user's wishlist | - | Wishlist data |
| POST | `/api/wishlist/add` | Add item to wishlist | `{ productId }` | Success message |
| DELETE | `/api/wishlist/remove/[productId]` | Remove item from wishlist | - | Success message |
| GET | `/api/wishlist/check/[productId]` | Check wishlist status | - | Status data |
| GET | `/api/wishlist/count` | Get wishlist count | - | Count data |

## 🔧 **How It Works**

### **1. Frontend Request Flow**
```
Frontend Component → Next.js API Route → Backend Server → Database
```

### **2. Request Processing**
1. **Frontend** makes request to `/api/cart/add`
2. **Next.js** receives request in `src/app/api/cart/add/route.ts`
3. **Next.js** forwards request to backend at `http://localhost:8000/api/v1/cart/add`
4. **Backend** processes request and returns response
5. **Next.js** forwards response back to frontend

### **3. Authentication**
- All requests include `Authorization: Bearer <token>` header
- Next.js routes pass the token to the backend
- Backend validates the token and processes the request

## 📝 **Example Usage**

### **Adding to Cart**
```typescript
const response = await fetch('/api/cart/add', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${userToken}`
  },
  body: JSON.stringify({ 
    productId: '507f1f77bcf86cd799439011', 
    quantity: 2 
  })
});

const result = await response.json();
```

### **Getting Cart Data**
```typescript
const response = await fetch('/api/cart', {
  headers: {
    'Authorization': `Bearer ${userToken}`
  }
});

const cartData = await response.json();
```

### **Updating Cart Quantity**
```typescript
const response = await fetch('/api/cart/update/507f1f77bcf86cd799439011', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${userToken}`
  },
  body: JSON.stringify({ quantity: 3 })
});

const result = await response.json();
```

## 🛠️ **Configuration**

### **Backend URL Configuration**
The backend URL is configured in `src/lib/backend.ts`:

```typescript
const backend = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});
```

### **Environment Variables**
Create a `.env.local` file in the frontend root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🔍 **Debugging**

### **1. Check Network Tab**
- Open browser DevTools → Network tab
- Look for requests to `/api/cart/*` and `/api/wishlist/*`
- Check request/response status codes

### **2. Use Debug Component**
Add the CartDebug component to your page:

```tsx
import CartDebug from '../components/debug/CartDebug';

// Add this to your component
{process.env.NODE_ENV === 'development' && <CartDebug />}
```

### **3. Check Console Logs**
All API routes include console logging:

```typescript
console.log("Adding to cart:", body);
console.log("Backend response status:", status);
console.log("Cart data from backend:", data);
```

## 🚨 **Error Handling**

### **Common Error Responses**
```json
{
  "message": "Failed to add to cart",
  "status": 500
}
```

### **Authentication Errors**
```json
{
  "message": "Unauthorized",
  "status": 401
}
```

### **Validation Errors**
```json
{
  "message": "Product not found",
  "status": 404
}
```

## 📊 **Response Formats**

### **Cart Data Response**
```json
{
  "items": [
    {
      "id": "product_id",
      "title": "Product Name",
      "image": "image_url",
      "newPrice": 99.99,
      "oldPrice": 129.99,
      "quantity": 2,
      "weight": "1 pcs",
      "unitPrice": 99.99,
      "totalPrice": 199.98,
      "isAvailable": true,
      "stockAvailable": 10
    }
  ],
  "subtotal": 199.98,
  "totalItems": 2,
  "finalTotal": 199.98,
  "appliedCoupon": {
    "discountAmount": 0,
    "discountType": "fixed"
  },
  "lastUpdated": "2025-07-25T17:56:50.534Z"
}
```

### **Success Response**
```json
{
  "success": true,
  "message": "Product added to cart successfully",
  "data": { ... }
}
```

## 🔄 **State Management**

The `useCartWishlist` hook manages:
- Cart data state
- Loading states
- Wishlist items state
- Authentication status
- Error handling

## 🎯 **Benefits**

1. **Consistent API Structure**: All API calls follow the same pattern
2. **Centralized Error Handling**: Errors are handled consistently
3. **Easy Debugging**: Console logs help track request flow
4. **Type Safety**: TypeScript interfaces for all data structures
5. **Authentication**: Automatic token forwarding to backend
6. **CORS Handling**: No CORS issues since requests go through Next.js

## 🚀 **Next Steps**

1. **Test the API routes** using the debug component
2. **Add real product IDs** to test with actual data
3. **Monitor network requests** in browser DevTools
4. **Check backend logs** for any errors
5. **Verify authentication** is working correctly

The API routes are now properly set up and should resolve the 404 errors you were experiencing! 