import React from 'react';
import { useCartWishlist } from '../../hooks/useCartWishlist';

const CartDebug = () => {
  const {
    cartData,
    cartLoading,
    isAuthenticated,
    userToken,
    refreshCart,
    getCartCount,
    addToCart,
    removeFromCart
  } = useCartWishlist();

  const handleTestAddToCart = async () => {
    // Test with a sample product ID - replace with actual product ID from your database
    const testProductId = "507f1f77bcf86cd799439011"; // Sample MongoDB ObjectId
    await addToCart(testProductId, 1);
  };

  const handleTestRemoveFromCart = async () => {
    if (cartData && cartData.items && cartData.items.length > 0) {
      await removeFromCart(cartData.items[0].id);
    }
  };

  const handleGetCartCount = async () => {
    const count = await getCartCount();
    console.log("Cart count:", count);
  };

  const handleTestAPI = async () => {
    try {
      console.log("Testing API routes...");
      
      // Test basic API route
      const testResponse = await fetch('/api/test');
      const testResult = await testResponse.json();
      console.log("Test API result:", testResult);
      
      // Test cart API route
      if (isAuthenticated && userToken) {
        const cartResponse = await fetch('/api/cart', {
          headers: {
            'Authorization': `Bearer ${userToken}`
          }
        });
        const cartResult = await cartResponse.json();
        console.log("Cart API result:", cartResult);
      }
      
    } catch (error) {
      console.error("API test error:", error);
    }
  };

  const handleHealthCheck = async () => {
    try {
      console.log("Running health check...");
      
      const healthResponse = await fetch('/api/health');
      const healthResult = await healthResponse.json();
      console.log("Health check result:", healthResult);
      
      if (healthResult.success) {
        alert("✅ Backend is accessible!");
      } else {
        alert("❌ Backend is not accessible: " + healthResult.error);
      }
      
    } catch (error) {
      console.error("Health check error:", error);
      alert("❌ Health check failed: " + error);
    }
  };

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
      <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Cart Debug</h4>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Auth Status:</strong> {isAuthenticated ? '✅ Logged In' : '❌ Not Logged In'}
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Token:</strong> {userToken ? '✅ Present' : '❌ Missing'}
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Loading:</strong> {cartLoading ? '🔄 Loading...' : '✅ Ready'}
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Cart Items:</strong> {cartData?.items?.length || 0}
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Subtotal:</strong> AED {cartData?.subtotal?.toFixed(2) || '0.00'}
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <strong>Total Items:</strong> {cartData?.totalItems || 0}
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <button 
          onClick={handleHealthCheck}
          style={{ 
            padding: '5px 10px', 
            background: '#17a2b8', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '11px'
          }}
        >
          Health Check
        </button>
        
        <button 
          onClick={handleTestAPI}
          style={{ 
            padding: '5px 10px', 
            background: '#6f42c1', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '11px'
          }}
        >
          Test API Routes
        </button>
        
        <button 
          onClick={handleTestAddToCart}
          style={{ 
            padding: '5px 10px', 
            background: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '11px'
          }}
        >
          Test Add to Cart
        </button>
        
        <button 
          onClick={handleTestRemoveFromCart}
          style={{ 
            padding: '5px 10px', 
            background: '#dc3545', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '11px'
          }}
        >
          Test Remove from Cart
        </button>
        
        <button 
          onClick={handleGetCartCount}
          style={{ 
            padding: '5px 10px', 
            background: '#28a745', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '11px'
          }}
        >
          Get Cart Count
        </button>
        
        <button 
          onClick={refreshCart}
          style={{ 
            padding: '5px 10px', 
            background: '#ffc107', 
            color: 'black', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '11px'
          }}
        >
          Refresh Cart
        </button>
      </div>
      
      <div style={{ marginTop: '10px', fontSize: '10px', color: '#666' }}>
        <strong>API Endpoints:</strong>
        <div style={{ fontSize: '9px', marginTop: '5px' }}>
          <div>GET /api/health</div>
          <div>GET /api/test</div>
          <div>GET /api/cart</div>
          <div>POST /api/cart/add</div>
          <div>PUT /api/cart/update/[id]</div>
          <div>DELETE /api/cart/remove/[id]</div>
          <div>GET /api/cart/count</div>
        </div>
      </div>
      
      <div style={{ marginTop: '10px', fontSize: '10px', color: '#666' }}>
        <strong>Cart Data:</strong>
        <pre style={{ 
          background: '#f1f3f4', 
          padding: '5px', 
          borderRadius: '4px', 
          overflow: 'auto',
          maxHeight: '100px'
        }}>
          {JSON.stringify(cartData, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default CartDebug; 