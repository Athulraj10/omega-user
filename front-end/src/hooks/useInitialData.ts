import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { 
  fetchProductsRequest, 
  fetchFeaturedProductsRequest,
  fetchCartRequest,
  fetchWishlistRequest 
} from '../store/actions';

export const useInitialData = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch initial data when the app loads
    dispatch(fetchProductsRequest());
    dispatch(fetchFeaturedProductsRequest());
    dispatch(fetchCartRequest());
    dispatch(fetchWishlistRequest());
  }, [dispatch]);
};

export default useInitialData; 