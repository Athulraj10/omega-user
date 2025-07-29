import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import Link from "next/link";
import QuantitySelector from "../quantity-selector/QuantitySelector";
import { useCartWishlist } from "../../hooks/useCartWishlist";
import Spinner from "../button/Spinner";

const SidebarCart = ({ closeCart, isCartOpen }: any) => {
  const {
    cartData,
    removeFromCart,
    updateCartQuantity,
    cartLoading,
    isAuthenticated,
    refreshCart
  } = useCartWishlist();

  const [subTotal, setSubTotal] = useState(0);
  const [vat, setVat] = useState(0);

  useEffect(() => {
    if (cartData && cartData.items && cartData.items.length > 0) {
      setSubTotal(cartData.subtotal || 0);
      // Calculate VAT (20%)
      const vatAmount = (cartData.subtotal || 0) * 0.2;
      setVat(vatAmount);
    } else {
      setSubTotal(0);
      setVat(0);
    }
  }, [cartData]);

  const total = subTotal + vat;

  const handleSubmit = (e: any) => {
    e.preventDefault();
  };

  const handleRemoveFromCart = async (productId: string) => {
    await removeFromCart(productId);
  };

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    await updateCartQuantity(productId, newQuantity);
  };

  // Refresh cart when sidebar opens
  useEffect(() => {
    if (isCartOpen && isAuthenticated) {
      refreshCart();
    }
  }, [isCartOpen, isAuthenticated, refreshCart]);

  console.log("cartData----", cartData);
  console.log("Cart count (totalItems):", cartData?.totalItems);
  console.log("Cart items length:", cartData?.items?.length);

  // Check if cart has items safely
  const hasCartItems = cartData && cartData.items && cartData.items.length > 0;

  return (
    <>
      {isCartOpen && (
        <div
          style={{ display: isCartOpen ? "block" : "none" }}
          className="gi-side-cart-overlay"
          onClick={closeCart}
        ></div>
      )}
      <div
        id="gi-side-cart"
        className={`gi-side-cart ${isCartOpen ? "gi-open-cart" : ""}`}
      >
        <div className="gi-cart-inner">
          <div className="gi-cart-top">
            <div className="gi-cart-title">
              <span className="cart_title">My Cart</span>
              <div className="gi-cart-actions">
                <button 
                  onClick={refreshCart} 
                  className="gi-cart-refresh"
                  title="Refresh cart"
                  disabled={cartLoading}
                >
                  <i className="fi-rr-refresh"></i>
                </button>
                <Link onClick={closeCart} href="/" className="gi-cart-close">
                  <i onClick={handleSubmit} className="fi-rr-cross-small"></i>
                </Link>
              </div>
            </div>
            
            {cartLoading ? (
              <div className="gi-cart-loading">
                <Spinner />
                <p>Loading cart...</p>
              </div>
            ) : !isAuthenticated ? (
              <div className="gi-cart-login-prompt">
                <p>Please <a href="/login">login</a> to view your cart</p>
              </div>
            ) : !hasCartItems ? (
              <div className="gi-pro-content cart-pro-title">
                Your cart is empty.
              </div>
            ) : (
              <ul className="gi-cart-pro-items">
                {cartData.items.map((item: any, index: number) => (
                  <li key={index}>
                    <Link
                      onClick={handleSubmit}
                      href="/"
                      className="gi-pro-img"
                    >
                      <img src={item.image} alt="product" />
                    </Link>
                    <div className="gi-pro-content">
                      <Link href="/" className="cart-pro-title">
                        {item.title}
                      </Link>
                      <span className="cart-price">
                        {item.weight || "1 pcs"}{" "}
                        <span>AED {item.totalPrice.toFixed(2)}</span>
                      </span>
                      <div className="qty-plus-minus gi-qty-rtl">
                        <QuantitySelector
                          id={item.id}
                          quantity={item.quantity}
                          setQuantity={(quantity: number) => 
                            handleQuantityChange(item.id, quantity)
                          }
                        />
                      </div>
                      <Link
                        onClick={() => handleRemoveFromCart(item.id)}
                        href="#/"
                        className="remove"
                      >
                        ×
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {hasCartItems && (
            <div className="gi-cart-bottom">
              <div className="cart-sub-total">
                <table className="table cart-table">
                  <tbody>
                    <tr>
                      <td className="text-left">Sub-Total :</td>
                      <td className="text-right">AED {subTotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="text-left">VAT (20%) :</td>
                      <td className="text-right">AED {vat.toFixed(2)}</td>
                    </tr>
                    {cartData.appliedCoupon && cartData.appliedCoupon.discountAmount > 0 && (
                      <tr>
                        <td className="text-left">Discount :</td>
                        <td className="text-right text-success">
                          -AED {cartData.appliedCoupon.discountAmount.toFixed(2)}
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td className="text-left">Total :</td>
                      <td className="text-right primary-color">
                        AED {cartData.finalTotal.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="cart_btn">
                <Link href="/cart" className="gi-btn-1" onClick={closeCart}>
                  View Cart
                </Link>
                <Link href="/checkout" className="gi-btn-2" onClick={closeCart}>
                  Checkout
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SidebarCart;
