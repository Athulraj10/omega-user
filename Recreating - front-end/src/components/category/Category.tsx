"use client";
import { Col, Row } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import CategoryItem from "../product-item/CategoryItem";
import Spinner from "../button/Spinner";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import React from "react";

const Category = ({
  onSuccess = () => {},
  hasPaginate = false,
  onError = () => {},
  className = "padding-tb-40",
}) => {
  const { direction } = useSelector((state: RootState) => state.theme);
 
  const { categories,loading } = useSelector((state: RootState) => state.categories);
  console.log("categories from Redux:", categories);
  // Handle success and error callbacks
  React.useEffect(() => {
    if (categories && Array.isArray(categories) && categories.length > 0) {
      onSuccess();
    }
  }, [categories, onSuccess]);


  if (loading) {
    return (
      <section className={`gi-category body-bg ${className}`}>
        <div className="container">
          <div className="text-center py-5">
            <Spinner />
          </div>
        </div>
      </section>
    );
  }

  

  const getData = () => {
    // Ensure we always return an array
    if (!categories || !Array.isArray(categories)) {
      return [];
    }
    return categories;
  };

  const data = getData();

  // Don't render if no data
  if (!data || data.length === 0) {
    return (
      <section className={`gi-category body-bg ${className}`}>
        <div className="container">
          <div className="text-center py-5">
            <p>No categories available</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`gi-category body-bg ${className}`}>
      <div className="container">
        <Row className="m-b-minus-15px">
          <Col xl={12}>
            <Swiper
              dir={direction == "RTL" ? "rtl" : "ltr"}
              loop={true}
              autoplay={{ delay: 1000 }}
              slidesPerView={5}
              spaceBetween={20}
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
                767: {
                  slidesPerView: 2,
                },
                768: {
                  slidesPerView: 3,
                },
                1024: {
                  slidesPerView: 4,
                },
                1200: {
                  slidesPerView: 5,
                },
                1440: {
                  slidesPerView: 6,
                },
              }}
              className={`gi-category-block owl-carousel  ${direction == "RTL" ? "rtl" : "ltr"}`}
            >
              {data.map((item: any, index: number) => (
                <SwiperSlide
                  key={item.id || index}
                  className={`gi-cat-box gi-cat-box-${item.num}`}
                >
                  <CategoryItem item={item} />
                </SwiperSlide>
              ))}
            </Swiper>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default Category;
