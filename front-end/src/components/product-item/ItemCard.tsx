import { useEffect, useState } from "react"
import StarRating from "../stars/StarRating"
import QuickViewModal from "../model/QuickViewModal"
import { useDispatch, useSelector } from "react-redux"
import { addItem, setItems, updateItemQuantity } from "../../store/actions"
import Link from "next/link"
import { showSuccessToast } from "../toast-popup/Toastify"
import { RootState } from "@/store"
import { addWishlist, removeWishlist } from "@/store/actions"
import { addCompare, removeCompareItem } from "@/store/actions"

interface BackendProduct {
   _id: string
   name: string
   slug: string
   description: string
   category: string
   brand: string
   price: number
   discountPrice?: number
   images: string[]
   imageTwo?: string
   stock: number
   sku: string
   status: string
   ratingsAverage: number
   ratingsCount: number
   weight?: string
   location?: string
   colors?: string[]
   sizes?: string[]
   tags?: string[]
   isFeatured?: boolean
   isBundle?: boolean
   sale?: string
   variants?: any[]
   createdAt: string
   updatedAt: string
}

interface FrontendProduct {
   id: string | number
   title: string
   newPrice: number
   oldPrice: number
   weight: string
   image: string
   imageTwo: string
   date: string
   status: string
   rating: number
   location: string
   brand: string
   sku: string | number
   category: string
   quantity: number
   sale?: string
}

