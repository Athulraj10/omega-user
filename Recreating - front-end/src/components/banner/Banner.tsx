"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Fade } from "react-awesome-reveal";
import { Col, Row } from "react-bootstrap";
import axios from "axios";
import { BannerItem } from "@/types";

const Banner = () => {
  const [banners, setBanners] = useState<BannerItem[]>([]);

  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        const response = await axios.get("/api/banner");
        setBanners(response.data?.data || []);
      } catch (error) {
        console.error("Failed to load banner data:", error);
      }
    };

    fetchBannerData();
  }, []);

  return (
    <Fade triggerOnce direction="up" duration={2000} delay={200}>
      <section className="gi-banner padding-tb-40 wow fadeInUp" data-wow-duration="2s">
        <div className="container">
          <Row>
            <Col md={12}>
              <div className="gi-animated-banner" data-aos="fade-up" data-aos-duration="2000" data-aos-delay="200">
                <h2 className="d-none">Offers</h2>

                {banners.length === 0 ? (
                  <div className="d-flex justify-content-center align-items-center" style={{ height: "370px" }}>
                    <div className="spinner-grow text-success" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>

                ) : (
                  banners.map((banner, index) => (
                    <div className="gi-bnr-detail" key={index}>
                      <div className="gi-bnr-info">
                        <h2>
                          {banner.titleLine1} <br /> {banner.titleLine2}
                        </h2>
                        <h3>
                          {banner.offerText} <span>{banner.offerHighlight}</span>
                        </h3>
                        <Link href={banner.link || "/"} className="gi-btn-2">
                          {banner.buttonText || "Shop now"}
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Col>
          </Row>
        </div>
      </section>
    </Fade>
  );
};

export default Banner;
