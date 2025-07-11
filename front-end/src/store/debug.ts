// Debug utility for Redux Persist
export const debugReduxPersist = () => {
  if (typeof window === 'undefined') {
    console.log('🔍 Redux Persist Debug: Running on server-side');
    return;
  }

  console.log('🔍 Redux Persist Debug: Running on client-side');
  
  // Check localStorage availability
  try {
    const testKey = '__redux_persist_debug_test__';
    localStorage.setItem(testKey, 'test');
    const value = localStorage.getItem(testKey);
    localStorage.removeItem(testKey);
    
    if (value === 'test') {
      console.log('✅ localStorage is working correctly');
    } else {
      console.warn('⚠️ localStorage test failed');
    }
  } catch (error) {
    console.error('❌ localStorage is not available:', error);
  }

  // Check if Redux DevTools are available
  if ((window as any).__REDUX_DEVTOOLS_EXTENSION__) {
    console.log('✅ Redux DevTools are available');
  } else {
    console.log('ℹ️ Redux DevTools are not available');
  }
};

// Export for use in development
if (typeof window !== 'undefined') {
  (window as any).debugReduxPersist = debugReduxPersist;
} 