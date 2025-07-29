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
import { useCartWishlist } from "../../hooks/useCartWishlist"
import { removeWishlist } from "../../store/reducers/wishlistSlice";

interface Item {
  id: string;
  title: string;
  newPrice: number;
  waight: string;
  image: string;
  imageTwo: string;
  date: string;
  status: string;
  rating: number;
  oldPrice: number;
  location: string;
  brand: string;
  sku: string;
  category: string;
  quantity: number;
}

const Wishlist = ({
  onSuccess = () => { },
  hasPaginate = false,
  onError = () => { },
}) => {
  const dispatch = useDispatch();
  const [currentDate, setCurrentDate] = useState(new Date().toLocaleDateString("en-GB"));

  // Use the new cart/wishlist hook for backend integration
  const {
    cartData,
    cartLoading,
    isAuthenticated,
    userToken,
    refreshCart,
    getCartCount,
    addToCart,
    removeFromCart,
    addToWishlist,
    removeFromWishlist,
    checkWishlistStatus,
    isInWishlist,
    wishlistLoading,
    wishlistData,
    refreshWishlist
  } = useCartWishlist();

  // Fallback to Redux state for backward compatibility
  const reduxWishlistItems = useSelector(
    (state: RootState) => state.wishlist.wishlist
  );

  // Use backend data if available, otherwise fallback to Redux
  const wishlistItems = wishlistData?.items || reduxWishlistItems || [];

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString("en-GB"));
  }, []);

  // Debug logging
  useEffect(() => {
    console.log("Wishlist component debug:");
    console.log("isAuthenticated:", isAuthenticated);
    console.log("wishlistLoading:", wishlistLoading);
    console.log("wishlistData:", wishlistData);
    console.log("reduxWishlistItems:", reduxWishlistItems);
    console.log("final wishlistItems:", wishlistItems);
    console.log("wishlistData?.items:", wishlistData?.items);
    console.log("wishlistData?.totalItems:", wishlistData?.totalItems);
    console.log("reduxWishlistItems length:", reduxWishlistItems?.length);
  }, [isAuthenticated, wishlistLoading, wishlistData, reduxWishlistItems, wishlistItems]);

  const handleRemoveFromwishlist = (id: string) => {
    // Try to use backend API first
    if (isAuthenticated && userToken) {
      removeFromWishlist(id);
    } else {
      // Fallback to Redux (convert string id to number for Redux)
      const numericId = parseInt(id.replace(/[^0-9]/g, "")) || Math.floor(Math.random() * 10000);
      dispatch(removeWishlist(numericId));
    }
  };

  const handleCart = (data: Item) => {
    // Try to use backend API first
    if (isAuthenticated && userToken) {
      addToCart(data.id, data.quantity || 1);
    } else {
      // Fallback to Redux - transform data to match Redux structure
      const reduxItem = {
        _id: parseInt(data.id.replace(/[^0-9]/g, "")) || Math.floor(Math.random() * 10000),
        title: data.title,
        newPrice: data.newPrice,
        oldPrice: data.oldPrice,
        waight: data.waight,
        image: data.image,
        imageTwo: data.imageTwo,
        date: data.date,
        status: data.status,
        rating: data.rating,
        location: data.location,
        brand: data.brand,
        sku: parseInt(data.sku) || Math.floor(Math.random() * 10000),
        category: data.category,
        quantity: data.quantity || 1
      };
      dispatch(addItem(reduxItem));
    }
  };

  // Show loading state
  if (wishlistLoading) {
    return (
      <div className="container text-center py-5">
        <Spinner />
        <p>Loading wishlist...</p>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="container text-center py-5">
        <h3>Please Login</h3>
        <p>You need to be logged in to view your wishlist.</p>
        <a href="/login" className="btn btn-primary">Login</a>
      </div>
    );
  }

  return (
    <>
      <section className="gi-faq padding-tb-40 gi-wishlist">
        <div className="container">
          <div className="section-title-2">
            <h2 className="gi-title">
              Product <span>Wishlist</span>
            </h2>
            <p>Your product wish is our first priority.</p>
          </div>
          {!wishlistItems || wishlistItems.length === 0 ? (
            <h4 className="text-center">Your wishlist is empty.</h4>
          ) : (
            <Row>
              <Col md={12}>
                <div className="gi-vendor-dashboard-card">
                  <div className="gi-vendor-card-header">
                    <h5>Wishlist</h5>
                    <div className="gi-header-btn">
                      <a className="gi-btn-2" href="#">
                        Shop Now
                      </a>
                    </div>
                  </div>
                  <div className="gi-vendor-card-body">
                    <div className="gi-vendor-card-table">
                      <table className="table gi-table">
                        <thead>
                          <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Image</th>
                            <th scope="col">Name</th>
                            <th scope="col">Date</th>
                            <th scope="col">Price</th>
                            <th scope="col">Status</th>
                            <th scope="col">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="wish-empt">
                          {Array.isArray(wishlistItems) && wishlistItems.map((data, index) => (
                            <tr key={index} className="pro-gl-content">
                              <td scope="row">
                                <span>{index + 1}</span>
                              </td>
                              <td>
                                <img
                                  className="prod-img"
                                  src={data.image}
                                  alt="product image"
                                />
                              </td>
                              <td>
                                <span>{data.title}</span>
                              </td>
                              <td>
                                <span>{currentDate}</span>
                              </td>
                              <td>
                                <span className="gi-price">
                                  AED {data.newPrice}
                                </span>
                              </td>
                              <td>
                                <span className="gi-status">
                                  {data.status}
                                </span>
                              </td>
                              <td>
                                <span className="gi-action">
                                  <a
                                    onClick={() => handleCart(data)}
                                    className="gi-btn-1 gi-add-cart btn"
                                    href="#"
                                    title="Add To Cart"
                                  >
                                    <i className="fi-rr-shopping-basket"></i>
                                  </a>
                                  <a
                                    onClick={() =>
                                      handleRemoveFromwishlist(data.id)
                                    }
                                    className="gi-btn-1 gi-remove-wish btn"
                                    href="#"
                                    title="Remove From List"
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
      <section className="gi-new-product padding-tb-40">
        <div className="container">
          <Row className="overflow-hidden m-b-minus-24px">
            <Col lg={12} className="gi-new-prod-section">
              <div className="gi-products">
                <Fade
                  triggerOnce
                  direction="up"
                  duration={2000}
                  delay={200}
                  className="section-title-2"
                >
                  <h2 className="gi-title">
                    New <span>Arrivals</span>
                  </h2>
                  <p>Browse The Collection of Top Products</p>
                </Fade>
                <Fade
                  triggerOnce
                  direction="up"
                  duration={2000}
                  delay={200}
                  className="gi-new-block m-minus-lr-12"
                  data-aos="fade-up"
                  data-aos-duration="2000"
                  data-aos-delay="300"
                >
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
                    className="deal-slick-carousel gi-product-slider"
                  >
                    {/* {getData().map((item: any, index: number) => (
                      <SwiperSlide key={index}>
                        <ItemCard data={item} />
                      </SwiperSlide>
                    ))} */}
                  </Swiper>
                </Fade>
              </div>
            </Col>
          </Row>
        </div>
      </section>
    </>
  );
};

export default Wishlist;
