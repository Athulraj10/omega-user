# Wishlist Redux Implementation

## Overview

This implementation provides a comprehensive Redux-based wishlist management system with full CRUD operations, including add, remove, clear all, and status checking functionality. It integrates with the backend API and provides persistent state management.

## Architecture

### 1. Redux Store Structure
```
store/
├── reducers/
│   └── wishlistSlice.ts            # Wishlist state management
├── actions/
│   └── wishlistActions.ts          # Async actions for API calls
└── index.ts                        # Store configuration with persistence
```

### 2. Hook Implementation
```
hooks/
└── useWishlistRedux.ts             # Redux-based wishlist hook
```

## Key Features

### ✅ **Complete CRUD Operations**
- **Create**: Add items to wishlist
- **Read**: Fetch wishlist items with pagination
- **Update**: Update existing wishlist items
- **Delete**: Remove individual items or clear all

### ✅ **Advanced State Management**
- Centralized wishlist state in Redux store
- Persistent storage with redux-persist
- Loading states for all operations
- Error handling with user feedback
- Cache management with timestamps

### ✅ **Async Actions with Thunk**
- `fetchWishlist()` - Fetch all wishlist items
- `addToWishlist(productId)` - Add item to wishlist
- `removeFromWishlist(productId)` - Remove item from wishlist
- `clearAllWishlist()` - Clear all wishlist items
- `checkWishlistStatus(productId)` - Check if item is in wishlist
- `refreshWishlist()` - Force refresh data
- `clearWishlistCache()` - Clear cache
- `resetWishlist()` - Reset state

### ✅ **Request Deduplication & Caching**
- Prevents multiple API calls for the same data
- Global promise management
- Cache validation (5-minute cache)
- Optimistic updates for better UX

### ✅ **Authentication Integration**
- Automatic token management
- User authentication checks
- Secure API calls with Bearer tokens

## Implementation Details

### Wishlist Slice (`wishlistSlice.ts`)
```typescript
export interface WishlistState {
  items: WishlistItem[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
  addingItem: boolean;
  removingItem: boolean;
  clearingWishlist: boolean;
}

// Actions:
- setLoading(boolean)
- setError(string | null)
- setWishlistData(WishlistData)
- setWishlistFromAPI(WishlistResponse)
- clearWishlist()
- addItemToWishlist(WishlistItem)
- removeItemFromWishlist(string)
- setAddingItem(boolean)
- setRemovingItem(boolean)
- setClearingWishlist(boolean)
- resetWishlistState()
```

### Wishlist Actions (`wishlistActions.ts`)
```typescript
// Async thunks:
- fetchWishlist() - Fetch all wishlist items
- addToWishlist(productId) - Add item to wishlist
- removeFromWishlist(productId) - Remove item from wishlist
- clearAllWishlist() - Clear all items
- checkWishlistStatus(productId) - Check item status
- refreshWishlist() - Force refresh
- clearWishlistCache() - Clear cache
- resetWishlist() - Reset state
```

### Redux Hook (`useWishlistRedux.ts`)
```typescript
interface UseWishlistReduxReturn {
  items: WishlistItem[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
  addingItem: boolean;
  removingItem: boolean;
  clearingWishlist: boolean;
  fetchWishlist: () => Promise<any>;
  addToWishlist: (productId: string) => Promise<any>;
  removeFromWishlist: (productId: string) => Promise<any>;
  clearAllWishlist: () => Promise<any>;
  checkWishlistStatus: (productId: string) => Promise<boolean>;
  refreshWishlist: () => Promise<any>;
  clearCache: () => void;
  resetState: () => void;
  isItemInWishlist: (productId: string) => boolean;
  getWishlistCount: () => number;
}
```

## Usage Examples

### Basic Usage in Component
```typescript
import { useWishlistRedux } from '@/hooks/useWishlistRedux';

const MyComponent = () => {
  const { 
    items, 
    loading, 
    error, 
    addToWishlist, 
    removeFromWishlist,
    isItemInWishlist 
  } = useWishlistRedux();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {items.map(item => (
        <div key={item.id}>
          <h3>{item.title}</h3>
          <p>${item.price}</p>
          <button onClick={() => removeFromWishlist(item.id)}>
            Remove from Wishlist
          </button>
        </div>
      ))}
    </div>
  );
};
```

### Add/Remove Functionality
```typescript
const ProductCard = ({ product }) => {
  const { 
    addToWishlist, 
    removeFromWishlist, 
    isItemInWishlist,
    addingItem,
    removingItem 
  } = useWishlistRedux();

  const isInWishlist = isItemInWishlist(product.id);

  const handleWishlistToggle = async () => {
    if (isInWishlist) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product.id);
    }
  };

  return (
    <div>
      <h3>{product.title}</h3>
      <button 
        onClick={handleWishlistToggle}
        disabled={addingItem || removingItem}
      >
        {addingItem ? 'Adding...' : removingItem ? 'Removing...' : 
         isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
      </button>
    </div>
  );
};
```

