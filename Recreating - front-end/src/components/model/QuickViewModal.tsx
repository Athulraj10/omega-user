import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import StarRating from "../stars/StarRating";
import { useDispatch, useSelector } from "react-redux";
import { Fade } from "react-awesome-reveal";
import { Col, Row } from "react-bootstrap";
import QuantitySelector from "../quantity-selector/QuantitySelector";
import { RootState } from "../../store";
import { showSuccessToast } from "../toast-popup/Toastify";
import ZoomImage from "@/components/zoom-image/ZoomImage";
import SizeOptions from "../product-item/SizeOptions";
import { useCart } from "@/store/hooks";

interface Category {
  _id: string;
  name: string;
  id: string;
}

interface ProductData {
  _id: string;
  name: string;
  description: string;
  category: Category;
  subcategory: Category;
  price: number;
  discountPrice: number;
  images: string[];
  stock: number;
  minimumOrder: number;
  sku: string;
  status: string;
  rating: number;
  location: string;
  brand: string;
  weight: string;
  sale?: string;
}

interface QuickViewModalProps {
  show: boolean;
  handleClose: () => void;
  data: ProductData;
}

const fallbackImage = "/assets/img/product-images/1_1.jpg";

const QuickViewModal = ({ show, handleClose, data }: QuickViewModalProps) => {
  const dispatch = useDispatch();
  const { items: cartItems, addToCartData, updateCartItemData } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleCart = () => {
    const isItemInCart = cartItems.some((item) => item._id === data._id);

    const newItem = {
      _id: typeof data._id === 'string' ? parseInt(data._id) : data._id,
      title: data.name,
      newPrice: data.discountPrice,
      waight: data.weight,
      image: data.images?.[0] || fallbackImage,
      imageTwo: data.images?.[1] || fallbackImage,
      date: new Date().toISOString(),
      status: data.status,
      rating: data.rating,
      oldPrice: data.price,
      location: data.location,
      brand: data.brand,
      sku: data.sku,
      category: data.category?.name || "general",
      quantity,
    };

    if (!isItemInCart) {
      addToCartData(newItem);
    } else {
      const updatedCartItems = cartItems.map((item) => {
        const itemId = item.id || item._id;
        const dataId = data._id;
        if (itemId !== undefined && itemId !== null && dataId !== undefined && dataId !== null && itemId === dataId) {
          return {
            ...item,
            quantity: item.quantity + quantity,
            price: item.newPrice + data.discountPrice,
          };
        }
        return item;
      });
      
      // Find the updated item and update its quantity
      const updatedItem = updatedCartItems.find((item) => {
        const itemId = item.id || item._id;
        const dataId = data._id;
        return itemId !== undefined && itemId !== null && dataId !== undefined && dataId !== null && itemId === dataId;
      });
      
      if (updatedItem) {
        const numericId = typeof data._id === 'string' ? parseInt(data._id) : data._id;
        updateCartItemData(numericId, updatedItem.quantity);
      }
    }

    showSuccessToast("Add product in Cart Successfully!", { icon: false });
  };

  return (
    <Fade>
      <Modal
        centered
        show={show}
        onHide={handleClose}
        keyboard={false}
        className="modal fade quickview-modal"
        id="gi_quickview_modal"
        tabIndex={-1}
        role="dialog"
      >
        <div className="modal-dialog-centered" role="document">
          <div className="modal-content">
            <button
              type="button"
              className="btn-close qty_close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={handleClose}
            ></button>
            <Modal.Body>
              <Row>
                <Col md={5} sm={12} className="mb-767">
                  <div className="single-pro-img single-pro-img-no-sidebar">
                    <div className="single-product-scroll">
                      <div className="single-slide zoom-image-hover">
                        <ZoomImage
                          src={data.images?.[0] || fallbackImage}
                          alt={data.name}
                        />
                      </div>
                    </div>
                  </div>
                </Col>
                <Col md={7} sm={12}>
                  <div className="quickview-pro-content">
                    <h5 className="gi-quick-title">
                      <a href="#">{data.name}</a>
                    </h5>

                    <div className="gi-quickview-rating">
                      <StarRating rating={data.rating} />
                    </div>

                    <div className="gi-quickview-desc">
                      {data.description || "No description available."}
                    </div>

                    <div className="gi-quickview-price">
                      <span className="new-price">
                        ₹{data.discountPrice * quantity}
                      </span>
                      <span className="old-price">₹{data.price}</span>
                    </div>

                    <div className="gi-pro-variation">
                      <div className="gi-pro-variation-inner gi-pro-variation-size gi-pro-size">
                        <div className="gi-pro-variation-content">
                          <SizeOptions
                            categories={[
                              "clothes",
                              "footwear",
                              "vegetables",
                              "accessorise",
                            ]}
                            subCategory={data.category?.name || ""}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="gi-quickview-qty">
                      <div className="qty-plus-minus gi-qty-rtl">
                        <QuantitySelector
                          quantity={quantity}
                          id={data._id}
                          setQuantity={setQuantity}
                        />
                      </div>
                      <div className="gi-quickview-cart">
                        <button onClick={handleCart} className="gi-btn-1">
                          <i className="fi-rr-shopping-basket"></i> Add To Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Modal.Body>
          </div>
        </div>
      </Modal>
    </Fade>
  );
};

export default QuickViewModal;
