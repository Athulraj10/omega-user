import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { searchProductsRequest } from '@/store/actions';
import ItemCard from '../product-item/ItemCard';
import { showErrorToast } from '../toast-popup/Toastify';

const SearchProducts: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();
  
  const { searchResults, searchLoading, searchError } = useSelector((state: RootState) => 
    state.product || { searchResults: [], searchLoading: false, searchError: null }
  );

  // Show error if there's an error
  React.useEffect(() => {
    if (searchError) {
      showErrorToast(searchError);
    }
  }, [searchError]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      dispatch(searchProductsRequest(searchQuery.trim()));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="search-products py-5">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h2 className="section-title mb-4">Search Products</h2>
            
            {/* Search Form */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={handleInputChange}
                />
                <button 
                  className="btn btn-primary" 
                  type="submit"
                  disabled={searchLoading}
                >
                  {searchLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Searching...
                    </>
                  ) : (
                    'Search'
                  )}
                </button>
              </div>
            </form>

            {/* Loading State */}
            {searchLoading && (
              <div className="text-center py-5">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Searching...</span>
                </div>
                <p className="mt-3">Searching for products...</p>
              </div>
            )}

            {/* Error State */}
            {searchError && (
              <div className="text-center py-5">
                <div className="alert alert-danger" role="alert">
                  <h4>Search Error</h4>
                  <p>{searchError}</p>
                </div>
              </div>
            )}

            {/* Search Results */}
            {!searchLoading && !searchError && searchResults.length > 0 && (
              <div>
                <h4 className="mb-3">Search Results ({searchResults.length} products found)</h4>
                <div className="row">
                  {searchResults.map((product: any) => (
                    <div key={product.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                      <ItemCard data={product} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {!searchLoading && !searchError && searchQuery && searchResults.length === 0 && (
              <div className="text-center py-5">
                <h4>No Products Found</h4>
                <p>No products found for "{searchQuery}". Try a different search term.</p>
              </div>
            )}

            {/* Initial State */}
            {!searchLoading && !searchError && !searchQuery && (
              <div className="text-center py-5">
                <h4>Search Products</h4>
                <p>Enter a search term above to find products.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchProducts; 