const ItemCard = ({ data }: { data: BackendProduct | FrontendProduct }) => {
   const [show, setShow] = useState(false)
   const dispatch = useDispatch()
   const compareItems = useSelector((state: RootState) => state.compare?.compare || [])
   const wishlistItems = useSelector((state: RootState) => state.wishlist?.wishlist || [])
   const cartItems = useSelector((state: RootState) => state.cart?.items || [])

   // Transform backend product to frontend format
   const transformProduct = (
      product: BackendProduct | FrontendProduct
   ): FrontendProduct => {
      // Check if it's already in frontend format
      if ("title" in product) {
         return product as FrontendProduct
      }

      // Transform backend format to frontend format
      const backendProduct = product as BackendProduct
      return {
         id: backendProduct._id,
         title: backendProduct.name,
         newPrice: backendProduct.discountPrice || backendProduct.price,
         oldPrice: backendProduct.price,
         weight: backendProduct.weight || "1 pcs",
         image: backendProduct.images?.[0] || "",
         imageTwo: backendProduct.imageTwo || backendProduct.images?.[0] || "",
         date: new Date(backendProduct.createdAt).toLocaleDateString(),
         status: backendProduct.stock > 0 ? "Available" : "Out Of Stock",
         rating: backendProduct.ratingsAverage || 0,
         location: backendProduct.location || "Online",
         brand: backendProduct.brand || "",
         sku: backendProduct.sku,
         category: backendProduct.category || "",
         quantity: 1,
         sale: backendProduct.sale || (backendProduct.discountPrice ? "Sale" : undefined),
      }
   }

   const transformedData = transformProduct(data)

   useEffect(() => {
      const itemsFromLocalStorage =
         typeof window !== "undefined"
            ? JSON.parse(localStorage.getItem("products") || "[]")
            : []
      if (itemsFromLocalStorage.length) {
         dispatch(setItems(itemsFromLocalStorage))
      }
   }, [dispatch])

   const handleCart = (productData: FrontendProduct) => {
      const isItemInCart = cartItems.some((item: any) => item.id === productData.id)

      if (!isItemInCart) {
         dispatch(addItem({ ...productData, quantity: 1 }))
         showSuccessToast("Add product in Cart Successfully!")
      } else {
         const updatedCartItems = cartItems.map((item: any) =>
            item.id === productData.id
               ? {
                    ...item,
                    quantity: item.quantity + 1,
                    price: item.newPrice + productData.newPrice,
                 }
               : item
         )
         dispatch(setItems(updatedCartItems))
         showSuccessToast("Add product in Cart Successfully!")
      }
   }

   const isInWishlist = (productData: FrontendProduct) => {
      return wishlistItems.some((item: any) => item.id === productData.id)
   }

   const handleWishlist = (productData: FrontendProduct) => {
      if (!isInWishlist(productData)) {
         dispatch(addWishlist(productData))
         showSuccessToast("Add product in Wishlist Successfully!", {
            icon: false,
         })
      } else {
         dispatch(removeWishlist(productData.id))
         showSuccessToast("Remove product on Wishlist Successfully!", {
            icon: false,
         })
      }
   }

   const isInCompare = (productData: FrontendProduct) => {
      return compareItems.some((item: any) => item.id === productData.id)
   }

   const handleCompareItem = (productData: FrontendProduct) => {
      if (!isInCompare(productData)) {
         dispatch(addCompare(productData))
         showSuccessToast(`Add product in Compare list Successfully!`, {
            icon: false,
         })
      } else {
         dispatch(removeCompareItem(productData.id))
         showSuccessToast("Remove product on Compare list Successfully!", {
            icon: false,
         })
      }
   }

   const handleSubmit = (e: any) => {
      e.preventDefault()
   }

   const handleClose = () => setShow(false)
   const handleShow = () => setShow(true)

   return (
      <>
         <div className='gi-product-content'>
            <div className={` gi-product-inner`}>
               <div className='gi-pro-image-outer'>
                  <div className='gi-pro-image'>
                     <Link
                        onClick={handleSubmit}
                        href={`/product/${transformedData.slug || transformedData.id}`}
                        className='image'
                     >
                        <span className='label veg'>
                           <span className='dot'></span>
                        </span>
                        <img
                           className='main-image'
                           src={transformedData.image}
                           alt={transformedData.title}
                        />
                        <img
                           className='hover-image'
                           src={transformedData.imageTwo}
                           alt={transformedData.title}
                        />
                     </Link>
                     <span className='flags'>
                        {transformedData.sale && (
                           <span
                              className={transformedData.sale === "Sale" ? "sale" : "new"}
                           >
                              {transformedData.sale}
                           </span>
                        )}
                     </span>
                     <div className='gi-pro-actions'>
                        <button
                           onClick={() => handleWishlist(transformedData)}
                           className={
                              "gi-btn-group wishlist " +
                              (isInWishlist(transformedData) ? "active" : "")
                           }
                           title='Wishlist'
                        >
                           <i className='fi-rr-heart'></i>
                        </button>
                        <button
                           className='gi-btn-group quickview gi-cart-toggle'
                           data-link-action='quickview'
                           title='Quick view'
                           data-bs-toggle='modal'
                           data-bs-target='#gi_quickview_modal'
                           onClick={handleShow}
                        >
                           <i className='fi-rr-eye'></i>
                        </button>
                        <button
                           onClick={() => handleCompareItem(transformedData)}
                           className={
                              "gi-btn-group compare " +
                              (isInCompare(transformedData) ? "active" : "")
                           }
                           title='Compare'
                        >
                           <i className='fi fi-rr-arrows-repeat'></i>
                        </button>
                        <button
                           title='Add To Cart'
                           className='gi-btn-group add-to-cart'
                           onClick={() => handleCart(transformedData)}
                        >
                           <i className='fi-rr-shopping-basket'></i>
                        </button>
                     </div>
                     <div className='gi-pro-option'>
                        {transformedData.colors && transformedData.colors.length > 0 && (
                           <ul className='colors'>
                              {transformedData.colors.slice(0, 3).map((color, index) => (
                                 <li
                                    key={index}
                                    className={`color-${color.toLowerCase()}`}
                                 >
                                    <a href=''></a>
                                 </li>
                              ))}
                           </ul>
                        )}
                        {transformedData.sizes && transformedData.sizes.length > 0 && (
                           <ul className='sizes'>
                              {transformedData.sizes.slice(0, 2).map((size, index) => (
                                 <li key={index}>
                                    <a href=''>{size}</a>
                                 </li>
                              ))}
                           </ul>
                        )}
                     </div>
                  </div>
               </div>
               <div className='gi-pro-content'>
                  <Link href={`/category/${transformedData.category}`}>
                     <h6 className='gi-pro-stitle'>{transformedData.category}</h6>
                  </Link>
                  <h5 className='gi-pro-title'>
                     <Link
                        href={`/product/${transformedData.slug || transformedData.id}`}
                     >
                        {transformedData.title}
                     </Link>
                  </h5>
                  <p className='gi-info'>
                     {("description" in data && data.description) ||
                        "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old."}
                  </p>
                  <div className='gi-pro-rat-price'>
                     <span className='gi-pro-rating'>
                        <StarRating rating={transformedData.rating} />
                        <span className='qty'>{transformedData.weight}</span>
                     </span>
                     <span className='gi-price'>
                        <span className='new-price'>
                           ${transformedData.newPrice.toFixed(2)}
                        </span>
                        {transformedData.oldPrice > transformedData.newPrice && (
                           <span className='old-price'>
                              ${transformedData.oldPrice.toFixed(2)}
                           </span>
                        )}
                     </span>
                  </div>
               </div>
            </div>
            <QuickViewModal
               data={transformedData}
               handleClose={handleClose}
               show={show}
            />
         </div>
      </>
   )
}

export default ItemCard
