import React, { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "@/store"
import { fetchProductsRequest, fetchFeaturedProductsRequest } from "@/store/actions"
import ItemCard from "../product-item/ItemCard"
import { showErrorToast } from "../toast-popup/Toastify"

interface DynamicProductListProps {
   title?: string
   showLoading?: boolean
   type?: "all" | "featured" | "trending" | "bestsellers" | "newArrivals" | "deals"
   limit?: number
   filters?: any
}

const DynamicProductList: React.FC<DynamicProductListProps> = ({
   title = "Products",
   showLoading = true,
   type = "all",
   limit,
   filters,
}) => {
   const dispatch = useDispatch()
   const {
      products,
      featuredProducts,
      trendingProducts,
      bestsellers,
      newArrivals,
      deals,
      loading,
      error,
   } = useSelector((state: RootState) => state.product)

   // Get the appropriate product list based on type
   const getProductList = () => {
      switch (type) {
         case "featured":
            return featuredProducts
         case "trending":
            return trendingProducts
         case "bestsellers":
            return bestsellers
         case "newArrivals":
            return newArrivals
         case "deals":
            return deals
         default:
            return products
      }
   }

   const getProductListLoading = () => {
      switch (type) {
         case "featured":
            return loading // Using general loading state for now
         case "trending":
            return loading
         case "bestsellers":
            return loading
         case "newArrivals":
            return loading
         case "deals":
            return loading
         default:
            return loading
      }
   }

   const productList = getProductList()
   const isLoading = getProductListLoading()

   // Fetch products on component mount
   useEffect(() => {
      const params = { ...filters }
      if (limit) params.limit = limit

      switch (type) {
         case "featured":
            dispatch(fetchFeaturedProductsRequest())
            break
         case "trending":
            dispatch(fetchFeaturedProductsRequest()) // Will be updated when trending saga is added
            break
         case "bestsellers":
            dispatch(fetchFeaturedProductsRequest()) // Will be updated when bestsellers saga is added
            break
         case "newArrivals":
            dispatch(fetchFeaturedProductsRequest()) // Will be updated when newArrivals saga is added
            break
         case "deals":
            dispatch(fetchFeaturedProductsRequest()) // Will be updated when deals saga is added
            break
         default:
            dispatch(fetchProductsRequest(params))
            break
      }
   }, [dispatch, type, limit, filters])

   // Show error if there's an error
   React.useEffect(() => {
      if (error) {
         showErrorToast(error)
      }
   }, [error])

   // Show loading state
   if (isLoading && showLoading) {
      return (
         <div className='container'>
            <div className='row'>
               <div className='col-12'>
                  <div className='text-center py-5'>
                     <div className='spinner-border' role='status'>
                        <span className='visually-hidden'>Loading...</span>
                     </div>
                     <p className='mt-3'>Loading products...</p>
                  </div>
               </div>
            </div>
         </div>
      )
   }

   // Show error state
   if (error) {
      return (
         <div className='container'>
            <div className='row'>
               <div className='col-12'>
                  <div className='text-center py-5'>
                     <div className='alert alert-danger' role='alert'>
                        <h4>Error Loading Products</h4>
                        <p>{error}</p>
                        <button
                           className='btn btn-primary'
                           onClick={() => window.location.reload()}
                        >
                           Try Again
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      )
   }

   // Show empty state
   if (!productList || productList.length === 0) {
      return (
         <div className='container'>
            <div className='row'>
               <div className='col-12'>
                  <div className='text-center py-5'>
                     <h4>No Products Found</h4>
                     <p>There are no products available at the moment.</p>
                  </div>
               </div>
            </div>
         </div>
      )
   }

   return (
      <div className='container'>
         {title && (
            <div className='row'>
               <div className='col-12'>
                  <h2 className='section-title mb-4'>{title}</h2>
               </div>
            </div>
         )}
         <div className='row'>
            {productList.map((product: any) => (
               <div
                  key={product._id || product.id}
                  className='col-lg-3 col-md-4 col-sm-6 mb-4'
               >
                  <ItemCard data={product} />
               </div>
            ))}
         </div>
      </div>
   )
}

export default DynamicProductList
