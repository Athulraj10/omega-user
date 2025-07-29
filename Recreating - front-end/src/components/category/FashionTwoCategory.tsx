"use client";
import { Col, Row } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import CategoryItemTwo from "../product-item/CategoryItemTwo";
import { Fade } from "react-awesome-reveal";
import Spinner from "../button/Spinner";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useCategories } from "@/hooks/useCategories";
import React from "react";

const Category = ({
  onSuccess = () => {},
  hasPaginate = false,
  onError = () => {},
}) => {
  const { direction } = useSelector((state: RootState) => state.theme);
  const { categories, loading, error } = useCategories();

  // Handle success and error callbacks
  React.useEffect(() => {
    if (categories.length > 0) {
      onSuccess();
    }
  }, [categories, onSuccess]);

  React.useEffect(() => {
    if (error) {
      onError();
    }
  }, [error, onError]);

  if (loading) {
    return (
      <Fade direction="up" triggerOnce>
        <section
          className="gi-category body-bg padding-tb-40 wow fadeInUp"
          data-wow-duration="2s"
        >
          <div className="container">
            <div className="text-center py-5">
              <Spinner />
            </div>
          </div>
        </section>
      </Fade>
    );
  }

  if (error) {
    return (
      <Fade direction="up" triggerOnce>
        <section
          className="gi-category body-bg padding-tb-40 wow fadeInUp"
          data-wow-duration="2s"
        >
          <div className="container">
            <div className="text-center py-5">
              <p className="text-danger">Failed to load categories</p>
            </div>
          </div>
        </section>
      </Fade>
    );
  }

  const getData = () => {
    if (hasPaginate) return categories;
    else return categories;
  };

  return (
    <Fade direction="up" triggerOnce>
      <section
        className="gi-category body-bg padding-tb-40 wow fadeInUp"
        data-wow-duration="2s"
      >
        <div className="container">
          <Row>
            <Col xl={12} className="border-content-color">
              <Swiper
                dir={direction == "RTL" ? "rtl" : "ltr"}
                loop={true}
                autoplay={{ delay: 1000 }}
                slidesPerView={5}
                spaceBetween={25}
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
                    slidesPerView: 4,
                    spaceBetween: 25,
                  },
                  1200: {
                    slidesPerView: 5,
                    spaceBetween: 25,
                  },
                  1440: {
                    slidesPerView: 6,
                    spaceBetween: 25,
                  },
                }}
                className={`gi-category-block owl-carousel ${direction == "RTL" ? "rtl" : "ltr"}`}
              >
                {getData().map((item: any, index: number) => (
                  <SwiperSlide key={item.id || index} className="owl-item">
                    <div className="gi-cat-box gi-cat-box-1 p-0">
                      <CategoryItemTwo data={item} />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </Col>
          </Row>
        </div>
      </section>
    </Fade>
  );
};

export default Category;
