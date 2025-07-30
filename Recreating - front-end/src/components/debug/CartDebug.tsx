import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useWishlistRedux } from '../../hooks/useWishlistRedux';

const CartDebug = () => {
  // Get cart data from Redux
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const isAuthenticated = useSelector((state: RootState) => state.registration.isAuthenticated);

  // Get wishlist data from Redux
  const {
    items: wishlistItems,
    loading: wishlistLoading,
    error: wishlistError,
    totalItems: wishlistCount
  } = useWishlistRedux();

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: '#f8f9fa', 
      border: '1px solid #dee2e6', 
      borderRadius: '8px', 
      padding: '15px', 
      zIndex: 9999,
      maxWidth: '300px',
      fontSize: '12px'
    }}>
      <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Cart & Wishlist Debug</h4>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Auth Status:</strong> {isAuthenticated ? '✅ Logged In' : '❌ Not Logged In'}
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Cart Items:</strong> {cartItems.length}
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Wishlist Items:</strong> {wishlistCount}
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Wishlist Loading:</strong> {wishlistLoading ? '🔄 Loading' : '✅ Ready'}
      </div>
      
      {wishlistError && (
        <div style={{ marginBottom: '10px', color: 'red' }}>
          <strong>Wishlist Error:</strong> {wishlistError}
        </div>
      )}
      
      <details style={{ marginBottom: '10px' }}>
        <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>Cart Items</summary>
        <div style={{ fontSize: '10px', marginTop: '5px' }}>
          {cartItems.map((item: any, index: number) => (
            <div key={index} style={{ marginBottom: '2px' }}>
              {item.title} - Qty: {item.quantity}
            </div>
          ))}
        </div>
      </details>
      
      <details style={{ marginBottom: '10px' }}>
        <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>Wishlist Items</summary>
        <div style={{ fontSize: '10px', marginTop: '5px' }}>
          {wishlistItems.map((item: any, index: number) => (
            <div key={index} style={{ marginBottom: '2px' }}>
              {item.title}
            </div>
          ))}
        </div>
      </details>
    </div>
  );
};

export default CartDebug; 