import React, { useEffect, useState } from "react";
import { Tab, TabList, Tabs } from "react-tabs";
import { Fade } from "react-awesome-reveal";
import RatingComponent from "@/components/stars/RatingCompoents";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Form } from "react-bootstrap";

export interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  postCode: string;
  country: string;
  state: string;
  profilePhoto?: string;
  description: string;
}

const getRegistrationData = () => {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("registrationData");
    return data ? JSON.parse(data) : null;
  }
  return null;
};

const ProductTeb = ({ productData }: { productData?: any }) => {
  console.log("productData", productData)
  const login = useSelector(
    (state: RootState) => state.registration.isAuthenticated
  );
  const [userData, setUserData] = useState<any | null>(null);
  const [validated, setValidated] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    if (login) {
      const data = getRegistrationData();
      if (data?.length > 0) {
        setUserData(data[data.length - 1]);
      }
    }
  }, [login]);

  useEffect(() => {
    if (productData?.reviews?.length) {
      setReviews(productData.reviews);
    }
  }, [productData]);

  const handleProductClick = (index: number) => {
    setSelectedIndex(index);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      if (userData && comment && rating) {
        setReviews([
          ...reviews,
          {
            name: `${userData.firstName} ${userData.lastName}`,
            rating,
            comment,
            avatar:
              userData.profilePhoto || "/assets/img/avatar/placeholder.jpg",
          },
        ]);

        setComment("");
        setRating(0);
      }
    }

    setValidated(true);
  };

  return (
    <Tabs
      selectedIndex={selectedIndex}
      onSelect={(selectedIndex) => setSelectedIndex(selectedIndex)}
      className="gi-single-pro-tab"
    >
      <div className="gi-single-pro-tab-wrapper">
        <TabList className="gi-single-pro-tab-nav">
          <ul className="nav nav-tabs" role="tablist">
            <Tab className="nav-item" role="presentation">
              <button
                className={`nav-link ${selectedIndex == 0 ? "active" : ""}`}
                onClick={() => handleProductClick(0)}
              >
                Detail
              </button>
            </Tab>
            <Tab className="nav-item" role="presentation">
              <button
                className={`nav-link ${selectedIndex == 1 ? "active" : ""}`}
                onClick={() => handleProductClick(1)}
              >
                Specifications
              </button>
            </Tab>
            <Tab className="nav-item" role="presentation">
              <button
                className={`nav-link ${selectedIndex == 2 ? "active" : ""}`}
                onClick={() => handleProductClick(2)}
              >
                Vendor
              </button>
            </Tab>
            <Tab className="nav-item" role="presentation">
              <button
                className={`nav-link ${selectedIndex == 3 ? "active" : ""}`}
                onClick={() => handleProductClick(3)}
              >
                Reviews
              </button>
            </Tab>
          </ul>
        </TabList>

        <div className="tab-content gi-single-pro-tab-content">
          {/* DETAILS TAB */}
          <Fade
            duration={1000}
            className={`tab-pane fade ${
              selectedIndex === 0 ? "show active" : ""
            }`}
          >
            <div className="gi-single-pro-tab-desc">
              <p>{productData?.description || "No description available."}</p>
            </div>
          </Fade>

          {/* SPECIFICATIONS TAB */}
          <Fade
            duration={1000}
            className={`tab-pane fade ${
              selectedIndex === 1 ? "show active" : ""
            }`}
          >
            <div className="gi-single-pro-tab-moreinfo">
              {productData?.specifications ? (
                <ul>
                  {Object.entries(productData.specifications).map(
                    ([key, value]: [string, any]) => (
                      <li key={key}>
                        <span>{key}</span> {value}
                      </li>
                    )
                  )}
                </ul>
              ) : (
                <p>No specifications available.</p>
              )}
            </div>
          </Fade>

          {/* VENDOR TAB */}
          <Fade
            duration={1000}
            className={`tab-pane fade ${
              selectedIndex === 2 ? "show active" : ""
            }`}
          >
            <div className="gi-single-pro-tab-moreinfo">
              {productData?.seller ? (
                <>
                  <h5>Vendor Name: {productData?.seller?.userName}</h5>
                  <p>{productData?.seller?.companyName}</p>
                  <p>{productData?.seller?.address}</p>
                </>
              ) : (
                <p>No vendor information available.</p>
              )}
            </div>
          </Fade>

          {/* REVIEWS TAB */}
          <Fade
            duration={1000}
            className={`tab-pane fade ${
              selectedIndex === 3 ? "show active" : ""
            }`}
          >
            {!login ? (
              <div className="container">
                <p>
                  Please <a href="/login">login</a> or{" "}
                  <a href="/register">register</a> to review the product.
                </p>
              </div>
            ) : (
              <div className="row">
                <div className="gi-t-review-wrapper">
                  {reviews.map((data, index) => (
                    <div key={index} className="gi-t-review-item">
                      <div className="gi-t-review-avtar">
                        <img
                          src={
                            data.avatar ||
                            "/assets/img/avatar/placeholder.jpg"
                          }
                          alt="user"
                        />
                      </div>
                      <div className="gi-t-review-content">
                        <div className="gi-t-review-top">
                          <div className="gi-t-review-name">{data.name}</div>
                          <div className="gi-t-review-rating">
                            {[...Array(5)].map((_, i) => (
                              <i
                                key={i}
                                className={`gicon gi-star ${
                                  i < data.rating ? "fill" : "gi-star-o"
                                }`}
                              ></i>
                            ))}
                          </div>
                        </div>
                        <div className="gi-t-review-bottom">
                          <p>{data.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="gi-ratting-content">
                  <h3>Add a Review</h3>
                  <div className="gi-ratting-form">
                    <Form
                      noValidate
                      validated={validated}
                      onSubmit={handleSubmit}
                      action="#"
                    >
                      <div className="gi-ratting-star">
                        <RatingComponent onChange={setRating} value={rating} />
                      </div>
                      <div className="gi-ratting-input form-submit">
                        <Form.Group>
                          <Form.Control
                            as="textarea"
                            name="comment"
                            placeholder="Enter Your Comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Please Enter your reply
                          </Form.Control.Feedback>
                        </Form.Group>
                        <button
                          style={{ marginTop: "15px" }}
                          className="gi-btn-2"
                          type="submit"
                        >
                          Submit
                        </button>
                      </div>
                    </Form>
                  </div>
                </div>
              </div>
            )}
          </Fade>
        </div>
      </div>
    </Tabs>
  );
};

export default ProductTeb;
