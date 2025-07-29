import { useDispatch } from "react-redux";
import { updateQuantity } from "../../store/reducers/cartSlice";

const QuantitySelector = ({
  id,
  quantity,
  setQuantity,
}: {
  id: number;
  quantity: number;
  setQuantity?: any;
}) => {
  const dispatch = useDispatch();

  const handleQuantityChange = (operation: "increase" | "decrease") => {
    let newQuantity = quantity;

    if (operation === "increase") {
      newQuantity = quantity + 1;
    } else if (operation === "decrease" && quantity > 1) {
      newQuantity = quantity - 1;
    }

    if (undefined !== setQuantity) {
      setQuantity(newQuantity);
    } else {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    }
  };

  return (
    <div className="qty-plus-minus">
      <div
        className="qty-btn qty-decrease"
        onClick={() => handleQuantityChange("decrease")}
        title="Decrease quantity"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleQuantityChange("decrease");
          }
        }}
      >
        <span>−</span>
      </div>
      <input
        readOnly
        className="qty-input"
        type="text"
        name="gi-qtybtn"
        value={quantity}
        aria-label="Quantity"
        tabIndex={-1}
      />
      <div
        className="qty-btn qty-increase"
        onClick={() => handleQuantityChange("increase")}
        title="Increase quantity"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleQuantityChange("increase");
          }
        }}
      >
        <span>+</span>
      </div>
    </div>
  );
};

export default QuantitySelector;
