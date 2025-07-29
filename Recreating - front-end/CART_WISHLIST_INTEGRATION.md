# Cart and Wishlist Integration Guide

This document explains how to use the dynamic cart and wishlist functionality in the frontend components.

## Overview

The cart and wishlist functionality has been implemented with:
- **Custom Hook**: `useCartWishlist` for reusable cart and wishlist operations
- **Dynamic Components**: Enhanced SingleProductContent with real-time cart/wishlist management
- **Backend Integration**: Full integration with the enhanced backend APIs
- **User Experience**: Loading states, toast notifications, and responsive design

## Features

### ✅ **Cart Management**
- Add products to cart with quantity
- Remove products from cart
- Update cart item quantities
- Get cart count for badges
- Real-time cart updates
- Stock validation

### ✅ **Wishlist Management**
- Add/remove products from wishlist
- Check wishlist status
- Real-time wishlist updates
- Wishlist count tracking
- Heart icon animations

### ✅ **User Experience**
- Loading states for all operations
- Toast notifications for success/error
- Responsive design
- Authentication checks
- Stock availability warnings

## Usage

### 1. Using the Custom Hook

```typescript
import { useCartWishlist } from '../hooks/useCartWishlist';

const MyComponent = () => {
  const {
    addToCart,
    removeFromCart,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    cartLoading,
    wishlistLoading,
    isAuthenticated
  } = useCartWishlist();

  const handleAddToCart = () => {
    addToCart(productId, quantity);
  };

  const handleWishlistToggle = () => {
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };

  return (
    <div>
      <button 
        onClick={handleAddToCart}
        disabled={cartLoading}
      >
        {cartLoading ? 'Adding...' : 'Add to Cart'}
      </button>
      
      <button 
        onClick={handleWishlistToggle}
        disabled={wishlistLoading}
        className={isInWishlist(productId) ? 'active' : ''}
      >
        <i className={`fi-rr-heart ${isInWishlist(productId) ? 'filled' : ''}`} />
      </button>
    </div>
  );
};
```

### 2. SingleProductContent Component

The `SingleProductContent` component now includes:

```typescript
// Dynamic quantity selection
<QuantitySelector
  setQuantity={setQuantity}
  quantity={quantity}
  id={data._id || data.id}
/>

// Add to cart button with loading state
<button 
  className={`btn btn-primary gi-btn-1 ${cartLoading ? 'disabled' : ''}`}
  onClick={handleAddToCart}
  disabled={cartLoading || data?.stock < 1}
>
  {cartLoading ? (
    <>
      <Spinner />
      Adding...
    </>
  ) : (
    data?.stock > 0 ? "Add To Cart" : "Out of Stock"
  )}
</button>

// Wishlist toggle button
<button 
  className={`gi-btn-group wishlist ${isInWishlist(data._id) ? 'active' : ''} ${wishlistLoading ? 'disabled' : ''}`}
  title={isInWishlist(data._id) ? "Remove from Wishlist" : "Add to Wishlist"}
  onClick={handleWishlistToggle}
  disabled={wishlistLoading}
>
  <i className={`fi-rr-heart ${isInWishlist(data._id) ? 'filled' : ''}`} />
</button>
```

## API Integration

### Cart Endpoints
- `POST /api/cart/add` - Add item to cart
- `DELETE /api/cart/remove/:productId` - Remove item from cart
- `PUT /api/cart/update/:productId` - Update cart quantity
- `GET /api/cart/count` - Get cart count

### Wishlist Endpoints
- `POST /api/wishlist/add` - Add to wishlist
- `DELETE /api/wishlist/remove/:productId` - Remove from wishlist
- `GET /api/wishlist/check/:productId` - Check wishlist status
- `GET /api/wishlist/count` - Get wishlist count

## Styling

The cart and wishlist functionality includes comprehensive CSS styling:

```css
/* Import the styles */
@import '../styles/cart-wishlist.css';
```

### Key Style Features:
- **Wishlist Heart Animation**: Heart beat effect when adding to wishlist
- **Loading States**: Spinner animations and disabled states
- **Responsive Design**: Mobile-friendly button layouts
- **Toast Notifications**: Styled success/error messages
- **Hover Effects**: Smooth transitions and visual feedback

## Authentication

All cart and wishlist operations require user authentication:

```typescript
// Check if user is authenticated
if (!isAuthenticated) {
  // Show login prompt or redirect to login
  return <LoginPrompt />;
}
```

## Error Handling

The system includes comprehensive error handling:

```typescript
// Automatic error handling in the hook
const addToCart = async (productId: string, quantity: number) => {
  try {
    // API call
    const result = await response.json();
    
    if (result.success) {
      toast.success("Product added to cart successfully!");
    } else {
      toast.error(result.message || "Failed to add to cart");
    }
  } catch (error) {
    toast.error("Failed to add to cart");
  }
};
```

## State Management

The hook manages local state for:
- Loading states (cart and wishlist)
- Wishlist items (for quick status checks)
- Authentication status

## Performance Optimizations

- **Local State Caching**: Wishlist status cached locally
- **Debounced API Calls**: Prevents excessive API requests
- **Optimistic Updates**: UI updates immediately, API calls in background
- **Error Recovery**: Graceful handling of network failures

## Integration with Redux

The hook integrates with Redux for:
- User authentication state
- User token management
- Cart count updates (can be extended)

## Example Implementation

```typescript
// Complete example of a product card component
const ProductCard = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const {
    addToCart,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    cartLoading,
    wishlistLoading,
    isAuthenticated
  } = useCartWishlist();

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      return;
    }
    addToCart(product._id, quantity);
  };

  const handleWishlistToggle = () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to wishlist");
      return;
    }
    
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product._id);
    }
  };

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>AED {product.price}</p>
      
      {isAuthenticated ? (
        <div className="product-actions">
          <QuantitySelector
            quantity={quantity}
            setQuantity={setQuantity}
            maxQuantity={product.stock}
          />
          
          <button 
            onClick={handleAddToCart}
            disabled={cartLoading || product.stock < 1}
            className="add-to-cart-btn"
          >
            {cartLoading ? 'Adding...' : 'Add to Cart'}
          </button>
          
          <button 
            onClick={handleWishlistToggle}
            disabled={wishlistLoading}
            className={`wishlist-btn ${isInWishlist(product._id) ? 'active' : ''}`}
          >
            <i className={`fi-rr-heart ${isInWishlist(product._id) ? 'filled' : ''}`} />
          </button>
        </div>
      ) : (
        <div className="login-prompt">
          <p>Please <a href="/login">login</a> to add items to cart or wishlist</p>
        </div>
      )}
    </div>
  );
};
```

## Best Practices

1. **Always check authentication** before cart/wishlist operations
2. **Use loading states** to provide user feedback
3. **Handle errors gracefully** with toast notifications
4. **Validate stock availability** before adding to cart
5. **Use the custom hook** for consistent functionality across components
6. **Import the CSS styles** for proper visual feedback

## Troubleshooting

### Common Issues:

1. **Authentication Errors**: Ensure user is logged in and token is valid
2. **API Errors**: Check backend API endpoints and response format
3. **Styling Issues**: Import the cart-wishlist.css file
4. **State Sync Issues**: Use the hook's built-in state management

### Debug Tips:

```typescript
// Enable debug logging
console.log('Cart loading:', cartLoading);
console.log('Wishlist loading:', wishlistLoading);
console.log('Is in wishlist:', isInWishlist(productId));
console.log('Is authenticated:', isAuthenticated);
```

This integration provides a complete, user-friendly cart and wishlist system that enhances the e-commerce experience with real-time updates and smooth interactions. 