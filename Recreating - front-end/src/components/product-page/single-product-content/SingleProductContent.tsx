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
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { useCart, useWishlist } from "@/store/hooks";

const SingleProductContent = ({
  productData,
  onSuccess = () => {},
  hasPaginate = false,
  onError = () => {},
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isSliderInitialized, setIsSliderInitialized] = useState(false);
  const [addingItem, setAddingItem] = useState(false);

  const slider1 = useRef(null);
  const slider2 = useRef(null);
  const hasCheckedWishlist = useRef(new Set());

  const { cartItems, addToCartData } = useCart();
  const {
    wishlistItems,
    addToWishlistData,
    removeFromWishlistData,
  } = useWishlist();
  const isAuthenticated = useSelector((state: RootState) => state.registration.isAuthenticated);

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
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      hasCheckedWishlist.current.clear();
    }
  }, [isAuthenticated]);

  const handleSliderClick = (sliderRef, index) => {
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(index);
    }
  };

  const handleAddToCart = () => {
    if (!data) return;
    setAddingItem(true);
    const cartItem = {
      _id: data._id?.toString() || Math.floor(Math.random() * 10000).toString(),
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
    setAddingItem(false);
  };

  const handleWishlistToggle = async () => {
    if (!data?._id) return;
    const productId = data._id.toString();
    if (isInWishlist(productId)) {
      removeFromWishlistData(productId);
    } else {
      const wishlistItem = {
        id: productId,
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
  };

  const isInWishlist = (productId) => wishlistItems?.some(item => item.id === productId);
  const isInCart = (productId) => cartItems?.some(item => item._id?.toString() === productId);

  if (error) return <div>Failed to load products</div>;
  if (!data) return <Spinner />;

  const products = hasPaginate ? data : [data];

  return (
    <div className="single-pro-inner">
      <Row>
        {isSliderInitialized && (
          <Col className="single-pro-img">
            <div className="single-product-scroll">
              <Slider {...slider1Settings} ref={slider1} className="single-product-cover">
                {products.map((item, index) => (
                  <div key={index} className="single-slide zoom-image-hover" onClick={() => handleSliderClick(slider2, index)}>
                    <ZoomImage src={item.image} alt="" />
                  </div>
                ))}
              </Slider>
              <Slider {...slider2Settings} ref={slider2} className="single-nav-thumb">
                {products.map((item, index) => (
                  <div key={index} className="single-slide" onClick={() => handleSliderClick(slider1, index)}>
                    <img className="img-responsive" src={item.image} alt="" />
                  </div>
                ))}
              </Slider>
            </div>
          </Col>
        )}

        <Col className="single-pro-desc m-t-991">
          <div className="single-pro-content">
            <h5 className="gi-single-title">{data?.name || "Product Name"}</h5>
            <div className="gi-single-rating-wrap">
              <div className="gi-single-rating">
                <StarRating rating={data?.rating || 0} />
              </div>
              <span className="gi-read-review">| <a href="#gi-spt-nav-review">{data?.reviews?.length || 0} Ratings</a></span>
            </div>
            <div className="gi-single-price-stoke">
              <div className="gi-single-price">
                <div className="final-price">AED {data?.discountPrice || data?.price || 0}</div>
                {data?.discountPrice && data?.price && (
                  <>
                    <div className="price-des">-{Math.round(((data.price - data.discountPrice) / data.price) * 100)}%</div>
                    <div className="mrp">M.R.P. : <span>AED {data.price}</span></div>
                  </>
                )}
              </div>
              <div className="gi-single-stoke">
                <span className="gi-single-sku">SKU#: {data?.sku || "N/A"}</span>
                <span className="gi-single-ps-title">{data?.stock > 0 ? "IN STOCK" : "OUT OF STOCK"}</span>
              </div>
            </div>

            <div className="gi-single-desc">{data?.description || "No description available."}</div>

            {data?.specifications && (
              <div className="gi-single-list">
                <ul>
                  {Object.entries(data.specifications).map(([key, value]) => (
                    <li key={key}><strong>{key} :</strong> {String(value)}</li>
                  ))}
                </ul>
              </div>
            )}

            {data?.weights?.length > 0 && (
              <div className="gi-pro-variation">
                <div className="gi-pro-variation-inner gi-pro-variation-size">
                  <span>Weight</span>
                  <div className="gi-pro-variation-content">
                    <ul>
                      {data.weights.map((weight, index) => (
                        <li key={index}><span>{weight}</span></li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {isAuthenticated ? (
              <div className="gi-single-qty">
                <QuantitySelector setQuantity={setQuantity} quantity={quantity} id={data._id} />
                <div className="gi-single-cart">
                  <button
                    className={`btn btn-primary gi-btn-1 ${isInCart(data._id?.toString()) ? 'added' : ''}`}
                    onClick={handleAddToCart}
                    disabled={data?.stock < 1 || isInCart(data._id?.toString()) || addingItem}
                  >
                    {addingItem ? <Spinner /> : isInCart(data._id?.toString()) ? "Already in Cart" : "Add To Cart"}
                  </button>
                </div>

                <div className="gi-single-wishlist">
                  <button
                    className={`gi-btn-group wishlist ${isInWishlist(data._id?.toString()) ? 'active' : ''}`}
                    onClick={handleWishlistToggle}
                    disabled={addingItem}
                  >
                    <i className={`fi-rr-heart ${isInWishlist(data._id?.toString()) ? 'filled' : ''}`}></i>
                  </button>
                </div>
              </div>
            ) : (
              <p>Please <a href="/login">login</a> to add items to cart or wishlist</p>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default SingleProductContent;
