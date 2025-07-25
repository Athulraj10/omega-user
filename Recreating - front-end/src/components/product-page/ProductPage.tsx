"use client";

import useSWR from "swr";
import { useDispatch, useSelector } from "react-redux";
import { Col } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";

import Spinner from "../button/Spinner";
import StarRating from "../stars/StarRating";
import SidebarArea from "../shop-sidebar/sidebar-area/SidebarArea";
import ProductTeb from "./product-teb/ProductTeb";
import SingleProductContent from "./single-product-content/SingleProductContent";
import fetcher from "../fetcher-api/Fetcher";

import {
  setRange,
  setSelectedCategory,
  setSelectedColor,
  setSelectedTags,
  setSelectedWeight,
} from "@/store/reducers/filterReducer";
import { RootState } from "@/store";

const ProductPage = ({
  productId,
  order = "",
  none = "none",
  lg = 12,
  hasPaginate = false,
}) => {
  const dispatch = useDispatch();

  const {
    selectedCategory,
    selectedWeight,
    minPrice,
    maxPrice,
    selectedColor,
    selectedTags,
  } = useSelector((state: RootState) => state.filter);

  // SWR: Dynamically fetch product or fallback to /api/moreitem
  const { data, error, isLoading } = useSWR(
    productId ? `/api/products/${productId}` : "/api/moreitem",
    fetcher
  );

  const handlePriceChange = (min: number, max: number) => {
    dispatch(setRange({ min, max }));
  };

  const handleCategoryChange = (category) => {
    const updated = selectedCategory.includes(category)
      ? selectedCategory.filter((c) => c !== category)
      : [...selectedCategory, category];
    dispatch(setSelectedCategory(updated));
  };

  const handleWeightChange = (weight) => {
    const updated = selectedWeight.includes(weight)
      ? selectedWeight.filter((w) => w !== weight)
      : [...selectedWeight, weight];
    dispatch(setSelectedWeight(updated));
  };

  const handleColorChange = (color) => {
    const updated = selectedColor.includes(color)
      ? selectedColor.filter((c) => c !== color)
      : [...selectedColor, color];
    dispatch(setSelectedColor(updated));
  };

  const handleTagsChange = (tag) => {
    const updated = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    dispatch(setSelectedTags(updated));
  };

  if (isLoading) return <Spinner />;
  if (error) return <div>Failed to load product data</div>;
  if (!data) return <div>No product found</div>;
  console.log("single product data", data)
  // Render Single Product View
  if (productId) {
    return (
      <>
        <Col
          lg={lg}
          md={12}
          className={`gi-pro-rightside gi-common-rightside ${order}`}
        >
          <div className="single-pro-block">
            <SingleProductContent productData={data.data} />
          </div>
          <ProductTeb productData={data.data} />
        </Col>

        <SidebarArea
          min={minPrice}
          max={maxPrice}
          handleCategoryChange={handleCategoryChange}
          handleWeightChange={handleWeightChange}
          handleColorChange={handleColorChange}
          handleTagsChange={handleTagsChange}
          handlePriceChange={handlePriceChange}
          selectedCategory={selectedCategory}
          selectedWeight={selectedWeight}
          selectedColor={selectedColor}
          selectedTags={selectedTags}
          none={none}
          order={order}
        />
      </>
    );
  }

  // Render Multiple Products View
  let filteredData = [...data];

  if (selectedCategory.length > 0) {
    filteredData = filteredData.filter((item) =>
      selectedCategory.includes(item.category)
    );
  }

  if (selectedWeight.length > 0) {
    filteredData = filteredData.filter((item) =>
      selectedWeight.includes(item.weight)
    );
  }

  if (selectedColor.length > 0) {
    filteredData = filteredData.filter((item) =>
      selectedColor.includes(item.Color)
    );
  }

  if (selectedTags.length > 0) {
    filteredData = filteredData.filter((item) =>
      selectedTags.includes(item.tags)
    );
  }

  return (
    <>
      <Col
        lg={lg}
        md={12}
        className={`gi-pro-rightside gi-common-rightside ${order}`}
      >
        <div className="single-add-more m-tb-40">
          <Swiper
            loop={true}
            autoplay={{ delay: 1000 }}
            slidesPerView={3}
            spaceBetween={20}
            breakpoints={{
              0: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="gi-add-more-slider owl-carousel"
          >
            {filteredData.map((item, index) => (
              <SwiperSlide key={index} className="add-more-item">
                <a href="" className="gi-btn-2">+</a>
                <div className="add-more-img">
                  <img src={item.image} alt="product" />
                </div>
                <div className="add-more-info">
                  <h5>{item.title}</h5>
                  <span className="gi-pro-rating">
                    <StarRating rating={item.rating} />
                  </span>
                  <span className="gi-price">
                    <span className="new-price">${item.newPrice}</span>
                    <span className="old-price">${item.oldPrice}</span>
                  </span>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <ProductTeb />
      </Col>

      <SidebarArea
        min={minPrice}
        max={maxPrice}
        handleCategoryChange={handleCategoryChange}
        handleWeightChange={handleWeightChange}
        handleColorChange={handleColorChange}
        handleTagsChange={handleTagsChange}
        handlePriceChange={handlePriceChange}
        selectedCategory={selectedCategory}
        selectedWeight={selectedWeight}
        selectedColor={selectedColor}
        selectedTags={selectedTags}
        none={none}
        order={order}
      />
    </>
  );
};

export default ProductPage;
