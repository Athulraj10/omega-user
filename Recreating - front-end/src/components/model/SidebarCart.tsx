import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import Link from "next/link";
import QuantitySelector from "../quantity-selector/QuantitySelector";
import { removeItem, updateQuantity } from "../../store/reducers/cartSlice";

const SidebarCart = ({ closeCart, isCartOpen }: any) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const isAuthenticated = useSelector((state: RootState) => state.registration.isAuthenticated);

  const [subTotal, setSubTotal] = useState(0);
  const [vat, setVat] = useState(0);

  useEffect(() => {
    if (cartItems?.length > 0) {
      const total = cartItems.reduce((sum, item) => sum + item.newPrice * item.quantity, 0);
      setSubTotal(total);
      setVat(total * 0.2);
    } else {
      setSubTotal(0);
      setVat(0);
    }
  }, [cartItems]);

  const total = subTotal + vat;

  const handleRemoveFromCart = (productId: string) => {
    dispatch(removeItem(productId));
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    dispatch(updateQuantity({ id: productId, quantity: newQuantity }));
  };

  const hasCartItems = cartItems && cartItems.length > 0;

  return (
    <>
      {isCartOpen && (
        <div className="gi-side-cart-overlay" onClick={closeCart}></div>
      )}
      <div id="gi-side-cart" className={`gi-side-cart ${isCartOpen ? "gi-open-cart" : ""}`}>
        <div className="gi-cart-inner">
          <div className="gi-cart-top">
            <div className="gi-cart-title">
              <span className="cart_title">My Cart</span>
              <div className="gi-cart-actions">
                <Link onClick={closeCart} href="/" className="gi-cart-close">
                  <i className="fi-rr-cross-small"></i>
                </Link>
              </div>
            </div>

            {!isAuthenticated ? (
              <div className="gi-cart-login-prompt">
                <p>Please <a href="/login">login</a> to view your cart</p>
              </div>
            ) : !hasCartItems ? (
              <div className="gi-pro-content cart-pro-title">
                Your cart is empty.
              </div>
            ) : (
              <ul className="gi-cart-pro-items">
                {cartItems.map((item: any, index: number) => {
                  const itemId = item.id || item._id;
                  if (!itemId) return null;

                  return (
                    <li key={index}>
                      <Link href="/" className="gi-pro-img">
                        <img src={item.image} alt="product" />
                      </Link>
                      <div className="gi-pro-content">
                        <Link href="/" className="cart-pro-title">
                          {item.title}
                        </Link>
                        <span className="cart-price">
                          {item.weight || "1 pcs"}{" "}
                          <span>AED {(item.newPrice * item.quantity).toFixed(2)}</span>
                        </span>
                        <div className="qty-plus-minus gi-qty-rtl">
                          <QuantitySelector
                            id={itemId}
                            quantity={item.quantity}
                            setQuantity={(quantity: number) =>
                              handleQuantityChange(itemId, quantity)
                            }
                          />
                        </div>
                        <Link
                          href="#/"
                          className="remove"
                          onClick={() => handleRemoveFromCart(itemId)}
                        >
                          ×
                        </Link>
                      </div>
                    </li>
                  );
                })}
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
                    <tr>
                      <td className="text-left">Total :</td>
                      <td className="text-right primary-color">
                        AED {total.toFixed(2)}
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
