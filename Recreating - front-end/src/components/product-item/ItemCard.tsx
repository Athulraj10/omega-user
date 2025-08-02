import { useEffect, useState } from "react";
import StarRating from "../stars/StarRating";
import QuickViewModal from "../model/QuickViewModal";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { showSuccessToast } from "../toast-popup/Toastify";
import { RootState } from "@/store";
import { addCompare, removeCompareItem } from "@/store/reducers/compareSlice";
import { useCart, useWishlist } from "@/store/hooks";

interface Item {
  id?: number;
  _id?: string;
  title?: string;
  name?: string;
  newPrice?: number;
  discountPrice?: number;
  waight?: string;
  image?: string;
  images?: string[];
  imageTwo?: string;
  date?: string;
  status?: string;
  rating?: number;
  oldPrice?: number;
  location?: string;
  brand?: string;
  sku?: number;
  category?: string | { name: string };
  quantity?: number;
  slug?: string;
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
  // Add null check at component level
  if (!data) {
    console.error("ItemCard: data prop is null or undefined");
    return null; // Don't render anything if data is null
  }
  
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const compareItems = useSelector((state: RootState) => state.compare.compare);
  
  // Use new Redux hooks
  const { 
    items: cartItems, 
    addToCartData, 
    updateCartItemData,
    setCartItemsData 
  } = useCart();
  
  const { 
    items: wishlistItems, 
    addToWishlistData, 
    removeFromWishlistData,
    addingItem,
    removingItem
  } = useWishlist();

  useEffect(() => {
    const itemsFromLocalStorage =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("products") || "[]")
        : [];
    if (itemsFromLocalStorage.length) {
      setCartItemsData(itemsFromLocalStorage);
    }
  }, [setCartItemsData]);

  const handleCart = (data: Item) => {
    // Add null check for data
    if (!data) {
      console.error("Cannot add to cart: data is null or undefined");
      return;
    }
    
    const itemId = data.id || data._id;
    if (itemId === undefined || itemId === null) {
      console.error("Cannot add to cart: item ID is undefined");
      return;
    }
    
    // Convert itemId to number for cart operations
    const numericItemId = typeof itemId === 'string' ? parseInt(itemId) : itemId;
    
    const isItemInCart = cartItems.some((item: any) => (item.id || item._id) === numericItemId);

    if (!isItemInCart) {
      // Create cart item with proper structure
      const cartItem = {
        _id: numericItemId,
        title: data.name || data.title || '',
        oldPrice: data.oldPrice || 0,
        waight: data.waight || '',
        image: data.images?.[0] || data.image || '',
        imageTwo: data.imageTwo || '',
        date: data.date || new Date().toISOString(),
        status: data.status || 'Available',
        rating: data.rating || 0,
        newPrice: data.discountPrice || data.newPrice || 0,
        location: data.location || '',
        brand: data.brand || '',
        sku: data.sku || 0,
        category: typeof data.category === 'object' ? data.category.name : data.category || '',
        quantity: 1,
      };
      
      addToCartData(cartItem);
      showSuccessToast("Add product in Cart Successfully!");
    } else {
      const updatedCartItems = cartItems.map((item: any) =>
        (item.id || item._id) === numericItemId
          ? {
            ...item,
            quantity: item.quantity + 1,
            price: item.newPrice + (data.newPrice || 0),
          } // Increment quantity and update price
          : item
      );
      const updatedItem = updatedCartItems.find((item: any) => (item.id || item._id) === numericItemId);
      if (updatedItem) {
        updateCartItemData(numericItemId, updatedItem.quantity);
      }
      showSuccessToast("Add product in Cart Successfully!");
    }
  };

  const isInWishlist = (data: Item) => {
    if (!data) return false;
    // Check for both id and _id properties, with fallback to string conversion
    const itemId = data.id || data._id;
    if (itemId === undefined || itemId === null) return false;
    return wishlistItems.some((item: any) => (item.id || item._id) === itemId);
  };

  const handleWishlist = async (data: Item) => {
    try {
      // Add null check for data
      if (!data) {
        console.error("Cannot handle wishlist: data is null or undefined");
        return;
      }
      
      if (!isInWishlist(data)) {
        const itemId = data.id || data._id;
        if (itemId === undefined || itemId === null) {
          console.error("Cannot add to wishlist: item ID is undefined");
          return;
        }
        
        // Create wishlist item object
        const wishlistItem = {
          id: itemId.toString(),
          title: data.name || data.title || '',
          price: data.discountPrice || data.newPrice || 0,
          image: data.images?.[0] || data.image || '',
          slug: data.slug || '',
          category: typeof data.category === 'object' ? data.category.name : data.category || '',
          brand: data.brand || '',
          rating: data.rating || 0,
          reviews: 0,
          inStock: true,
          addedAt: new Date().toISOString(),
        };
        
        addToWishlistData(wishlistItem);
        showSuccessToast("Add product in Wishlist Successfully!", {
          icon: false,
        });
      } else {
        const itemId = data.id || data._id;
        if (itemId === undefined || itemId === null) {
          console.error("Cannot remove from wishlist: item ID is undefined");
          return;
        }
        removeFromWishlistData(itemId.toString());
        showSuccessToast("Remove product on Wishlist Successfully!", {
          icon: false,
        });
      }
    } catch (error) {
      console.error("Wishlist operation failed:", error);
    }
  };

  const isInCompare = (data: Item) => {
    if (!data) return false;
    const itemId = data.id || data._id;
    if (itemId === undefined || itemId === null) return false;
    return compareItems.some((item: any) => (item.id || item._id) === itemId);
  };

  const handleCompareItem = (data: Item) => {
    // Add null check for data
    if (!data) {
      console.error("Cannot handle compare: data is null or undefined");
      return;
    }
    
    const itemId = data.id || data._id;
    if (itemId === undefined || itemId === null) {
      console.error("Cannot handle compare: item ID is undefined");
      return;
    }
    
    // Convert itemId to number for compare operations
    const numericItemId = typeof itemId === 'string' ? parseInt(itemId) : itemId;
    
    if (!isInCompare(data)) {
      // Create compare item with proper structure
      const compareItem = {
        id: numericItemId,
        title: data.name || data.title || '',
        oldPrice: data.oldPrice || 0,
        waight: data.waight || '',
        image: data.images?.[0] || data.image || '',
        imageTwo: data.imageTwo || '',
        date: data.date || new Date().toISOString(),
        status: data.status || 'Available',
        rating: data.rating || 0,
        newPrice: data.discountPrice || data.newPrice || 0,
        location: data.location || '',
        brand: data.brand || '',
        sku: data.sku || 0,
        category: typeof data.category === 'object' ? data.category.name : data.category || '',
        quantity: data.quantity || 1,
      };
      
      dispatch(addCompare(compareItem));
      showSuccessToast(`Add product in Compare list Successfully!`, {
        icon: false,
      });
    } else {
      dispatch(removeCompareItem(numericItemId));
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
                disabled={addingItem || removingItem}
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
                {data.colors && Array.isArray(data.colors) && data.colors.length > 0 && (
                  <ul className="colors">
                    {data.colors.map((color, idx) => (
                      <li key={idx} className={`color-${color}`}>
                        <a href="#"></a>
                      </li>
                    ))}
                  </ul>
                )}
                {data.sizes && Array.isArray(data.sizes) && data.sizes.length > 0 && (
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
