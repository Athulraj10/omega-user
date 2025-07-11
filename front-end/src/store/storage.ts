import createWebStorage from 'redux-persist/lib/storage/createWebStorage';

const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
      return Promise.resolve();
    },
  };
};

const createStorage = () => {
  if (typeof window === 'undefined') {
    return createNoopStorage();
  }

  try {
    // Test if localStorage is available
    const testKey = '__redux_persist_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return createWebStorage('local');
  } catch (error) {
    console.warn('localStorage is not available, using noop storage');
    return createNoopStorage();
  }
};

const storage = createStorage();

export default storage; 