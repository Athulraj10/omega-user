# API Troubleshooting Guide

## 🔍 **Debugging Steps**

### **1. Check Backend Server**
Make sure your backend server is running on port 8000:

```bash
# In backend directory
cd backend
npm start
# or
node index.js
```

**Expected output:**
```
Server running on port 8000
```

### **2. Test Backend Directly**
Test if backend is accessible:

```bash
curl http://localhost:8000/api/v1/cart
```

### **3. Check Frontend API Routes**
Test Next.js API routes:

```bash
# Test basic route
curl http://localhost:3000/api/test

# Test cart route (if authenticated)
curl http://localhost:3000/api/cart
```

### **4. Use Debug Component**
Add the CartDebug component to your page and click "Test API Routes":

```tsx
import CartDebug from '../components/debug/CartDebug';

// Add to your component
{process.env.NODE_ENV === 'development' && <CartDebug />}
```

### **5. Check Browser Network Tab**
1. Open DevTools → Network tab
2. Look for requests to `/api/*`
3. Check status codes and response data

### **6. Check Console Logs**
Look for these logs in the browser console:
- "Getting cart data"
- "Backend response status:"
- "Cart data from backend:"

## 🚨 **Common Issues**

### **Issue 1: Backend Not Running**
**Symptoms:** 500 errors, connection refused
**Solution:** Start backend server on port 8000

### **Issue 2: CORS Errors**
**Symptoms:** CORS policy errors in console
**Solution:** API routes should handle this automatically

### **Issue 3: Authentication Issues**
**Symptoms:** 401 errors, "Unauthorized"
**Solution:** Check if user is logged in and token is valid

### **Issue 4: Wrong API Endpoints**
**Symptoms:** 404 errors
**Solution:** Make sure using `/api/cart` not `/api/v1/cart`

### **Issue 5: Environment Variables**
**Symptoms:** Backend URL issues
**Solution:** Check `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🔧 **Quick Fixes**

### **Fix 1: Restart Both Servers**
```bash
# Backend
cd backend && npm start

# Frontend (in another terminal)
cd front-end && npm run dev
```

### **Fix 2: Clear Browser Cache**
- Hard refresh: `Ctrl+Shift+R`
- Clear browser cache
- Check incognito mode

### **Fix 3: Check Ports**
- Backend: `http://localhost:8000`
- Frontend: `http://localhost:3000`

### **Fix 4: Verify API Routes**
Check these files exist:
- `src/app/api/cart/route.ts`
- `src/app/api/cart/add/route.ts`
- `src/app/api/cart/remove/[productId]/route.ts`
- `src/app/api/cart/update/[productId]/route.ts`
- `src/app/api/cart/count/route.ts`

## 📊 **Expected API Flow**

```
1. Frontend calls /api/cart
2. Next.js receives request
3. Next.js calls http://localhost:8000/api/v1/cart
4. Backend processes request
5. Backend returns response
6. Next.js forwards response to frontend
```

## 🎯 **Testing Checklist**

- [ ] Backend server running on port 8000
- [ ] Frontend server running on port 3000
- [ ] User is authenticated
- [ ] Token is valid
- [ ] API routes are accessible
- [ ] No CORS errors
- [ ] Network requests show correct endpoints
- [ ] Console logs show successful responses

## 🚀 **Next Steps**

1. **Click "Test API Routes"** in CartDebug component
2. **Check console output** for any errors
3. **Verify backend is running** on port 8000
4. **Test with real product IDs** from your database
5. **Monitor network requests** in browser DevTools

If you're still having issues, please share:
- Console error messages
- Network tab screenshots
- Backend server status
- Any error responses from API calls 