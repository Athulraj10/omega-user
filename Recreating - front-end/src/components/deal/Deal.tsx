"use client";
import { Col, Row } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import ItemCard from "../product-item/ItemCard";
import { Fade } from "react-awesome-reveal";
import DealendTimer from "../dealend-timer/DealendTimer";
import Spinner from "../button/Spinner";
import { useEffect, useState } from "react";
import { showErrorToast } from "../toast-popup/Toastify";

const Deal = ({
  onSuccess = () => { },
  hasPaginate = false,
  onError = () => { },
}) => {
  const [data, setData] = useState([])
  const [error, setError] = useState(null)

  const fetchData = async () => {
    try {
      const response = await fetch('/api/deal', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
   

      if (result?.meta?.code === 200) {
        setData(result.data)
        return
      }
    } catch (error: any) {
      setError(error)
      console.error('FETCH PRODUCTS ERROR:', error);
    }
  }
  
  useEffect(() => {
    fetchData()
  }, [])

  if (error) <Spinner />
  const getData = () => {
    if (hasPaginate) return data;
    else return data;
  };

  return (
    <>
      <section
        className="gi-deal-section padding-tb-40 wow fadeInUp"
        data-wow-duration="2s"
      >
        <div className="container">
          <Row className="overflow-hidden m-b-minus-24px">
            <Col lg={12} className="gi-deal-section col-lg-12">
              <div className="gi-products">
                <div
                  className="section-title"
                  data-aos="fade-up"
                  data-aos-duration="2000"
                  data-aos-delay="200"
                >
                  <Fade triggerOnce direction="up" duration={2000} delay={200}>
                    <div className="section-detail">
                      <h2 className="gi-title">
                        Day of the <span>deal</span>
                      </h2>
                      <p>Don`t wait. The time will never be just right.</p>
                    </div>
                  </Fade>
                  <DealendTimer />
                </div>
                <Fade
                  triggerOnce
                  direction="up"
                  duration={2000}
                  delay={200}
                  className="gi-deal-block m-minus-lr-12"
                >
                  <div className="deal-slick-carousel gi-product-slider slick-initialized slick-slider">
                    <div className="slick-list draggable">
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
                          1200: {
                            slidesPerView: 5,
                          },
                          1440: {
                            slidesPerView: 5,
                          },
                        }}
                        className="slick-track"
                      >
                        {data && data?.length && getData() && Array.isArray(getData()) && getData().map((item: any, index: number) => (
                          <SwiperSlide key={index} className="slick-slide">
                            <ItemCard data={item} />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>
                  </div>
                </Fade>
              </div>
            </Col>
          </Row>
        </div>
      </section>
    </>
  );
};

export default Deal;
