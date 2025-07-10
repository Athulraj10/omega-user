# Dynamic Data Integration Guide

This guide explains how to use the new dynamic data system that integrates with your backend API using Redux Saga.

## Overview

The application has been updated to use dynamic data from your backend API instead of static data. The system includes:

- **API Service Layer**: Centralized API calls
- **Redux Saga**: Handles async operations and side effects
- **Dynamic Components**: Components that fetch and display data from the API
- **Loading States**: Proper loading indicators
- **Error Handling**: Comprehensive error handling

## API Configuration

### Base URL Setup

Update the API base URL in `src/services/api.ts`:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
```

Add to your `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Available API Endpoints

The system is configured to work with these backend endpoints:

#### Products
- `GET /api/products` - Get all products
- `GET /api/products/featured` - Get featured products
- `GET /api/products/trending` - Get trending products
- `GET /api/products/search?q={query}` - Search products
- `GET /api/products/categories` - Get product categories
- `GET /api/products/brands` - Get product brands

#### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/{productId}` - Update cart item quantity
- `DELETE /api/cart/remove/{productId}` - Remove item from cart
- `DELETE /api/cart/clear` - Clear cart

#### Wishlist
- `GET /api/wishlist` - Get user wishlist
- `POST /api/wishlist/add` - Add item to wishlist
- `DELETE /api/wishlist/remove/{productId}` - Remove item from wishlist

#### Authentication
- `POST /api/authentication/login` - User login
- `POST /api/authentication/registration` - User registration
- `GET /api/authentication/user_detail` - Get user profile

## Using Dynamic Components

### 1. DynamicProductList Component

Displays all products from the API:

```tsx
import DynamicProductList from '@/components/product-list/DynamicProductList';

// In your component
<DynamicProductList title="All Products" />
```

### 2. FeaturedProducts Component

Displays featured products:

```tsx
import FeaturedProducts from '@/components/product-list/FeaturedProducts';

// In your component
<FeaturedProducts />
```

### 3. SearchProducts Component

Provides search functionality:

```tsx
import SearchProducts from '@/components/search/SearchProducts';

// In your component
<SearchProducts />
```

## Manual Data Fetching

### Using Action Creators

You can manually dispatch actions to fetch data:

```tsx
import { useDispatch } from 'react-redux';
import { 
  fetchProductsRequest, 
  fetchFeaturedProductsRequest,
  searchProductsRequest 
} from '@/store/actions';

const dispatch = useDispatch();

// Fetch all products
dispatch(fetchProductsRequest());

// Fetch featured products
dispatch(fetchFeaturedProductsRequest());

// Search products
dispatch(searchProductsRequest('search term'));
```

### Using Selectors

Access data from the Redux store:

```tsx
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

const { products, loading, error } = useSelector((state: RootState) => state.product);
const { featuredProducts } = useSelector((state: RootState) => state.product);
const { searchResults, searchLoading, searchError } = useSelector((state: RootState) => state.product);
```

## State Management

### Product State

```typescript
interface ProductState {
  products: Product[];
  featuredProducts: Product[];
  searchResults: Product[];
  loading: boolean;
  error: string | null;
  searchLoading: boolean;
  searchError: string | null;
}
```

### Cart State

```typescript
interface CartState {
  items: Item[];
  orders: object[];
  isSwitchOn: boolean;
  loading: boolean;
  error: string | null;
}
```

### Wishlist State

```typescript
interface WishlistState {
  wishlist: Item[];
  loading: boolean;
  error: string | null;
}
```

## Error Handling

The system includes comprehensive error handling:

1. **API Errors**: Network errors and server errors are caught and displayed
2. **Loading States**: Components show loading indicators during API calls
3. **Empty States**: Components handle cases where no data is returned
4. **Retry Mechanisms**: Users can retry failed operations

## Customization

### Adding New API Endpoints

1. Add the endpoint to `src/services/api.ts`:

```typescript
export const productAPI = {
  // ... existing endpoints
  getNewEndpoint: (params?: any) => apiCall(`/api/products/new-endpoint${params ? `?${new URLSearchParams(params).toString()}` : ''}`),
};
```

2. Add action types in `src/store/actions/types.ts`:

```typescript
export const FETCH_NEW_DATA_REQUEST = 'FETCH_NEW_DATA_REQUEST';
export const FETCH_NEW_DATA_SUCCESS = 'FETCH_NEW_DATA_SUCCESS';
export const FETCH_NEW_DATA_FAILURE = 'FETCH_NEW_DATA_FAILURE';
```

3. Add action creators in `src/store/actions/index.ts`:

```typescript
export const fetchNewDataRequest = (params?: any) => ({
  type: types.FETCH_NEW_DATA_REQUEST,
  payload: params,
});

export const fetchNewDataSuccess = (data: any) => ({
  type: types.FETCH_NEW_DATA_SUCCESS,
  payload: data,
});

export const fetchNewDataFailure = (error: string) => ({
  type: types.FETCH_NEW_DATA_FAILURE,
  payload: error,
});
```

4. Update the reducer to handle the new actions
5. Create a saga to handle the API call
6. Add the saga to the root saga

### Styling Components

All dynamic components use Bootstrap classes and can be customized with CSS:

```css
.featured-products {
  background-color: #f8f9fa;
}

.search-products .input-group {
  max-width: 500px;
  margin: 0 auto;
}
```

## Testing

### Testing API Integration

1. Start your backend server
2. Ensure the API endpoints are working
3. Check the browser's Network tab to verify API calls
4. Test error scenarios by temporarily disabling the backend

### Testing Components

```tsx
// Test loading state
// Test error state
// Test empty state
// Test successful data display
```

## Troubleshooting

### Common Issues

1. **API Connection Errors**: Check the API base URL and ensure the backend is running
2. **CORS Issues**: Ensure your backend has proper CORS configuration
3. **Authentication Errors**: Check if the user is authenticated for protected endpoints
4. **Data Format Issues**: Ensure the API returns data in the expected format

### Debug Tips

1. Check the Redux DevTools to see state changes
2. Monitor the Network tab in browser dev tools
3. Check the console for error messages
4. Verify API responses match the expected data structure

## Migration from Static Data

If you have components using static data, update them:

### Before (Static Data)
```tsx
import { productall } from '@/utility/data/productall';

const products = productall;
```

### After (Dynamic Data)
```tsx
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

const { products, loading, error } = useSelector((state: RootState) => state.product);
```

## Performance Considerations

1. **Caching**: Redux Persist caches data in localStorage
2. **Loading States**: Prevent multiple simultaneous API calls
3. **Error Boundaries**: Implement error boundaries for better error handling
4. **Pagination**: Consider implementing pagination for large datasets

## Next Steps

1. **Implement Pagination**: Add pagination for product lists
2. **Add Filters**: Implement product filtering by category, price, etc.
3. **Real-time Updates**: Add WebSocket support for real-time updates
4. **Offline Support**: Implement offline functionality with service workers
5. **Advanced Search**: Add advanced search with filters and sorting 