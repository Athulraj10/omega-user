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

const SingleProductContent = ({
  productData,
  onSuccess = () => { },
  hasPaginate = false,
  onError = () => { },
}) => {
  const authUser = useSelector((state: any) => state.registration.isAuthenticated);
  console.log("authUser", authUser)

  const [quantity, setQuantity] = useState(1);
  const [isSliderInitialized, setIsSliderInitialized] = useState(false);
  const initialRef: any = null;
  const slider1 = useRef<Slider | null>(initialRef);
  const slider2 = useRef<Slider | null>(initialRef);

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

  // If productData is provided, use it directly, otherwise fetch from API
  const { data, error } = productData
    ? { data: productData, error: null }
    : useSWR("/api/productphoto", fetcher, {
      onSuccess,
      onError,
    });

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
  console.log("getData", getData())
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
                    {Object.entries(data.specifications).map(([key, value]) => (
                      <li key={key}>
                        <strong>{key} :</strong> {String(value)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {data?.weights && data.weights.length > 0 && (
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

              {authUser && (
              <div className="gi-single-qty">
                <div className="qty-plus-minus">
                  <QuantitySelector
                    setQuantity={setQuantity}
                    quantity={quantity}
                    id={data._id || data.id}
                  />
                </div>

                <div className="gi-single-cart">
                  <button className="btn btn-primary gi-btn-1">
                    Add To Cart
                  </button>
                </div>

                <div className="gi-single-wishlist">
                  <a className="gi-btn-group wishlist" title="Wishlist">
                    <i className="fi-rr-heart"></i>
                  </a>
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
            </div>
          </Col>

        </Row>
      </div>
    </>
  );
};

export default SingleProductContent;
