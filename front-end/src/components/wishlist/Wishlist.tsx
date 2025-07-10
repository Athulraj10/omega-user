"use client"
import { useEffect, useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import ItemCard from "../product-item/ItemCard"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../store"
import { addItem } from "../../store/reducers/cartSlice"
import { Fade } from "react-awesome-reveal"
import { Col, Row } from "react-bootstrap"
import useSWR from "swr"
import fetcher from "../fetcher-api/Fetcher"
import Spinner from "../button/Spinner"
import { useWishlist } from "@/hooks/useWishlist"

interface Item {
   _id: string
   name: string
   price: number
   discountPrice?: number
   images: string[]
   category: string
   brand: string
   ratingsAverage: number
   ratingsCount: number
   stock: number
   status: string
}

const Wishlist = ({ onSuccess = () => {}, hasPaginate = false, onError = () => {} }) => {
   const dispatch = useDispatch()
   const { wishlist, loading, error, fetchWishlist, removeFromWishlist } = useWishlist()
   const [currentDate, setCurrentDate] = useState(new Date().toLocaleDateString("en-GB"))

   useEffect(() => {
      setCurrentDate(new Date().toLocaleDateString("en-GB"))
   }, [])

   useEffect(() => {
      fetchWishlist()
   }, [fetchWishlist])

   const handleRemoveFromWishlist = (productId: string) => {
      removeFromWishlist(productId)
   }

   const handleCart = (data: Item) => {
      // Transform the data to match cart item format
      const cartItem = {
         id:
            parseInt(data._id.replace(/[^0-9]/g, "")) ||
            Math.floor(Math.random() * 10000),
         title: data.name,
         newPrice: data.discountPrice || data.price,
         oldPrice: data.price,
         image: data.images[0] || "",
         imageTwo: data.images[1] || data.images[0] || "",
         category: data.category,
         brand: data.brand,
         rating: data.ratingsAverage,
         status: data.stock > 0 ? "Available" : "Out Of Stock",
         quantity: 1,
         waight: "1 pcs",
         date: "",
         location: "Online",
         sku: Math.floor(Math.random() * 100000),
      }
      dispatch(addItem(cartItem))
   }

   const { data: newArrivals, error: newArrivalsError } = useSWR(
      "/api/products?limit=10",
      fetcher,
      {
         onSuccess,
         onError,
      }
   )

   if (loading) {
      return (
         <section className='gi-faq padding-tb-40 gi-wishlist'>
            <div className='container'>
               <div className='section-title-2'>
                  <h2 className='gi-title'>
                     Product <span>Wishlist</span>
                  </h2>
                  <p>Loading your wishlist...</p>
               </div>
               <Spinner />
            </div>
         </section>
      )
   }

   if (error) {
      return (
         <section className='gi-faq padding-tb-40 gi-wishlist'>
            <div className='container'>
               <div className='section-title-2'>
                  <h2 className='gi-title'>
                     Product <span>Wishlist</span>
                  </h2>
                  <p>Error loading wishlist: {error}</p>
               </div>
            </div>
         </section>
      )
   }

   return (
      <>
         <section className='gi-faq padding-tb-40 gi-wishlist'>
            <div className='container'>
               <div className='section-title-2'>
                  <h2 className='gi-title'>
                     Product <span>Wishlist</span>
                  </h2>
                  <p>Your product wish is our first priority.</p>
               </div>
               {wishlist.length === 0 ? (
                  <h4 className='text-center'>Your wishlist is empty.</h4>
               ) : (
                  <Row>
                     <Col md={12}>
                        <div className='gi-vendor-dashboard-card'>
                           <div className='gi-vendor-card-header'>
                              <h5>Wishlist</h5>
                              <div className='gi-header-btn'>
                                 <a className='gi-btn-2' href='#'>
                                    Shop Now
                                 </a>
                              </div>
                           </div>
                           <div className='gi-vendor-card-body'>
                              <div className='gi-vendor-card-table'>
                                 <table className='table gi-table'>
                                    <thead>
                                       <tr>
                                          <th scope='col'>ID</th>
                                          <th scope='col'>Image</th>
                                          <th scope='col'>Name</th>
                                          <th scope='col'>Date</th>
                                          <th scope='col'>Price</th>
                                          <th scope='col'>Status</th>
                                          <th scope='col'>Actions</th>
                                       </tr>
                                    </thead>
                                    <tbody className='wish-empt'>
                                       {wishlist.map((data, index) => (
                                          <tr key={data._id} className='pro-gl-content'>
                                             <td scope='row'>
                                                <span>{index + 1}</span>
                                             </td>
                                             <td>
                                                <img
                                                   className='prod-img'
                                                   src={
                                                      data.images[0] ||
                                                      "/assets/img/placeholder.jpg"
                                                   }
                                                   alt='product image'
                                                />
                                             </td>
                                             <td>
                                                <span>{data.name}</span>
                                             </td>
                                             <td>
                                                <span>{currentDate}</span>
                                             </td>
                                             <td>
                                                <span>
                                                   ${data.discountPrice || data.price}
                                                </span>
                                             </td>
                                             <td>
                                                <span
                                                   className={
                                                      data.stock > 0 ? "avl" : "out"
                                                   }
                                                >
                                                   {data.stock > 0
                                                      ? "Available"
                                                      : "Out Of Stock"}
                                                </span>
                                             </td>
                                             <td>
                                                <span className='tbl-btn'>
                                                   <a
                                                      className='gi-btn-2 add-to-cart'
                                                      title='Add To Cart'
                                                      onClick={() => handleCart(data)}
                                                   >
                                                      <i className='fi-rr-shopping-basket'></i>
                                                   </a>
                                                   <a
                                                      onClick={() =>
                                                         handleRemoveFromWishlist(
                                                            data._id
                                                         )
                                                      }
                                                      className='gi-btn-1 gi-remove-wish btn'
                                                      href='#'
                                                      title='Remove From List'
                                                   >
                                                      ×
                                                   </a>
                                                </span>
                                             </td>
                                          </tr>
                                       ))}
                                    </tbody>
                                 </table>
                              </div>
                           </div>
                        </div>
                     </Col>
                  </Row>
               )}
            </div>
         </section>
         <section className='gi-new-product padding-tb-40'>
            <div className='container'>
               <Row className='overflow-hidden m-b-minus-24px'>
                  <Col lg={12} className='gi-new-prod-section'>
                     <div className='gi-products'>
                        <Fade
                           triggerOnce
                           direction='up'
                           duration={2000}
                           delay={200}
                           className='section-title-2'
                        >
                           <h2 className='gi-title'>
                              New <span>Arrivals</span>
                           </h2>
                           <p>Browse The Collection of Top Products</p>
                        </Fade>
                        <Fade
                           triggerOnce
                           direction='up'
                           duration={2000}
                           delay={200}
                           className='gi-new-block m-minus-lr-12'
                           data-aos='fade-up'
                           data-aos-duration='2000'
                           data-aos-delay='300'
                        >
                           {newArrivalsError ? (
                              <div>Failed to load new arrivals</div>
                           ) : !newArrivals ? (
                              <Spinner />
                           ) : (
                              <Swiper
                                 loop={true}
                                 autoplay={{ delay: 1000 }}
                                 slidesPerView={5}
                                 breakpoints={{
                                    0: {
                                       slidesPerView: 1,
                                    },
                                    320: {
                                       slidesPerView: 1,
                                    },
                                    425: {
                                       slidesPerView: 2,
                                    },
                                    640: {
                                       slidesPerView: 2,
                                    },
                                    768: {
                                       slidesPerView: 3,
                                    },
                                    1024: {
                                       slidesPerView: 3,
                                    },
                                    1025: {
                                       slidesPerView: 5,
                                    },
                                 }}
                                 className='deal-slick-carousel gi-product-slider'
                              >
                                 {newArrivals.map((item: any, index: number) => (
                                    <SwiperSlide key={item._id || index}>
                                       <ItemCard data={item} />
                                    </SwiperSlide>
                                 ))}
                              </Swiper>
                           )}
                        </Fade>
                     </div>
                  </Col>
               </Row>
            </div>
         </section>
      </>
   )
}

export default Wishlist
