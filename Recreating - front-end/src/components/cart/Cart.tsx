"use client";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import ItemCard from "../product-item/ItemCard";
import { Fade } from "react-awesome-reveal";
import useSWR from "swr";
import fetcher from "../fetcher-api/Fetcher";
import Spinner from "../button/Spinner";
import DiscountCoupon from "../discount-coupon/DiscountCoupon";
import QuantitySelector from "../quantity-selector/QuantitySelector";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { removeItem, updateQuantity } from "../../store/reducers/cartSlice";

interface Country {
  id: string;
  name: any;
  iso2: string;
}

interface State {
  id: string;
  StateName: any;
  state_code: string;
}

const Cart = ({
  onSuccess = () => {},
  hasPaginate = false,
  onError = () => {},
}) => {
  const dispatch = useDispatch();
  
  // Get cart data from Redux
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const isAuthenticated = useSelector((state: RootState) => state.registration.isAuthenticated);

  const [filteredCountryData, setFilteredCountryData] = useState<Country[]>([]);
  const [filteredStateData, setFilteredStateData] = useState<State[]>([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [subTotal, setSubTotal] = useState(0);
  const [vat, setVat] = useState(0);
  const [discount, setDiscount] = useState(0);

  const { data: country } = useSWR("/api/country", fetcher, {
    onSuccess,
    onError,
  });

  useEffect(() => {
    if (country) {
      setFilteredCountryData(
        country.map((country: any) => ({
          id: country.id,
          countryName: country.name,
          iso2: country.iso2,
        }))
      );
    }
  }, [country]);

  const handleCountryChange = async (e: any) => {
    const { value } = e.target;
    setLoadingStates(true);
    const response = await fetcher(`/api/state`, {
      country_code: value,
    });
    setLoadingStates(false);
    setFilteredStateData(
      response.map((state: any) => ({
        id: state.id,
        StateName: state.name,
        state_code: state.state_code,
      }))
    );
  };

  const handleStateChange = async (e: any) => {
    const { value, options, selectedIndex } = e.target;
    const stateName = options[selectedIndex].text;
  };

  useEffect(() => {
    if (cartItems && cartItems?.items?.length > 0) {
      const total = cartItems?.items?.reduce((sum, item) => sum + (item.newPrice * item.quantity), 0);
      setSubTotal(total);
      // Calculate VAT (20%)
      const vatAmount = total * 0.2;
      setVat(vatAmount);
    } else {
      setSubTotal(0);
      setVat(0);
    }
  }, [cartItems]);

  const handleDiscountApplied = (discount: number) => {
    setDiscount(discount);
  };

  const discountAmount = subTotal * (discount / 100);
  const total = subTotal + vat - discountAmount;

  const handleRemoveFromCart = (productId: number) => {
    dispatch(removeItem(productId));
  };

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    dispatch(updateQuantity({ id: productId, quantity: newQuantity }));
  };

  const { data, error } = useSWR("/api/deal", fetcher, { onSuccess, onError });

  if (error) return <div>Failed to load products</div>;
  if (!data)
    return (
      <div>
        <Spinner />
      </div>
    );

  const getData = () => {
    if (hasPaginate) return cartItems || [];
    else return cartItems || [];
  };


  return (
    <>
      <section className="gi-cart-section padding-tb-40">
        <h2 className="d-none">Cart Page</h2>
        <div className="container">
          {!isAuthenticated ? (
            <div
              style={{
                textAlign: "center",
                fontSize: "20px",
                fontWeight: "300",
              }}
              className="gi-pro-content cart-pro-title"
            >
              Please <a href="/login">login</a> to view your cart.
            </div>
          ) : (
            <div className="row">
              <div className="gi-cart-leftside col-lg-8 col-md-12 m-t-991">
                {/* <!-- cart content Start --> */}
                <div className="gi-cart-content">
                  <div className="gi-cart-inner">
                    <div className="row">
                      <form action="#">
                        <div className="table-content cart-table-content">
                          <table>
                            <thead>
                              <tr>
                                <th>Product</th>
                                <th>Price</th>
                                <th style={{ textAlign: "center" }}>
                                  Quantity
                                </th>
                                <th>Total</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {cartItems && Array.isArray(cartItems) && cartItems?.items?.map((item: any, index: number) => {
                                const itemId = item.id || item._id;
                                if (itemId === undefined || itemId === null) {
                                  console.error("Cannot render cart item: item ID is undefined");
                                  return null;
                                }
                                
                                return (
                                  <tr key={index}>
                                    <td
                                      data-label="Product"
                                      className="gi-cart-pro-name"
                                    >
                                      <a href="/product-left-sidebar">
                                        <img
                                          className="gi-cart-pro-img mr-4"
                                          src={item.image}
                                          alt=""
                                        />
                                        {item.title}
                                      </a>
                                    </td>
                                    <td
                                      data-label="Price"
                                      className="gi-cart-pro-price"
                                    >
                                      <span className="amount">
                                        AED {item.unitPrice}
                                      </span>
                                    </td>
                                    <td
                                      data-label="Quantity"
                                      className="gi-cart-pro-qty"
                                      style={{ textAlign: "center" }}
                                    >
                                      <div className="cart-qty-plus-minus">
                                        <QuantitySelector
                                          quantity={item.quantity}
                                          id={itemId}
                                          setQuantity={(quantity: number) => 
                                            handleQuantityChange(itemId, quantity)
                                          }
                                        />
                                      </div>
                                    </td>
                                    <td
                                      data-label="Total"
                                      className="gi-cart-pro-subtotal"
                                    >
                                      AED {item.totalPrice}
                                    </td>
                                    <td
                                      onClick={() => handleRemoveFromCart(itemId)}
                                      data-label="Remove"
                                      className="gi-cart-pro-remove"
                                    >
                                      <a href="#">
                                        <i className="gicon gi-trash-o"></i>
                                      </a>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                        <div className="row">
                          <div className="col-lg-12">
                            <div className="gi-cart-update-bottom">
                              <Link href="/">Continue Shopping</Link>
                              <Link href="/checkout" className="gi-btn-2">
                                Check Out
                              </Link>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                {/* <!--cart content End --> */}
              </div>

              <div className="gi-cart-rightside col-lg-4 col-md-12 m-t-991">
                {/* <!-- cart sidebar Start --> */}
                <div className="gi-cart-sidebar">
                  <div className="gi-cart-sidebar-inner">
                    <div className="gi-cart-sidebar-content">
                      <div className="gi-cart-sidebar-title">
                        <h4>Cart Totals</h4>
                      </div>
                      <div className="gi-cart-sidebar-content-inner">
                        <div className="gi-cart-sidebar-content-item">
                          <div className="gi-cart-sidebar-content-item-left">
                            <span>Subtotal</span>
                          </div>
                          <div className="gi-cart-sidebar-content-item-right">
                            <span>AED {subTotal.toFixed(2)}</span>
                          </div>
                        </div>
                        <div className="gi-cart-sidebar-content-item">
                          <div className="gi-cart-sidebar-content-item-left">
                            <span>VAT (20%)</span>
                          </div>
                          <div className="gi-cart-sidebar-content-item-right">
                            <span>AED {vat.toFixed(2)}</span>
                          </div>
                        </div>
                        {discount > 0 && (
                          <div className="gi-cart-sidebar-content-item">
                            <div className="gi-cart-sidebar-content-item-left">
                              <span>Discount</span>
                            </div>
                            <div className="gi-cart-sidebar-content-item-right">
                              <span>-AED {discountAmount.toFixed(2)}</span>
                            </div>
                          </div>
                        )}
                        <div className="gi-cart-sidebar-content-item gi-cart-sidebar-content-item-total">
                          <div className="gi-cart-sidebar-content-item-left">
                            <span>Total</span>
                          </div>
                          <div className="gi-cart-sidebar-content-item-right">
                            <span>AED {total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="gi-cart-sidebar-content-bottom">
                        <Link href="/checkout" className="gi-btn-2">
                          Proceed to Checkout
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <!-- cart sidebar End --> */}

                {/* <!-- discount coupon Start --> */}
                <DiscountCoupon onDiscountApplied={handleDiscountApplied} />
                {/* <!-- discount coupon End --> */}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* <!-- New Arrivals Section Start --> */}
      <section className="gi-new-prod-section padding-tb-40">
        <div className="container">
          <div className="row overflow-hidden m-b-minus-24px">
            <div className="gi-new-prod-section col-lg-12">
              <div className="gi-products">
                <Fade
                  triggerOnce
                  direction="up"
                  duration={2000}
                  delay={200}
                  className="section-title-2"
                  data-aos="fade-up"
                  data-aos-duration="2000"
                  data-aos-delay="200"
                >
                  <>
                    <h2 className="gi-title">
                      New <span>Arrivals</span>
                    </h2>
                    <p>Browse The Collection of Top Products</p>
                  </>
                </Fade>
                <div className="gi-products-inner">
                  <Swiper
                    spaceBetween={24}
                    slidesPerView={1}
                    breakpoints={{
                      576: {
                        slidesPerView: 2,
                      },
                      768: {
                        slidesPerView: 3,
                      },
                      992: {
                        slidesPerView: 4,
                      },
                    }}
                    loop={true}
                    autoplay={{
                      delay: 3000,
                      disableOnInteraction: false,
                    }}
                  >
                    {getData() && Array.isArray(getData()) && getData().map((item: any, index: number) => (
                      <SwiperSlide key={index}>
                        <ItemCard item={item} />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- New Arrivals Section End --> */}
    </>
  );
};

export default Cart; 