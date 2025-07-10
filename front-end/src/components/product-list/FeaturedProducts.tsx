import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import ItemCard from '../product-item/ItemCard';
import { showErrorToast } from '../toast-popup/Toastify';

const FeaturedProducts: React.FC = () => {
  const { featuredProducts, loading, error } = useSelector((state: RootState) => state.product || { featuredProducts: [], loading: false, error: null });

  // Show error if there's an error
  React.useEffect(() => {
    if (error) {
      showErrorToast(error);
    }
  }, [error]);

  // Show loading state
  if (loading) {
    return (
      <section className="featured-products py-5">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h2 className="section-title mb-4">Featured Products</h2>
              <div className="text-center py-5">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading featured products...</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section className="featured-products py-5">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h2 className="section-title mb-4">Featured Products</h2>
              <div className="text-center py-5">
                <div className="alert alert-danger" role="alert">
                  <h4>Error Loading Featured Products</h4>
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
      </section>
    );
  }

  // Show empty state
  if (!featuredProducts || featuredProducts.length === 0) {
    return (
      <section className="featured-products py-5">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h2 className="section-title mb-4">Featured Products</h2>
              <div className="text-center py-5">
                <h4>No Featured Products</h4>
                <p>There are no featured products available at the moment.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="featured-products py-5">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2 className="section-title mb-4">Featured Products</h2>
          </div>
        </div>
        <div className="row">
          {featuredProducts.map((product: any) => (
            <div key={product.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
              <ItemCard data={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts; 