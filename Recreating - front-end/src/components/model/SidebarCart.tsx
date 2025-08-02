import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import QuantitySelector from "../quantity-selector/QuantitySelector";
import { useCart } from "../../store/hooks";

const SidebarCart = ({ closeCart, isCartOpen }: any) => {
  const { cartItems } = useCart();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());
  const [subTotal, setSubTotal] = useState(0);
  const [vat, setVat] = useState(0);
  const hasFetchedCart = useRef(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const isAuth = !!token;
    setIsAuthenticated(isAuth);

    if (isAuth && !hasFetchedCart.current) {
      hasFetchedCart.current = true;
      console.log("Fetching cart items...");
    }
  }, []);

  useEffect(() => {
    if (cartItems?.length) {
      const total = cartItems.reduce((sum, item) => sum + item.newPrice * item.quantity, 0);
      setSubTotal(total);
      setVat(total * 0.2);
    } else {
      setSubTotal(0);
      setVat(0);
    }
  }, [cartItems]);

  const handleRemoveFromCart = async (productId: string) => {
    try {
      setRemovingItems(prev => new Set(prev).add(productId));
      // await removeCartItemAsync(productId);
    } catch (error) {
      console.error("Error removing item from cart:", error);
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    try {
      // await updateCartItemQuantityAsync(productId, newQuantity);
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const total = subTotal + vat;
  const hasCartItems = cartItems?.length > 0;

  return (
    <>
      {isCartOpen && <div className="gi-side-cart-overlay" onClick={closeCart} />}
      <div className={`gi-side-cart ${isCartOpen ? "gi-open-cart" : ""}`}>
        <div className="gi-cart-inner">
          <div className="gi-cart-top">
            <div className="gi-cart-title">
              <span className="cart_title">My Cart</span>
              <div className="gi-cart-actions">
                <Link href="/" className="gi-cart-close" onClick={closeCart}>
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
                          href="#"
                          className="remove"
                          onClick={() => handleRemoveFromCart(itemId)}
                          style={{
                            pointerEvents: removingItems.has(itemId) ? "none" : "auto",
                            opacity: removingItems.has(itemId) ? 0.5 : 1,
                          }}
                        >
                          {removingItems.has(itemId) ? "..." : "×"}
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
                      <td className="text-right primary-color">AED {total.toFixed(2)}</td>
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
