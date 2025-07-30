# Category Redux Implementation

## Overview

This implementation moves category fetching and state management to Redux store, providing a centralized, persistent, and efficient way to manage category data across the application.

## Architecture

### 1. Redux Store Structure
```
store/
├── reducers/
│   └── categorySlice.ts          # Category state management
├── actions/
│   └── categoryActions.ts        # Async actions for API calls
└── index.ts                      # Store configuration with persistence
```

### 2. Hook Implementation
```
hooks/
└── useCategoriesRedux.ts         # Redux-based category hook
```

## Key Features

### ✅ **Redux State Management**
- Centralized category state in Redux store
- Persistent storage with redux-persist
- Loading, error, and data states
- Cache management with timestamps

### ✅ **Async Actions with Thunk**
- `fetchCategories()` - Fetch all categories
- `fetchCategoriesCount()` - Get categories count
- `fetchCategoryById(id)` - Get single category
- `refreshCategories()` - Force refresh data
- `clearCategoriesCache()` - Clear cache
- `resetCategories()` - Reset state

### ✅ **Request Deduplication**
- Prevents multiple API calls for the same data
- Global promise management
- Cache validation (5-minute cache)

### ✅ **Error Handling**
- Comprehensive error states
- Toast notifications
- Graceful fallbacks

## Implementation Details

### Category Slice (`categorySlice.ts`)
```typescript
export interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

// Actions:
- setLoading(boolean)
- setError(string | null)
- setCategories(Category[])
- clearCategories()
- addCategory(Category)
- updateCategory(Category)
- removeCategory(string)
- setCategoriesFromAPI(CategoriesData)
- resetCategoryState()
```

### Category Actions (`categoryActions.ts`)
```typescript
// Async thunks:
- fetchCategories() - Main data fetching
- fetchCategoriesCount() - Get count
- fetchCategoryById(id) - Get single category
- refreshCategories() - Force refresh
- clearCategoriesCache() - Clear cache
- resetCategories() - Reset state
```

### Redux Hook (`useCategoriesRedux.ts`)
```typescript
interface UseCategoriesReduxReturn {
  categories: Category[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
  refreshCategories: () => Promise<any>;
  getCategoriesCount: () => Promise<number>;
  getCategoryById: (id: string) => Promise<Category | null>;
  clearCache: () => void;
  resetState: () => void;
}
```

## Usage Examples

### Basic Usage in Component
```typescript
import { useCategoriesRedux } from '@/hooks/useCategoriesRedux';

const MyComponent = () => {
  const { categories, loading, error } = useCategoriesRedux();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {categories.map(category => (
        <div key={category.id}>{category.name}</div>
      ))}
    </div>
  );
};
```

### With useEffect for Side Effects
```typescript
import { useEffect } from 'react';
import { useCategoriesRedux } from '@/hooks/useCategoriesRedux';

const MyComponent = () => {
  const { categories, loading, error, lastFetched } = useCategoriesRedux();

  useEffect(() => {
    console.log('Categories updated:', categories);
  }, [categories]);

  useEffect(() => {
    if (error) {
      console.error('Categories error:', error);
    }
  }, [error]);

  return <div>...</div>;
};
```

### Manual Actions
```typescript
const MyComponent = () => {
  const { 
    refreshCategories, 
    getCategoriesCount, 
    getCategoryById,
    clearCache,
    resetState 
  } = useCategoriesRedux();

  const handleRefresh = async () => {
    await refreshCategories();
  };

  const handleGetCount = async () => {
    const count = await getCategoriesCount();
    console.log('Categories count:', count);
  };

  const handleGetCategory = async (id: string) => {
    const category = await getCategoryById(id);
    console.log('Category:', category);
  };

  return (
    <div>
      <button onClick={handleRefresh}>Refresh</button>
      <button onClick={handleGetCount}>Get Count</button>
      <button onClick={() => handleGetCategory('123')}>Get Category</button>
      <button onClick={clearCache}>Clear Cache</button>
      <button onClick={resetState}>Reset State</button>
    </div>
  );
};
```

## Benefits

### 1. **Centralized State Management**
- Single source of truth for category data
- Consistent state across all components
- Easy debugging with Redux DevTools

### 2. **Performance Optimization**
- Automatic caching with 5-minute TTL
- Request deduplication prevents duplicate API calls
- Persistent storage reduces initial load time

### 3. **Better User Experience**
- Loading states for better UX
- Error handling with user feedback
- Automatic data refresh when needed

### 4. **Developer Experience**
- Type-safe with TypeScript
- Easy to test with Redux testing utilities
- Clear separation of concerns

### 5. **Scalability**
- Easy to extend with new actions
- Consistent patterns across the app
- Redux ecosystem integration

## Migration from Old Hook

### Before (useCategories)
```typescript
import { useCategories } from '@/hooks/useCategories';

const { categories, loading, error } = useCategories();
```

### After (useCategoriesRedux)
```typescript
import { useCategoriesRedux } from '@/hooks/useCategoriesRedux';

const { categories, loading, error } = useCategoriesRedux();
```

## Store Configuration

The category slice is automatically:
- ✅ Added to the root reducer
- ✅ Configured with persistence
- ✅ Integrated with Redux DevTools
- ✅ Optimized for performance

## Testing

### Unit Testing Actions
```typescript
import { fetchCategories } from '../store/actions/categoryActions';

describe('Category Actions', () => {
  it('should fetch categories successfully', async () => {
    // Test implementation
  });
});
```

### Integration Testing
```typescript
import { renderHook } from '@testing-library/react-hooks';
import { useCategoriesRedux } from '../hooks/useCategoriesRedux';

describe('useCategoriesRedux', () => {
  it('should return categories data', () => {
    const { result } = renderHook(() => useCategoriesRedux());
    // Test implementation
  });
});
```

## Future Enhancements

1. **Real-time Updates**: WebSocket integration for live category updates
2. **Offline Support**: Service worker integration for offline functionality
3. **Advanced Caching**: More sophisticated cache invalidation strategies
4. **Optimistic Updates**: Immediate UI updates with rollback on error
5. **Background Sync**: Automatic data synchronization in background