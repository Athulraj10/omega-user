import { useEffect, useState } from "react";
import StarRating from "../stars/StarRating";
import QuickViewModal from "../model/QuickViewModal";
import { useDispatch, useSelector } from "react-redux";
import {
  addItem,
  setCartItems,
  updateItemQuantity,
} from "../../store/reducers/cartSlice";
import Link from "next/link";
import { showSuccessToast } from "../toast-popup/Toastify";
import { RootState } from "@/store";
import { addWishlist, removeWishlist } from "@/store/reducers/wishlistSlice";
import { addCompare, removeCompareItem } from "@/store/reducers/compareSlice";
// const placeholder = process.env.NEXT_PUBLIC_URL + ;
// D:\DOWNLOADS\omega\omega-user\Recreating - front-end\public\assets\img\product-images\1_1.jpg
interface Item {
  id: number;
  title: string;
  newPrice: number;
  waight: string;
  image: string;
  imageTwo: string;
  date: string;
  status: string;
  rating: number;
  oldPrice: number;
  location: string;
  brand: string;
  sku: number;
  category: string;
  quantity: number;
}

// interface ProductData {
//   _id: string;
//   name: string;
//   description?: string;
//   images: string[];
//   price: number;
//   discountPrice: number;
//   sale?: string;
//   colors?: string[];
//   sizes?: string[];
//   rating?: number;
//   weight?: string;
//   category?: string;
// }

const ItemCard = ({ data }: any) => {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const compareItems = useSelector((state: RootState) => state.compare.compare);
  const wishlistItems = useSelector(
    (state: RootState) => state.wishlist.wishlist
  );
  const cartItems = useSelector((state: RootState) => state.cart.items);


  console.log({ wishlistItems })
  console.log({ cartItems })


  useEffect(() => {
    const itemsFromLocalStorage =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("products") || "[]")
        : [];
    if (itemsFromLocalStorage.length) {
      dispatch(setCartItems(itemsFromLocalStorage));
    }
  }, [dispatch]);

  const handleCart = (data: Item) => {
    const isItemInCart = cartItems.some((item: Item) => item.id === data.id);

    if (!isItemInCart) {
      dispatch(addItem({ ...data, quantity: 1 }));
      showSuccessToast("Add product in Cart Successfully!");
    } else {
      const updatedCartItems = cartItems.map((item: Item) =>
        item.id === data.id
          ? {
            ...item,
            quantity: item.quantity + 1,
            price: item.newPrice + data.newPrice,
          } // Increment quantity and update price
          : item
      );
      dispatch(updateItemQuantity(updatedCartItems));
      showSuccessToast("Add product in Cart Successfully!");
    }
  };

  const isInWishlist = (data: Item) => {
    if (!data) return false
    if (wishlistItems.length > 0) {
      return wishlistItems?.some((item: Item) => item.id === data.id);
    }
    return false
  };

  const handleWishlist = (data: Item) => {
    if (!isInWishlist(data)) {
      dispatch(addWishlist(data));
      showSuccessToast("Add product in Wishlist Successfully!", {
        icon: false,
      });
    } else {
      dispatch(removeWishlist(data.id));
      showSuccessToast("Remove product on Wishlist Successfully!", {
        icon: false,
      });
      // showErrorToast("Item already have to wishlist");
    }
  };

  const isInCompare = (data: Item) => {
    return compareItems.some((item: Item) => item.id === data.id);
  };

  const handleCompareItem = (data: Item) => {
    if (!isInCompare(data)) {
      dispatch(addCompare(data));
      showSuccessToast(`Add product in Compare list Successfully!`, {
        icon: false,
      });
    } else {
      dispatch(removeCompareItem(data.id));
      showSuccessToast("Remove product on Compare list Successfully!", {
        icon: false,
      });
      // showErrorToast("Item already have to compare list");
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <div className="gi-product-content">
      <div className="gi-product-inner">
        <div className="gi-pro-image-outer">
          <div className="gi-pro-image">
            <Link onClick={handleSubmit} href="/" className="image">
              <span className="label veg">
                <span className="dot"></span>
              </span>

              <img
                className="main-image object-cover"
                src={data.images?.[0] || "/assets/img/product-images/1_1.jpg"}
                alt="Product"
                height={200}
                width={200}
              />
            </Link>

            {data.sale && (
              <span className="flags">
                <span className={data.sale === "Sale" ? "sale" : "new"}>
                  {data.sale}
                </span>
              </span>
            )}

            <div className="gi-pro-actions">
              <button
                onClick={() => handleWishlist(data)}
                className={`gi-btn-group wishlist ${isInWishlist(data) ? "active" : ""}`}
                title="Wishlist"
              >
                <i className="fi-rr-heart"></i>
              </button>

              <button
                className="gi-btn-group quickview gi-cart-toggle"
                data-bs-toggle="modal"
                data-bs-target="#gi_quickview_modal"
                onClick={handleShow}
                title="Quick view"
              >
                <i className="fi-rr-eye"></i>
              </button>

              <button
                onClick={() => handleCompareItem(data)}
                className={`gi-btn-group compare ${isInCompare(data) ? "active" : ""}`}
                title="Compare"
              >
                <i className="fi fi-rr-arrows-repeat"></i>
              </button>

              <button
                onClick={() => handleCart(data)}
                className="gi-btn-group add-to-cart"
                title="Add To Cart"
              >
                <i className="fi-rr-shopping-basket"></i>
              </button>
            </div>

            {(data.colors?.length || data.sizes?.length) && (
              <div className="gi-pro-option">
                {data.colors?.length > 0 && (
                  <ul className="colors">
                    {data.colors.map((color, idx) => (
                      <li key={idx} className={`color-${color}`}>
                        <a href="#"></a>
                      </li>
                    ))}
                  </ul>
                )}
                {data.sizes?.length > 0 && (
                  <ul className="sizes">
                    {data.sizes.map((size, idx) => (
                      <li key={idx}>
                        <a href="#">{size}</a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="gi-pro-content">
          <Link href="/shop-left-sidebar-col-3">
            <h6 className="gi-pro-stitle">{data.category?.name || "Category"}</h6>
          </Link>

          <h5 className="gi-pro-title">
            <Link href={`/product-view/${data?._id}`}>{data.name}</Link>
          </h5>

          <p className="gi-info">
            {data.description?.slice(0, 120) || "No description available."}
          </p>

          <div className="gi-pro-rat-price">
            <span className="gi-pro-rating">
              <StarRating rating={data.rating || 0} />
              {data.weight && <span className="qty">{data.weight}g</span>}
            </span>

            <span className="gi-price">
              <span className="new-price">AED {data.discountPrice}</span>
              <span className="old-price">AED {data.price}</span>
            </span>
          </div>
        </div>
      </div>

      <QuickViewModal data={data} handleClose={handleClose} show={show} />
    </div>
  );
};

export default ItemCard;
