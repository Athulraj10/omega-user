import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import ItemCard from '../product-item/ItemCard';
import { showErrorToast } from '../toast-popup/Toastify';

interface DynamicProductListProps {
  title?: string;
  showLoading?: boolean;
}

const DynamicProductList: React.FC<DynamicProductListProps> = ({ 
  title = "Products", 
  showLoading = true 
}) => {
  const { products, loading, error } = useSelector((state: RootState) => state.product || { products: [], loading: false, error: null });
  const { featuredProducts } = useSelector((state: RootState) => state.product || { featuredProducts: [] });

  // Show error if there's an error
  React.useEffect(() => {
    if (error) {
      showErrorToast(error);
    }
  }, [error]);

  // Show loading state
  if (loading && showLoading) {
    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="text-center py-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading products...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="text-center py-5">
              <div className="alert alert-danger" role="alert">
                <h4>Error Loading Products</h4>
                <p>{error}</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show empty state
  if (!products || products.length === 0) {
    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="text-center py-5">
              <h4>No Products Found</h4>
              <p>There are no products available at the moment.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {title && (
        <div className="row">
          <div className="col-12">
            <h2 className="section-title mb-4">{title}</h2>
          </div>
        </div>
      )}
      <div className="row">
        {products.map((product: any) => (
          <div key={product.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
            <ItemCard data={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DynamicProductList; 