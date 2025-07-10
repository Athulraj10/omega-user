# Redux Saga Migration Guide

This document outlines the changes made to convert the Redux state management from Redux Toolkit's `createSlice` to Redux Saga.

## Changes Made

### 1. Dependencies Added
- `redux-saga`: For handling side effects
- `@types/redux-saga`: TypeScript types for Redux Saga

### 2. New File Structure

#### Actions
- `src/store/actions/types.ts`: Action type constants
- `src/store/actions/index.ts`: Action creators

#### Reducers (Updated)
- `src/store/reducers/cartReducer.ts`: Cart state management
- `src/store/reducers/registrationReducer.ts`: Authentication state
- `src/store/reducers/wishlistReducer.ts`: Wishlist state
- `src/store/reducers/compareReducer.ts`: Compare state
- `src/store/reducers/stepReducer.ts`: Step state
- `src/store/reducers/filterReducer.ts`: Filter state
- `src/store/reducers/themeReducer.ts`: Theme state

#### Sagas
- `src/store/sagas/cartSaga.ts`: Cart-related side effects
- `src/store/sagas/registrationSaga.ts`: Authentication side effects
- `src/store/sagas/wishlistSaga.ts`: Wishlist side effects
- `src/store/sagas/compareSaga.ts`: Compare side effects
- `src/store/sagas/index.ts`: Root saga that combines all sagas

### 3. Key Changes

#### Store Configuration
- Replaced `configureStore` from Redux Toolkit with `createStore` from Redux
- Added `createSagaMiddleware` and applied it to the store
- Updated imports to use new reducer files instead of slice files

#### Action Handling
- Converted from `createSlice` reducers to traditional Redux reducers
- Added explicit action types and action creators
- Implemented saga middleware for handling side effects

#### Component Updates Needed
Components that import actions from the old slice files need to be updated to use the new action creators:

**Before:**
```typescript
import { addItem, removeItem } from "@/store/reducers/cartSlice";
```

**After:**
```typescript
import { addItem, removeItem } from "@/store/actions";
```

### 4. Benefits of Redux Saga

1. **Better Side Effect Management**: Sagas provide a more structured way to handle async operations
2. **Testability**: Sagas are easier to test than thunks
3. **Complex Flow Control**: Better handling of complex async flows
4. **Cancellation**: Built-in support for cancelling operations
5. **Race Conditions**: Better handling of race conditions

### 5. Migration Checklist

- [x] Install Redux Saga dependencies
- [x] Create action types and action creators
- [x] Convert reducers from createSlice to traditional Redux reducers
- [x] Create saga files for side effects
- [x] Update store configuration
- [x] Update Provider component

### 6. Components to Update

The following components need to be updated to use the new action creators:

- All components in `src/components/` that import from `@/store/reducers/`
- Update imports to use `@/store/actions` instead

### 7. Example Usage

```typescript
// In a component
import { useDispatch } from 'react-redux';
import { addItem, removeItem } from '@/store/actions';

const dispatch = useDispatch();

// Dispatch actions
dispatch(addItem(product));
dispatch(removeItem(productId));
```

### 8. API Integration

The saga files include placeholder API calls that can be replaced with your actual API endpoints. Update the `apiCall` functions in each saga file to match your backend API structure.

### 9. Testing

Sagas can be tested using Redux Saga's testing utilities. Example:

```typescript
import { expectSaga } from 'redux-saga-test-plan';
import { cartSaga } from './cartSaga';

it('should handle add item', () => {
  return expectSaga(cartSaga)
    .dispatch({ type: 'ADD_ITEM', payload: product })
    .run();
});
```

## Next Steps

1. Update all component imports to use the new action creators
2. Test the application to ensure all functionality works correctly
3. Add actual API calls to the saga files
4. Add error handling and loading states
5. Implement additional sagas for other async operations as needed 