### With useEffect for Side Effects
```typescript
import { useEffect } from 'react';
import { useWishlistRedux } from '@/hooks/useWishlistRedux';

const WishlistPage = () => {
  const { 
    items, 
    loading, 
    error, 
    lastFetched,
    clearAllWishlist,
    clearingWishlist 
  } = useWishlistRedux();

  useEffect(() => {
    console.log('Wishlist items updated:', items);
  }, [items]);

  useEffect(() => {
    if (error) {
      console.error('Wishlist error:', error);
    }
  }, [error]);

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to clear all items?')) {
      await clearAllWishlist();
    }
  };

  return (
    <div>
      <h2>My Wishlist ({items.length} items)</h2>
      
      {items.length > 0 && (
        <button 
          onClick={handleClearAll}
          disabled={clearingWishlist}
        >
          {clearingWishlist ? 'Clearing...' : 'Clear All Items'}
        </button>
      )}
      
      {/* Wishlist items */}
    </div>
  );
};
```

### Status Checking
```typescript
const ProductGrid = ({ products }) => {
  const { 
    checkWishlistStatus,
    isItemInWishlist 
  } = useWishlistRedux();

  const handleCheckStatus = async (productId: string) => {
    const isInWishlist = await checkWishlistStatus(productId);
    console.log(`Product ${productId} is in wishlist:`, isInWishlist);
  };

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.title}</h3>
          <p>In Wishlist: {isItemInWishlist(product.id) ? 'Yes' : 'No'}</p>
          <button onClick={() => handleCheckStatus(product.id)}>
            Check Status
          </button>
        </div>
      ))}
    </div>
  );
};
```

### Advanced Management
```typescript
const WishlistManager = () => {
  const {
    items,
    totalItems,
    loading,
    error,
    refreshWishlist,
    clearCache,
    resetState,
    getWishlistCount
  } = useWishlistRedux();

  const handleRefresh = async () => {
    await refreshWishlist();
  };

  const handleClearCache = () => {
    clearCache();
    console.log('Cache cleared');
  };

  const handleReset = () => {
    resetState();
    console.log('State reset');
  };

  return (
    <div>
      <h2>Wishlist Manager</h2>
      <p>Total items: {getWishlistCount()}</p>
      
      <div>
        <button onClick={handleRefresh}>Refresh Wishlist</button>
        <button onClick={handleClearCache}>Clear Cache</button>
        <button onClick={handleReset}>Reset State</button>
      </div>
      
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
};
```

## API Integration

### Backend Endpoints
The implementation expects the following API endpoints:

```typescript
// GET /api/wishlist - Fetch user's wishlist
// POST /api/wishlist/add - Add item to wishlist
// DELETE /api/wishlist/remove - Remove item from wishlist
// DELETE /api/wishlist/clear - Clear all wishlist items
```

### Request/Response Format
```typescript
// Add to wishlist request
{
  productId: string
}

// Wishlist response
{
  data: {
    items: WishlistItem[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
  },
  meta: {
    code: number;
    message: string;
  }
}
```

## Benefits

### 1. **Complete CRUD Operations**
- Full wishlist management capabilities
- Add, remove, clear, and check operations
- Optimistic updates for better UX

### 2. **Performance Optimization**
- Automatic caching with 5-minute TTL
- Request deduplication prevents duplicate API calls
- Persistent storage reduces initial load time
- Loading states for all operations

### 3. **Better User Experience**
- Real-time status updates
- Loading indicators for all actions
- Error handling with user feedback
- Toast notifications for success/error

### 4. **Developer Experience**
- Type-safe with TypeScript
- Easy to test with Redux testing utilities
- Clear separation of concerns
- Comprehensive error handling

### 5. **Scalability**
- Easy to extend with new operations
- Consistent patterns across the app
- Redux ecosystem integration
- Authentication-ready

## Migration from Old Hook

### Before (useCartWishlist)
```typescript
import { useCartWishlist } from '@/hooks/useCartWishlist';

const { wishlistData, addToWishlist, removeFromWishlist } = useCartWishlist();
```

### After (useWishlistRedux)
```typescript
import { useWishlistRedux } from '@/hooks/useWishlistRedux';

const { 
  items, 
  addToWishlist, 
  removeFromWishlist,
  clearAllWishlist,
  isItemInWishlist 
} = useWishlistRedux();
```

## Store Configuration

The wishlist slice is automatically:
- ✅ Added to the root reducer
- ✅ Configured with persistence
- ✅ Integrated with Redux DevTools
- ✅ Optimized for performance

## Testing

### Unit Testing Actions
```typescript
import { addToWishlist, removeFromWishlist } from '../store/actions/wishlistActions';

describe('Wishlist Actions', () => {
  it('should add item to wishlist successfully', async () => {
    // Test implementation
  });
  
  it('should remove item from wishlist successfully', async () => {
    // Test implementation
  });
});
```

### Integration Testing
```typescript
import { renderHook } from '@testing-library/react-hooks';
import { useWishlistRedux } from '../hooks/useWishlistRedux';

describe('useWishlistRedux', () => {
  it('should return wishlist data', () => {
    const { result } = renderHook(() => useWishlistRedux());
    // Test implementation
  });
});
```

## Future Enhancements

1. **Real-time Updates**: WebSocket integration for live wishlist updates
2. **Offline Support**: Service worker integration for offline functionality
3. **Advanced Caching**: More sophisticated cache invalidation strategies
4. **Optimistic Updates**: Immediate UI updates with rollback on error
5. **Background Sync**: Automatic data synchronization in background
6. **Wishlist Sharing**: Share wishlist with other users
7. **Wishlist Analytics**: Track wishlist performance and user behavior