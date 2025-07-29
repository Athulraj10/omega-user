# Cart Troubleshooting Guide

## Issue: Empty Cart Data

You're seeing this response:
```json
{
    "items": [],
    "subtotal": 0,
    "totalItems": 0,
    "finalTotal": 0,
    "appliedCoupon": {
        "discountAmount": 0,
        "discountType": "fixed"
    },
    "lastUpdated": "2025-07-25T17:56:50.534Z"
}
```

This means the cart is being created successfully but no items are being added. Let's troubleshoot step by step.

## 🔍 **Step-by-Step Debugging**

### 1. **Check Authentication**
First, verify that the user is properly authenticated:

```javascript
// In browser console, check:
console.log("Auth Status:", isAuthenticated);
console.log("Token:", userToken);
```

### 2. **Test API Endpoints Directly**
Test the cart API endpoints using browser dev tools or Postman:

```bash
# Get Cart
GET /api/v1/cart
Headers: Authorization: Bearer YOUR_TOKEN

# Add to Cart
POST /api/v1/cart/add
Headers: 
  Authorization: Bearer YOUR_TOKEN
  Content-Type: application/json
Body: {
  "productId": "ACTUAL_PRODUCT_ID",
  "quantity": 1
}
```

### 3. **Use the Debug Component**
Add the CartDebug component to your page temporarily:

```tsx
import CartDebug from '../components/debug/CartDebug';

// Add this to your component
{process.env.NODE_ENV === 'development' && <CartDebug />}
```

### 4. **Check Network Requests**
Open browser DevTools → Network tab and:
- Look for requests to `/api/v1/cart/*`
- Check if requests are being made
- Verify response status codes
- Check request/response headers

### 5. **Verify Backend Routes**
Ensure the backend routes are properly registered:

```javascript
// Check if these routes exist in your backend
GET    /api/v1/cart
POST   /api/v1/cart/add
PUT    /api/v1/cart/update/:productId
DELETE /api/v1/cart/remove/:productId
GET    /api/v1/cart/count
```

## 🐛 **Common Issues & Solutions**

### Issue 1: Wrong API Endpoints
**Problem**: Frontend calling `/api/cart` instead of `/api/v1/cart`

**Solution**: ✅ **FIXED** - Updated all endpoints to use `/api/v1/cart`

### Issue 2: Authentication Token Missing
**Problem**: User not logged in or token not being sent

**Solution**: 
```javascript
// Check Redux state
const authUser = useSelector((state: any) => state.registration.isAuthenticated);
const userToken = useSelector((state: any) => state.registration.token);
```

### Issue 3: Product ID Issues
**Problem**: Invalid or non-existent product ID

**Solution**: 
1. Get a valid product ID from your database
2. Test with a known product ID
3. Check if the product exists in the database

### Issue 4: CORS Issues
**Problem**: Frontend can't reach backend API

**Solution**: Check if backend is running and accessible

### Issue 5: Backend Middleware Issues
**Problem**: `userTokenAuth` middleware failing

**Solution**: Check backend logs for authentication errors

## 🧪 **Testing Steps**

### Step 1: Verify Backend is Running
```bash
# Check if backend is running on correct port
curl http://localhost:YOUR_BACKEND_PORT/api/v1/cart
```

### Step 2: Test Authentication
```bash
# Test login endpoint
curl -X POST http://localhost:YOUR_BACKEND_PORT/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

### Step 3: Test Cart Endpoints
```bash
# Get cart (should return empty cart initially)
curl -X GET http://localhost:YOUR_BACKEND_PORT/api/v1/cart \
  -H "Authorization: Bearer YOUR_TOKEN"

# Add to cart
curl -X POST http://localhost:YOUR_BACKEND_PORT/api/v1/cart/add \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productId":"VALID_PRODUCT_ID","quantity":1}'
```

## 🔧 **Quick Fixes**

### Fix 1: Update Product ID
Replace the test product ID in CartDebug with a real one:

```javascript
// In CartDebug.tsx, replace this:
const testProductId = "507f1f77bcf86cd799439011";

// With a real product ID from your database:
const testProductId = "YOUR_ACTUAL_PRODUCT_ID";
```

### Fix 2: Check Backend Logs
Look for errors in your backend console/logs when making cart requests.

### Fix 3: Verify Database Connection
Ensure your MongoDB connection is working and the Cart collection exists.

### Fix 4: Test with Postman
Use Postman to test the API endpoints directly and verify they work.

## 📊 **Expected Behavior**

### When Cart is Empty:
```json
{
    "success": true,
    "data": {
        "items": [],
        "subtotal": 0,
        "totalItems": 0,
        "finalTotal": 0,
        "appliedCoupon": {
            "discountAmount": 0,
            "discountType": "fixed"
        },
        "lastUpdated": "2025-07-25T17:56:50.534Z"
    },
    "message": "Cart fetched successfully"
}
```

### When Cart has Items:
```json
{
    "success": true,
    "data": {
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
    },
    "message": "Cart fetched successfully"
}
```

## 🚀 **Next Steps**

1. **Add the debug component** to see real-time cart status
2. **Test with a real product ID** from your database
3. **Check browser network tab** for API requests
4. **Verify backend logs** for any errors
5. **Test API endpoints directly** with Postman

## 📞 **If Issues Persist**

If you're still having issues after following these steps:

1. Check the browser console for JavaScript errors
2. Verify the backend is running and accessible
3. Ensure the user is properly authenticated
4. Test with a known working product ID
5. Check if the Cart collection exists in your MongoDB database

The cart system is now properly integrated with the correct API endpoints. The empty cart response you're seeing is actually correct behavior for a new cart - it just needs items to be added to it! 