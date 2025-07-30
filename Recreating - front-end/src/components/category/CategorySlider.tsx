"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Col } from "react-bootstrap";
import CategoryItemTwo from "../product-item/CategoryItemTwo";
import Spinner from "../button/Spinner";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import React from "react";

const CategorySlider = ({
  onSuccess = () => {},
  hasPaginate = false,
  onError = () => {},
}) => {
  const { direction } = useSelector((state: RootState) => state.theme);
  const { categories,loading } = useSelector((state: RootState) => state.categories);
  
  // Handle success and error callbacks
  React.useEffect(() => {
    if (categories && categories.length > 0) {
      onSuccess();
    }
  }, [categories, onSuccess]);


  if (loading) {
    return (
      <Col xl={12} className="border-content-color">
        <div className="text-center py-5">
          <Spinner />
        </div>
      </Col>
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
      <Col xl={12} className="border-content-color">
        <div className="text-center py-5">
          <p>No categories available</p>
        </div>
      </Col>
    );
  }

  return (
    <>
      <Col xl={12} className="border-content-color">
        <Swiper
          dir={direction == "RTL" ? "rtl" : "ltr"}
          loop={true}
          autoplay={{ delay: 1000 }}
          slidesPerView={4}
          spaceBetween={20}
          breakpoints={{
            0: {
              slidesPerView: 1,
              spaceBetween: 25,
            },
            419: {
              slidesPerView: 1,
              spaceBetween: 25,
            },
            420: {
              slidesPerView: 2,
              spaceBetween: 25,
            },
            767: {
              slidesPerView: 2,
              spaceBetween: 25,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 25,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 25,
            },
            1025: {
              slidesPerView: 3,
              spaceBetween: 25,
            },
            1200: {
              slidesPerView: 4,
              spaceBetween: 25,
            },
            1440: {
              slidesPerView: 4,
              spaceBetween: 25,
            },
          }}
          className={`gi-category-block owl-carousel  ${direction == "RTL" ? "rtl" : "ltr"}`}
        >
          {data.map((item: any, index: number) => (
            <SwiperSlide
              key={item.id || index}
              className={`gi-cat-box gi-cat-box-${item.num}`}
            >
              <CategoryItemTwo data={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </Col>
    </>
  );
};

export default CategorySlider;
