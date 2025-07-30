# Multiple API Calls Fix - Updated Implementation

## Problem
The application was making multiple duplicate API calls to the same endpoints (`/api/cart`, `/api/wishlist`, `/api/categories`, `/api/deal`) because multiple components were using the same hooks independently, each making their own API requests.

## Root Cause
1. **Header component** uses `useCartWishlist` hook
2. **Category component** uses `useCategories` hook  
3. **Deal component** makes direct API calls
4. **Multiple components** use the same hooks simultaneously
5. Each instance of these hooks was making independent API calls

## Solution Implemented

### 1. Direct API Calls with Global State Management
- **useCartWishlist**: Uses direct fetch calls to `/api/` endpoints with global state to prevent duplicate calls
- **useCategories**: Uses direct fetch calls to `/api/` endpoints with global state to prevent duplicate calls
- **Deal Component**: Uses direct fetch calls to `/api/deal` endpoint
- Global state management prevents multiple instances from making duplicate calls

### 2. Global State Management
- **Global Variables**: Shared state across hook instances
- **Request Deduplication**: If a request is already in progress, subsequent calls wait for the existing request
- **Cache Management**: Configurable cache timeouts for different types of data

### 3. Cache Management
- **Cart/Wishlist**: 30-second cache (frequently changing data)
- **Categories**: 5-minute cache (static data)
- **Deals**: Direct API calls (no caching)
- Automatic cache invalidation on data modifications

### 4. Request Deduplication
- If a request is already in progress, subsequent calls wait for the existing request
- Prevents race conditions and duplicate network requests

## Key Features

### Hook Features
```typescript
// Global state prevents duplicate calls
let globalCartData: any = null;
let globalCartPromise: Promise<any> | null = null;
let globalWishlistData: any = null;
let globalWishlistPromise: Promise<any> | null = null;
let globalCategories: any[] = [];
let globalCategoriesPromise: Promise<any> | null = null;

// Cache utility functions
export const clearGlobalCartWishlistCache = () => {
  globalCartData = null;
  globalWishlistData = null;
  globalCartPromise = null;
  globalWishlistPromise = null;
  // ... clear other global state
};

export const clearGlobalCategoriesCache = () => {
  globalCategories = [];
  globalCategoriesPromise = null;
  // ... clear other global state
};
```

### Direct API Calls
```typescript
// Cart API calls
fetch('/api/cart', {
  headers: { 'Authorization': `Bearer ${userToken}` }
});

fetch('/api/cart/add', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userToken}` },
  body: JSON.stringify({ productId, quantity })
});

// Wishlist API calls
fetch('/api/wishlist', {
  headers: { 'Authorization': `Bearer ${userToken}` }
});

fetch('/api/wishlist/add', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userToken}` },
  body: JSON.stringify({ productId })
});

// Categories API calls
fetch('/api/categories');
fetch('/api/categories/count');
fetch(`/api/categories/${id}`);

// Deal API calls
fetch('/api/deal', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' }
});
```

## Benefits

1. **Reduced Network Traffic**: Eliminates duplicate API calls
2. **Better Performance**: Faster page loads with cached data
3. **Improved User Experience**: Consistent data across components
4. **Better Error Handling**: Centralized error management
5. **Easier Maintenance**: Direct API calls are easier to understand and debug
6. **No External Dependencies**: No need for centralized API service

## Usage

### Before (Multiple API Calls)
```typescript
// Header component
const { cartData } = useCartWishlist(); // Makes API call

// Cart component  
const { cartData } = useCartWishlist(); // Makes another API call

// Wishlist component
const { wishlistData } = useCartWishlist(); // Makes another API call
```

### After (Single API Call)
```typescript
// Header component
const { cartData } = useCartWishlist(); // Makes API call

// Cart component  
const { cartData } = useCartWishlist(); // Uses cached data

// Wishlist component
const { wishlistData } = useCartWishlist(); // Uses cached data
```

### Using useEffect for Side Effects
```typescript
import { useEffect } from 'react';
import { useCartWishlist } from '../hooks/useCartWishlist';
import { useCategories } from '../hooks/useCategories';

const MyComponent = () => {
  const { cartData, wishlistData } = useCartWishlist();
  const { categories } = useCategories();

  // useEffect to handle side effects when data changes
  useEffect(() => {
    console.log('Cart data updated:', cartData);
    // Perform additional actions when cart data changes
  }, [cartData]);

  useEffect(() => {
    console.log('Wishlist data updated:', wishlistData);
    // Perform additional actions when wishlist data changes
  }, [wishlistData]);

  useEffect(() => {
    console.log('Categories data updated:', categories);
    // Perform additional actions when categories data changes
  }, [categories]);

  return (
    <div>
      {/* Your component JSX */}
    </div>
  );
};
```

## Monitoring

The solution includes comprehensive logging to monitor API calls:
- `console.log("Fetching cart data...")` - New requests
- `console.log("Cart API response:", result)` - API responses
- `console.log("Cart data received:", data)` - Processed data

## Testing

To verify the fix is working:
1. Open browser developer tools
2. Navigate to the Network tab
3. Refresh the page
4. You should see only one request per endpoint instead of multiple

## Example Component

See `src/components/examples/HookUsageExample.tsx` for a complete example of how to use the hooks with useEffect.

## Future Improvements

1. **React Query Integration**: Consider using React Query for more advanced caching
2. **WebSocket Integration**: Real-time updates for cart/wishlist changes
3. **Offline Support**: Cache data for offline usage
4. **Background Sync**: Sync data when connection is restored
5. **Error Boundaries**: Better error handling with React Error Boundaries