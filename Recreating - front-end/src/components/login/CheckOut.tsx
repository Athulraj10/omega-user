"use client";
import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import ItemCard from "../product-item/ItemCard";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import StarRating from "../stars/StarRating";
import { Fade } from "react-awesome-reveal";
import Breadcrumb from "../breadcrumb/Breadcrumb";
import useSWR from "swr";
import fetcher from "../fetcher-api/Fetcher";
import { Col, Form, Row } from "react-bootstrap";
import Spinner from "../button/Spinner";
import { useRouter } from "next/navigation";
import { clearCart } from "@/store/reducers/cartSlice";
import { login } from "@/store/reducers/registrationSlice";
import { showErrorToast, showSuccessToast } from "../toast-popup/Toastify";
import location from "@/utility/header/location";
import { useAddress } from "@/store/hooks";
import OrderApiService from "../../services/orderApi";
import { CreateOrderRequest } from "../../types/order";

// import DiscountCoupon from "../discount-coupon/DiscountCoupon";
import { Address } from "../../types/address";

interface Registration {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  postCode: string;
  country: string;
  state: string;
  password: string;
  uid: any;
}

const CheckOut = ({
  onSuccess = () => { },
  hasPaginate = false,
  onError = () => { },
}) => {
  const [email, setEmail] = useState("");
  const [validated, setValidated] = useState(false);
  const [password, setPassword] = useState("");
  const [registrations, setRegistrations] = useState<Registration[]>([]);

  const dispatch = useDispatch();
  const router = useRouter();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const orders = useSelector((state: RootState) => state.cart.orders);
  const isLogin = useSelector(
    (state: RootState) => state.registration.isAuthenticated
  );
  const country = location
  
  
  
  const [subTotal, setSubTotal] = useState(0);
  const [vat, setVat] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState("free");
  const [billingMethod, setBillingMethod] = useState("new");
  const [billingVisible, setBillingVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [filteredCountryData, setFilteredCountryData] = useState<any[]>([]);
  const checkboxRef = useRef<HTMLInputElement>(null);
  
  // Address management using Redux
  const {
    addresses,
    setAddressesData,
    addAddressData,
    updateAddressData,
    removeAddressData,
    setDefaultAddressData,
  } = useAddress();

  const [formData, setFormData]: any = useState({
    firstName: "",
    lastName: "",
    address: "",
    country: "",
    mobileNo: "",
  });


  useEffect(() => {
    if (selectedAddress) {
      setBillingMethod("use");
    } else {
      setBillingMethod("new");
    }
  }, [selectedAddress]);

  useEffect(() => {
    // Only show billing for logged-in users
    if (isLogin) {
      setBillingVisible(true);
    } else {
      setBillingVisible(false);
    }
  }, [isLogin]);

  // Load addresses for logged-in users
  useEffect(() => {
    if (isLogin) {
      const loadAddresses = async () => {
        try {
          const token = JSON.parse(localStorage.getItem('token') || '');
          const response = await fetch("/api/addresses", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const addressesData = await response.json();
            setAddressesData(addressesData.data);
          }
        } catch (error) {
          console.error("Error loading addresses:", error);
        }
      };

      loadAddresses();
    }
  }, [isLogin]);

  console.log({"addresses----------------":addresses})

  useEffect(() => {
    if (country) {
      setFilteredCountryData(country)
    }
  }, [country]);

  const handleDeliveryChange = (event: any) => {
    setSelectedMethod(event.target.value);
  };

  const handleBillingChange = (event: any) => {
    setBillingMethod(event.target.value);
  };



  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      const addressData = {
        label: "Home",
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        country: formData.country,
        mobileNo: formData.mobileNo || "",
      };
      console.log({"addressData----------------":addressData})


      if (isEditingAddress && editingAddressId) {
        // Update existing address via API
        const token = JSON.parse(localStorage.getItem('token') || '');
        const response = await fetch(`/api/addresses/${editingAddressId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(addressData),
        });

        if (!response.ok) throw new Error("Failed to update address");

        const updatedAddress = await response.json();
        updateAddressData(updatedAddress);
        showSuccessToast("Address updated successfully");
        setIsEditingAddress(false);
        setEditingAddressId(null);
      } else {
        // Create new address via API
        const token = JSON.parse(localStorage.getItem('token') || '');
        const response = await fetch("/api/addresses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(addressData),
        });

        if (!response.ok) throw new Error("Failed to save address");

        const newAddress = await response.json();
        addAddressData(newAddress.data);
        showSuccessToast("Address added successfully");
      }

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        postalCode: "",
        country: "",
        state: "",
        mobileNo: "",
      });

      setValidated(false);
    } catch (error: any) {
      showErrorToast(error.message || "Failed to save address");
    }
  };


  const handleInputChange = (e: any, additionalValue: string = "") => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
      ...(name === "country" && { countryName: additionalValue }),
      ...(name === "state" && { stateName: additionalValue }),
    });
  };


  // item Price

  useEffect(() => {
    if (cartItems?.length === 0) {
      setSubTotal(0);
      setVat(0);
      return;
    }

    const subtotal = cartItems.reduce(
      (acc, item) => acc + item.newPrice * item.quantity,
      0
    );
    setSubTotal(subtotal);
    // Calculate VAT
    const vatAmount = subtotal * 0.2;
    setVat(vatAmount);
  }, [cartItems]);


  const discountAmount = subTotal * (discount / 100);
  const total = subTotal + vat - discountAmount;
  // item Price end

  const { data, error } = useSWR("/api/deal", fetcher, { onSuccess, onError });

  if (error) return <div>Failed to load products</div>;
  if (!data)
    return (
      <div>
        <Spinner />
      </div>
    );

  const getData = () => {
    if (hasPaginate) return data.data;
    else return data;
  };


  const handleCheckout = async () => {
    if (!isLogin) {
      showErrorToast("Please login to place an order.");
      return;
    }
   
    if (!selectedAddress) {
      showErrorToast("Please select a billing address.");
      return;
    }

    try {
      // Prepare order items from cart
      const orderItems = cartItems.map((item: any) => ({
        product: item._id || item.id,
        title: item.title,
        image: item.image,
        price: item.newPrice,
        quantity: item.quantity,
        totalPrice: item.newPrice * item.quantity,
      }));

      // Prepare order data
      const orderData: CreateOrderRequest = {
        items: orderItems,
        shippingAddress: {
          label: selectedAddress.label || "Home",
          addressLine1: selectedAddress.addressLine1,
          city: selectedAddress.city || "",
          state: selectedAddress.state || "",
          postalCode: selectedAddress.postalCode || "",
          country: selectedAddress.country,
          phone: selectedAddress.phone || "",
        },
        billingAddress: {
          label: selectedAddress.label || "Home",
          addressLine1: selectedAddress.addressLine1,
          city: selectedAddress.city || "",
          state: selectedAddress.state || "",
          postalCode: selectedAddress.postalCode || "",
          country: selectedAddress.country,
          phone: selectedAddress.phone || "",
        },
        paymentMethod: "cash_on_delivery",
        shippingMethod: selectedMethod === "free" ? "free" : "standard",
        subtotal: subTotal,
        tax: vat,
        discount: discountAmount,
        total: total,
        notes: "",
      };
console.log({"orderData----------------":orderData})
return
      // Create order via API
      const newOrder = await OrderApiService.createOrder(orderData);
      
      showSuccessToast(`Order placed successfully! Order #${newOrder.orderNumber}`);
      
      // Clear cart after successful order
      dispatch(clearCart());
      
      // Redirect to orders page
      router.push("/orders");
      
    } catch (error: any) {
      console.error("Error placing order:", error);
      showErrorToast(error.message || "Failed to place order. Please try again.");
    }
  };

  const handleRemoveAddress = async (addressId: string) => {
    try {
      const token = JSON.parse(localStorage.getItem('token') || '');
      const response = await fetch(`/api/addresses/${addressId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to remove address");

      removeAddressData(addressId);
      showSuccessToast("Address removed successfully");
    } catch (error: any) {
      showErrorToast(error.message || "Failed to remove address");
    }
  };

  const handleSelectAddress = (address: any) => {
    setSelectedAddress(address);
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    try {
      const token = JSON.parse(localStorage.getItem('token') || '');
      console.log({"token----------------":token})
      const response = await fetch(`/api/addresses/${addressId}/default`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      

      if (!response.ok) throw new Error("Failed to set default address");

      const updatedAddress = await response.json();
      setDefaultAddressData(addressId);
      showSuccessToast("Default address updated successfully");
    } catch (error: any) {
      showErrorToast(error.message || "Failed to set default address");
    }
  };

  const handleEditAddress = (address: any) => {
    setIsEditingAddress(true);
    setEditingAddressId(address.id);
    setFormData({
      firstName: address.firstName,
      lastName: address.lastName,
      address: address.address,
      country: address.country,
      mobileNo: address.mobileNo || "",
    });
    setBillingMethod("new"); // Switch to new address form for editing
  };

  const handleCountryChange = async (e: any) => {
    const { value, options, selectedIndex } = e.target;
    const countryName = options[selectedIndex].text;
    handleInputChange(e, countryName);
  };

  
  return (
    <>
      <Breadcrumb title={"Checkout"} />
      <section className="gi-checkout-section padding-tb-40">
        <h2 className="d-none">Checkout Page</h2>
        <div className="container">
          {cartItems?.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                fontSize: "20px",
                fontWeight: "300",
              }}
              className="gi-pro-content cart-pro-title"
            >
              {" "}
              Your cart is currently empty. Please add items to your cart to
              proceed.
            </div>
          ) : (
            <Row>
              {/* <!-- Sidebar Area Start --> */}
              <Col lg={4} md={12} className="gi-checkout-rightside">
                <div className="gi-sidebar-wrap">
                  {/* <!-- Sidebar Summary Block --> */}
                  <div className="gi-sidebar-block">
                    <div className="gi-sb-title">
                      <h3 className="gi-sidebar-title">Summary</h3>
                    </div>
                    <div className="gi-sb-block-content">
                      <div className="gi-checkout-summary">
                        <div>
                          <span className="text-left">Sub-Total</span>
                          <span className="text-right">
                            ${subTotal.toFixed(2)}
                          </span>
                        </div>
                        <div>
                          <span className="text-left">Delivery Charges</span>
                          <span className="text-right">${vat.toFixed(2)}</span>
                        </div>
                        <div>
                          {/* <DiscountCoupon
                            onDiscountApplied={handleDiscountApplied}
                          /> */}
                        </div>
                        <div className="gi-checkout-coupan-content">
                          <form
                            className="gi-checkout-coupan-form"
                            name="gi-checkout-coupan-form"
                            method="post"
                            action="#"
                          >
                            <input
                              className="gi-coupan"
                              type="text"
                              required
                              placeholder="Enter Your Coupan Code"
                              name="gi-coupan"
                              defaultValue=""
                            />
                            <button
                              className="gi-coupan-btn gi-btn-2"
                              type="submit"
                              name="subscribe"
                            >
                              Apply
                            </button>
                          </form>
                        </div>
                        <div className="gi-checkout-summary-total">
                          <span className="text-left">Total Amount</span>
                          <span className="text-right">
                            ${total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <div className="gi-checkout-pro">
                        {cartItems?.map((item: any, index: number) => (
                          <div key={index} className="col-sm-12 mb-6">
                            <div className="gi-product-inner">
                              <div className="gi-pro-image-outer">
                                <div className="gi-pro-image">
                                  <a
                                    href="/product-left-sidebar"
                                    className="image"
                                  >
                                    <img
                                      className="main-image"
                                      src={item.image}
                                      alt="Product"
                                    />
                                    <img
                                      className="hover-image"
                                      src={item.imageTwo}
                                      alt="Product"
                                    />
                                  </a>
                                </div>
                              </div>
                              <div className="gi-pro-content">
                                <h5 className="gi-pro-title">
                                  <a href="/product-left-sidebar">
                                    {item.title}
                                  </a>
                                </h5>
                                <div className="gi-pro-rating">
                                  <StarRating rating={item.rating} />
                                </div>
                                <span className="gi-price">
                                  <span className="old-price">
                                    ${item.oldPrice}.00{" "}
                                  </span>
                                  <span className="new-price">
                                    ${item.newPrice}.00
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* <!-- Sidebar Summary Block --> */}
                </div>
                <div className="gi-sidebar-wrap gi-checkout-del-wrap">
                  {/* <!-- Sidebar Summary Block --> */}
                  <div className="gi-sidebar-block">
                    <div className="gi-sb-title">
                      <h3 className="gi-sidebar-title">Delivery Method</h3>
                    </div>
                    <div className="gi-sb-block-content">
                      <div className="gi-checkout-del">
                        <div className="gi-del-desc">
                          Please select the preferred shipping method to use on
                          this order.
                        </div>
                        <form action="#">
                          <span className="gi-del-option">
                            <span>
                              <span className="gi-del-opt-head">
                                Free Shipping
                              </span>
                              <input
                                type="radio"
                                id="del1"
                                name="radio-group"
                                value="free"
                                checked={selectedMethod === "free"}
                                onChange={handleDeliveryChange}
                              />
                              <label htmlFor="del1">Rate - $0.00</label>
                            </span>
                          </span>

                        </form>
                      </div>
                    </div>
                  </div>
                  {/* <!-- Sidebar Summary Block --> */}
                </div>
                <div className="gi-sidebar-wrap gi-checkout-pay-wrap">
                  {/* <!-- Sidebar Payment Block --> */}
                  <div className="gi-sidebar-block">
                    <div className="gi-sb-title">
                      <h3 className="gi-sidebar-title">Payment Method</h3>
                    </div>
                    <div className="gi-sb-block-content">
                      <div className="gi-checkout-pay">
                        <div className="gi-pay-desc">
                          Please select the preferred payment method to use on
                          this order.
                        </div>
                        <form action="#">
                          <span className="gi-pay-option">
                            <span>
                              <input
                                readOnly
                                type="radio"
                                id="pay1"
                                name="radio-group"
                                value=""
                                checked
                              />
                              <label htmlFor="pay1">Cash On Delivery</label>
                            </span>
                          </span>

                        </form>
                      </div>
                    </div>
                  </div>
                  {/* <!-- Sidebar Payment Block --> */}
                </div>
                <div className="gi-sidebar-wrap gi-check-pay-img-wrap">
                  {/* <!-- Sidebar Payment Block --> */}
                  <div className="gi-sidebar-block">
                    <div className="gi-sb-title">
                      <h3 className="gi-sidebar-title">Payment Method</h3>
                    </div>
                    <div className="gi-sb-block-content">
                      <div className="gi-check-pay-img-inner">
                        <div className="gi-check-pay-img">
                          <img
                            src={
                              process.env.NEXT_PUBLIC_URL +
                              "/assets/img/hero-bg/payment.png"
                            }
                            alt="payment"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </Col>
              <Col lg={8} md={12} className="gi-checkout-leftside m-t-991">
                {/* <!-- checkout content Start --> */}
                <div className="gi-checkout-content">
                  <div className="gi-checkout-inner">
                    {!isLogin && (
                      <div className="gi-checkout-wrap m-b-40">
                        <div className="gi-checkout-block">
                          <h3 className="gi-checkout-title">Login Required</h3>
                          <div className="gi-check-block-content">
                            <div className="gi-check-subtitle">
                              Please login to continue with your order
                            </div>
                            <div className="gi-new-desc">
                              You need to be logged in to place an order. Please login or register to continue.
                            </div>
                            <div className="gi-new-btn">
                              <a
                                onClick={() => router.push("/login")}
                                className="gi-btn-2"
                              >
                                Login
                              </a>
                              <a
                                onClick={() => router.push("/register")}
                                className="gi-btn-2"
                                style={{ marginLeft: "10px" }}
                              >
                                Register
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {billingVisible && (
                      <div className="gi-checkout-wrap m-b-30 padding-bottom-3">
                        <div className="gi-checkout-block gi-check-bill">
                          <h3 className="gi-checkout-title">Billing Details</h3>
                          <div className="gi-bl-block-content">
                            <div className="gi-check-subtitle">
                              Checkout Options
                            </div>
                            <span className="gi-bill-option">
                              <span>
                                <input
                                  type="radio"
                                  id="bill1"
                                  name="radio-group"
                                  value="use"
                                  checked={billingMethod === "use"}
                                  onChange={handleBillingChange}
                                  disabled={addresses.length === 0}
                                />
                                <label htmlFor="bill1">
                                  I want to use an existing address
                                </label>
                              </span>
                              <span>
                                <input
                                  type="radio"
                                  id="bill2"
                                  name="radio-group"
                                  value="new"
                                  checked={
                                    billingMethod === "new" ||
                                    addresses.length === 0
                                  }
                                  onChange={handleBillingChange}
                                />
                                <label htmlFor="bill2">
                                  I want to use new address
                                </label>
                              </span>
                            </span>
                            {(billingMethod === "new" ||
                              addresses.length === 0) && (
                                <div className="gi-check-bill-form">
                                  <Form
                                    noValidate
                                    validated={validated}
                                    onSubmit={handleSubmit}
                                    action="#"
                                    method="post"
                                  >
                                    <span
                                      style={{ marginTop: "10px" }}
                                      className="gi-bill-wrap gi-bill-half"
                                    >
                                      <label>First Name*</label>
                                      <Form.Group>
                                        <Form.Control
                                          type="text"
                                          name="firstName"
                                          placeholder="Enter your first name"
                                          required
                                          value={formData.firstName}
                                          onChange={handleInputChange}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                          Please Enter First Name.
                                        </Form.Control.Feedback>
                                      </Form.Group>
                                    </span>
                                    <span
                                      style={{ marginTop: "10px" }}
                                      className="gi-bill-wrap gi-bill-half"
                                    >
                                      <label>Last Name*</label>
                                      <Form.Group>
                                        <Form.Control
                                          type="text"
                                          name="lastName"
                                          placeholder="Enter your last name"
                                          required
                                          value={formData.lastName}
                                          onChange={handleInputChange}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                          Please Enter Last Name.
                                        </Form.Control.Feedback>
                                      </Form.Group>
                                    </span>
                                    <span
                                      style={{ marginTop: "10px" }}
                                      className="gi-bill-wrap"
                                    >
                                      <label>Address</label>
                                      <Form.Group>
                                        <Form.Control
                                          type="text"
                                          name="address"
                                          placeholder="Address Line 1"
                                          value={formData.address}
                                          onChange={handleInputChange}
                                          required
                                        />
                                        <Form.Control.Feedback type="invalid">
                                          Please Enter Address.
                                        </Form.Control.Feedback>
                                      </Form.Group>
                                    </span>
                                    <span
                                      style={{ marginTop: "10px" }}
                                      className="gi-bill-wrap"
                                    >
                                      <label>Mobile Number</label>
                                      <Form.Group>
                                        <Form.Control
                                          type="text"
                                          name="mobileNo"
                                          placeholder="Contact Number"
                                          value={formData.mobileNo}
                                          onChange={handleInputChange}
                                          required
                                        />
                                        <Form.Control.Feedback type="invalid">
                                          Please Enter mobile Number.
                                        </Form.Control.Feedback>
                                      </Form.Group>
                                    </span>
                                    <Form.Group
                                      style={{ marginTop: "10px" }}
                                      className="gi-bill-wrap gi-bill-half"
                                    >
                                      <label>Country</label>
                                      <span className="gi-bl-select-inner">
                                        <Form.Select
                                          size="sm"
                                          style={{ width: "1px" }}
                                          name="country"
                                          id="gi-select-state"
                                          className="gi-bill-select"
                                          defaultValue={formData.country}
                                          onChange={handleCountryChange}
                                          isInvalid={
                                            validated && !formData.country
                                          }
                                          required
                                        >
                                          <option value="" disabled>
                                            Country
                                          </option>
                                          {filteredCountryData && Array.isArray(filteredCountryData) && filteredCountryData.map(
                                            (country: any, index: number) => (
                                              <option
                                                key={index}
                                                value={country.name}
                                              >
                                                {country.name}
                                              </option>
                                            )
                                          )}
                                        </Form.Select>
                                      </span>
                                    </Form.Group>

                                    <span className="gi-check-order-btn">
                                      <button type="submit" className="gi-btn-2">
                                        {isEditingAddress ? "Update" : "Add"}
                                      </button>
                                    </span>
                                  </Form>
                                </div>
                              )}
                            {billingMethod === "use" &&
                              addresses.length > 0 && (
                                <>
                                  <div className="gi-checkout-block gi-check-bill">
                                    <div className="gi-sidebar-block">
                                      <div className="gi-sb-title">
                                        <h3 className="gi-sidebar-title">
                                          Address
                                        </h3>
                                      </div>
                                      <div className="gi-sb-block-content">
                                        <div className="gi-checkout-pay">
                                          {selectedAddress === null && (
                                            <div
                                              style={{ marginBottom: "15px" }}
                                              className="gi-pay-desc"
                                            >
                                              Please select the preferred
                                              Address to use on this order.
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    <ul>
                                      {addresses && Array.isArray(addresses) && addresses.map((address, index) => (
                                        <li key={index}>
                                          <div
                                            style={{
                                              padding: "10px",
                                              background: "transparent",
                                              position: "relative",
                                            }}
                                            className="bill-box m-b-30"
                                          >
                                            <div>
                                              <div
                                                style={{
                                                  position: "absolute",
                                                  top: "10px",
                                                  left: "10px",
                                                }}
                                                className="checkboxes__item"
                                              >
                                                <label className="checkbox style-c">
                                                  <input
                                                    value=""
                                                    type="checkbox"
                                                    checked={
                                                      selectedAddress != null &&
                                                      selectedAddress._id ===
                                                      address._id
                                                    }
                                                    onChange={() =>
                                                      handleSelectAddress(
                                                        address
                                                      )
                                                    }
                                                  />
                                                  <div className="checkbox__checkmark"></div>
                                                  <div className="checkbox__body"></div>
                                                </label>
                                              </div>
                                              <Row
                                                style={{ padding: "0 30px" }}
                                              >
                                                <Col
                                                  style={{ lineHeight: "25px" }}
                                                  lg={6}
                                                  md={6}
                                                  sm={12}
                                                >
                                                  <div className="gi-single-list">
                                                    <ul>
                                                      <li>
                                                        <strong className="gi-check-subtitle">
                                                          Label :
                                                        </strong>{" "}
                                                        <span
                                                          style={{
                                                            color: "#777",
                                                          }}
                                                        >
                                                          {address.label}
                                                          {address.isDefault && (
                                                            <span
                                                              style={{
                                                                color: "#5caf90",
                                                                fontWeight: "bold",
                                                                marginLeft: "8px",
                                                                fontSize: "12px",
                                                                backgroundColor: "#f0f8f0",
                                                                padding: "2px 6px",
                                                                borderRadius: "4px"
                                                              }}
                                                            >
                                                              (Default)
                                                            </span>
                                                          )}
                                                        </span>
                                                      </li>
                                                      <li>
                                                        <strong className="gi-check-subtitle">
                                                          Address :
                                                        </strong>{" "}
                                                        <span
                                                          style={{
                                                            color: "#777",
                                                          }}
                                                        >
                                                          {address.address}
                                                        </span>
                                                      </li>
                                                      <li>
                                                        <strong className="gi-check-subtitle">
                                                          Mobile Number :
                                                        </strong>{" "}
                                                        <span
                                                          style={{
                                                            color: "#777",
                                                          }}
                                                        >
                                                          {address.mobileNo ?? "N/a"}
                                                        </span>
                                                      </li>
                                                    </ul>
                                                  </div>
                                                </Col>
                                               
                                              </Row>

                                              <div style={{ position: "absolute", top: "10px", right: "40px" }}>
                                                <button
                                                  onClick={() => handleEditAddress(address)}
                                                  style={{
                                                    fontSize: "12px",
                                                    color: "#5caf90",
                                                    background: "none",
                                                    border: "none",
                                                    cursor: "pointer",
                                                    marginRight: "10px"
                                                  }}
                                                >
                                                  Edit
                                                </button>
                                                <button
                                                  onClick={() => handleSetDefaultAddress(address.id)}
                                                  disabled={address.isDefault}
                                                  style={{
                                                    fontSize: "12px",
                                                    color: address.isDefault ? "#ccc" : "#5caf90",
                                                    background: "none",
                                                    border: "none",
                                                    cursor: address.isDefault ? "not-allowed" : "pointer",
                                                    marginRight: "10px",
                                                    opacity: address.isDefault ? 0.6 : 1
                                                  }}
                                                >
                                                  {address.isDefault ? "Default" : "Set Default"}
                                                </button>
                                                <a
                                                  style={{
                                                    fontSize: "30px",
                                                    color: "#5caf90",
                                                  }}
                                                  onClick={() =>
                                                    handleRemoveAddress(address.id)
                                                  }
                                                  href="#/"
                                                  className="remove"
                                                >
                                                  ×
                                                </a>
                                              </div>
                                            </div>
                                          </div>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </>
                              )}
                          </div>
                        </div>
                      </div>
                    )}
                    {isLogin && billingVisible && (
                      <span className="gi-check-order-btn">
                        <a onClick={handleCheckout} className="gi-btn-2">
                          Place Order
                        </a>
                      </span>
                    )}
                  </div>
                </div>
                {/* <!--cart content End --> */}
              </Col>
            </Row>
          )}
        </div>
      </section>
      {cartItems.length !== 0 && (
        <section className="gi-new-product padding-tb-40">
          <div className="container">
            <Row className="overflow-hidden m-b-minus-24px">
              <Col lg={12} className="gi-new-prod-section col-lg-12">
                <div className="gi-products">
                  <Fade
                    direction="up"
                    duration={2000}
                    triggerOnce
                    delay={200}
                    className="section-title-2"
                    data-aos="fade-up"
                    data-aos-duration="2000"
                    data-aos-delay="200"
                  >
                    <h2 className="gi-title">
                      New <span>Arrivals</span>
                    </h2>
                    <p>Browse The Collection of Top Products</p>
                  </Fade>
                  <Fade
                    direction="up"
                    duration={2000}
                    triggerOnce
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
                      className="deal-slick-carousel gi-product-slider"
                      breakpoints={{
                        0: {
                          slidesPerView: 1,
                        },
                        320: {
                          slidesPerView: 1,
                          spaceBetween: 25,
                        },
                        426: {
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
                    >
                      {getData() && Array.isArray(getData()) && getData().map((item: any, index: number) => (
                        <SwiperSlide key={index}>
                          <ItemCard data={item} />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </Fade>
                </div>
              </Col>
            </Row>
          </div>
        </section>
      )}
    </>
  );
};

export default CheckOut;



{/* <span className="gi-pay-commemt">
                            <span className="gi-pay-opt-head">
                              Add Comments About Your Order
                            </span>
                            <textarea
                              name="your-commemt"
                              placeholder="Comments"
                            ></textarea>
                          </span> */}
{/* <span className="gi-pay-agree">
                            <input
                              ref={checkboxRef}
                              required
                              checked={isTermsChecked}
                              onChange={() =>
                                setIsTermsChecked(!isTermsChecked)
                              }
                              type="checkbox"
                              value=""
                            />
                            <a href="#">
                              I have read and agree to the{" "}
                              <span>Terms & Conditions.</span>
                            </a>
                            <span className="checked"></span>
                          </span> */}





{/* <span>
                              <span className="gi-del-opt-head">Flat Rate</span>
                              <input
                                type="radio"
                                id="del2"
                                name="radio-group"
                                value="flat"
                                checked={selectedMethod === "flat"}
                                onChange={handleDeliveryChange}
                              />
                              <label htmlFor="del2">Rate - $5.00</label>
                          </span>
                          {/* <span className="gi-del-comment">
                            <span className="gi-del-opt-head">
                              Add Comments About Your Order
                            </span>
                            <textarea
                              name="your-comment"
                              placeholder="Comments"
                            ></textarea>
                          </span> */}