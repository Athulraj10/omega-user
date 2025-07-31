import React, { useEffect, useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import useSWR from "swr";
import fetcher from "../../fetcher-api/Fetcher";
import QuantitySelector from "../../quantity-selector/QuantitySelector";
import Spinner from "@/components/button/Spinner";
import ZoomImage from "@/components/zoom-image/ZoomImage";
import StarRating from "../../stars/StarRating";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { useCart, useWishlist } from "@/store/hooks";

const SingleProductContent = ({
  productData,
  onSuccess = () => { },
  hasPaginate = false,
  onError = () => { },
}) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [isSliderInitialized, setIsSliderInitialized] = useState(false);
  
  const initialRef: any = null;
  const slider1 = useRef<Slider | null>(initialRef);
  const slider2 = useRef<Slider | null>(initialRef);
  const hasCheckedWishlist = useRef<Set<string>>(new Set());

  // Use new Redux hooks
  const { items: cartItems, addToCartData } = useCart();
  const { 
    items: wishlistItems, 
    addToWishlistData, 
    removeFromWishlistData,
    addingItem,
    removingItem
  } = useWishlist();
  const isAuthenticated = useSelector((state: RootState) => state.registration.isAuthenticated);
console.log({cartItems})
  // If productData is provided, use it directly, otherwise fetch from API
  const { data, error } = productData
    ? { data: productData, error: null }
    : useSWR("/api/productphoto", fetcher, {
      onSuccess,
      onError,
    });

  const slider1Settings = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: false,
    asNavFor: slider2.current,
    focusOnSelect: true,
  };

  const slider2Settings = {
    slidesToShow: 4,
    slidesToScroll: 1,
    asNavFor: slider1.current,
    dots: false,
    arrows: true,
    focusOnSelect: true,
  };

  useEffect(() => {
    setIsSliderInitialized(true);
  }, [isSliderInitialized]);

  // Clear cache when authentication changes
  useEffect(() => {
    if (!isAuthenticated) {
      hasCheckedWishlist.current.clear();
    }
  }, [isAuthenticated]);

  const handleSlider1Click = (index: any) => {
    if (slider2.current) {
      slider2.current.slickGoTo(index);
    }
  };

  const handleSlider2Click = (index: any) => {
    if (slider1.current) {
      slider1.current.slickGoTo(index);
    }
  };

  const handleAddToCart = () => {
    if (!data) return;

    const cartItem = {
      _id: typeof data._id === 'string' ? parseInt(data._id) : (data._id || Math.floor(Math.random() * 10000)),
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
      sku: data.sku,
      category: data.category,
      quantity,
    };

    addToCartData(cartItem);
  };

  const handleWishlistToggle = async () => {
    try {
      const productId = data._id;
      if (productId === undefined || productId === null) {
        console.error("Cannot toggle wishlist: product ID is undefined");
        return;
      }
      
      if (isInWishlist(productId.toString())) {
        removeFromWishlistData(productId.toString());
      } else {
        // Create wishlist item object
        const wishlistItem = {
          id: productId.toString(),
          title: data.name || data.title || '',
          price: data.discountPrice || data.newPrice || 0,
          image: data.images?.[0] || data.image || '',
          slug: data.slug || '',
          category: data.category?.name || data.category || '',
          brand: data.brand || '',
          rating: data.rating || 0,
          reviews: 0,
          inStock: true,
          addedAt: new Date().toISOString(),
        };
        
        addToWishlistData(wishlistItem);
      }
    } catch (error) {
      console.error("Wishlist operation failed:", error);
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.id === productId);
  };

  const isInCart = (productId: string) => {
    return cartItems?.items?.some(item => {
      const itemId = item._id;
      return itemId !== undefined && itemId !== null && itemId.toString() === productId;
    });
  };

  const getCartItemQuantity = (productId: string) => {
    const item = cartItems.find(item => {
      const itemId = item._id;
      return itemId !== undefined && itemId !== null && itemId.toString() === productId;
    });
    return item ? item.quantity : 0;
  };

  // Debug wishlist status
  console.log("Product ID:", data?._id);
  console.log("Is in wishlist:", data?._id ? isInWishlist(data._id.toString()) : false);
  console.log("Wishlist loading:", addingItem || removingItem);
  console.log("Wishlist button class:", `gi-btn-group wishlist ${data?._id ? isInWishlist(data._id.toString()) : false ? 'active' : ''} ${addingItem || removingItem ? 'disabled' : ''}`);

  if (error) return <div>Failed to load products</div>;
  if (!data)
    return (
      <div>
        <Spinner />
      </div>
    );

  const getData = () => {
    if (hasPaginate) return data;
    else return [data];
  };

  return (
    <>
      <div className="single-pro-inner">
        <Row>
          {isSliderInitialized && (
            <Col className="single-pro-img">
              <div className="single-product-scroll">
                <Slider
                  {...slider1Settings}
                  ref={(slider) => (slider1.current = slider)}
                  className="single-product-cover"
                >
                  {getData().map((item: any, index: any) => (
                    <div
                      key={index}
                      className="single-slide zoom-image-hover"
                      onClick={() => handleSlider1Click(index)}
                    >
                      <ZoomImage
                        src={item.image}
                        alt="" />
                    </div>
                  ))}
                </Slider>
                <Slider
                  {...slider2Settings}
                  ref={(slider) => (slider2.current = slider)}
                  className="single-nav-thumb"
                >
                  {getData().map((item: any, index: number) => (
                    <div
                      key={index}
                      className="single-slide"
                      onClick={() => handleSlider2Click(index)}
                    >
                      <img className="img-responsive" src={item.image} alt="" />
                    </div>
                  ))}
                </Slider>
              </div>
            </Col>
          )}
          <Col className="single-pro-desc m-t-991">
            <div className="single-pro-content">
              <h5 className="gi-single-title">
                {data?.name || "Product Name"}
              </h5>

              <div className="gi-single-rating-wrap">
                <div className="gi-single-rating">
                  <StarRating rating={data?.rating || 0} />
                </div>
                <span className="gi-read-review">
                  |&nbsp;&nbsp;
                  <a href="#gi-spt-nav-review">
                    {data?.reviews?.length || 0} Ratings
                  </a>
                </span>
              </div>

              <div className="gi-single-price-stoke">
                <div className="gi-single-price">
                  <div className="final-price">
                    AED {data?.discountPrice || data?.price || 0}
                    {data?.discountPrice && data?.price && (
                      <span className="price-des">
                        -{Math.round(((data.price - data.discountPrice) / data.price) * 100)}%
                      </span>
                    )}
                  </div>
                  {data?.discountPrice && data?.price && (
                    <div className="mrp">
                      M.R.P. : <span>AED {data.price}</span>
                    </div>
                  )}
                </div>
                <div className="gi-single-stoke">
                  <span className="gi-single-sku">SKU#: {data?.sku || "N/A"}</span>
                  <span className="gi-single-ps-title">
                    {data?.stock > 0 ? "IN STOCK" : "OUT OF STOCK"}
                  </span>
                </div>
              </div>

              <div className="gi-single-desc">
                {data?.description || "No description available."}
              </div>

              {data?.specifications && (
                <div className="gi-single-list">
                  <ul>
                    {Object.entries(data.specifications || {}).map(([key, value]) => (
                      <li key={key}>
                        <strong>{key} :</strong> {String(value)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {data?.weights && Array.isArray(data.weights) && data.weights.length > 0 && (
                <div className="gi-pro-variation">
                  <div className="gi-pro-variation-inner gi-pro-variation-size">
                    <span>Weight</span>
                    <div className="gi-pro-variation-content">
                      <ul>
                        {data.weights.map((weight, index) => (
                          <li key={index} className={index === 0 ? "active" : ""}>
                            <span>{weight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {isAuthenticated && (
                <div className="gi-single-qty">
                  <div className="qty-plus-minus">
                    <QuantitySelector
                      setQuantity={setQuantity}
                      quantity={quantity}
                      id={data._id || data.id}
                    />
                  </div>

                  <div className="gi-single-cart">
                    <button 
                      className={`btn btn-primary gi-btn-1 ${addingItem || removingItem ? 'disabled' : ''} ${isInCart(data._id) ? 'added' : ''}`}
                      onClick={handleAddToCart}
                      disabled={addingItem || removingItem || data?.stock < 1 || isInCart(data._id)}
                    >
                      {addingItem || removingItem ? (
                        <>
                          <Spinner />
                          {addingItem ? "Adding..." : "Removing..."}
                        </>
                      ) : isInCart(data._id) ? (
                        <>
                          <i className="fi-rr-check"></i>
                          Already in Cart
                        </>
                      ) : (
                        data?.stock > 0 ? "Add To Cart" : "Out of Stock"
                      )}
                    </button>
                  </div>

                  <div className="gi-single-wishlist">
                    <button 
                      className={`gi-btn-group wishlist ${isInWishlist(data._id) ? 'active' : ''} ${addingItem || removingItem ? 'disabled' : ''}`}
                      title={isInWishlist(data._id) ? "Remove from Wishlist" : "Add to Wishlist"}
                      onClick={handleWishlistToggle}
                      disabled={addingItem || removingItem}
                      aria-label={isInWishlist(data._id) ? "Remove from Wishlist" : "Add to Wishlist"}
                      data-product-id={data._id}
                    >
                      <i className={`fi-rr-heart ${isInWishlist(data._id) ? 'filled' : ''}`}></i>
                    </button>
                  </div>

                  <div className="gi-single-quickview">
                    <a
                      href="#"
                      className="gi-btn-group quickview"
                      data-link-action="quickview"
                      title="Quick view"
                      data-bs-toggle="modal"
                      data-bs-target="#gi_quickview_modal"
                    >
                      <i className="fi-rr-eye"></i>
                    </a>
                  </div>
                </div>
              )}

              {!isAuthenticated && (
                <div className="gi-single-login-prompt">
                  <p>Please <a href="/login">login</a> to add items to cart or wishlist</p>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default SingleProductContent;
