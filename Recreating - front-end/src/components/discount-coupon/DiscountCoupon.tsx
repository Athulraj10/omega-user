"use client";
import { useState } from "react";

interface DiscountCouponProps {
  onDiscountApplied: (discount: number) => void;
}

const DiscountCoupon = ({ onDiscountApplied }: DiscountCouponProps) => {
  const [couponCode, setCouponCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setMessage("Please enter a coupon code");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      // Simulate API call for coupon validation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock coupon validation
      const validCoupons = {
        "SAVE10": 10,
        "SAVE20": 20,
        "WELCOME": 15
      };

      if (validCoupons[couponCode.toUpperCase()]) {
        const discount = validCoupons[couponCode.toUpperCase()];
        onDiscountApplied(discount);
        setMessage(`Coupon applied! ${discount}% discount`);
      } else {
        setMessage("Invalid coupon code");
      }
    } catch (error) {
      setMessage("Error applying coupon");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="gi-discount-coupon">
      <div className="gi-discount-coupon-inner">
        <div className="gi-discount-coupon-title">
          <h4>Discount Coupon</h4>
        </div>
        <div className="gi-discount-coupon-content">
          <div className="gi-discount-coupon-input">
            <input
              type="text"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              disabled={isLoading}
            />
            <button
              onClick={handleApplyCoupon}
              disabled={isLoading || !couponCode.trim()}
              className="gi-btn-1"
            >
              {isLoading ? "Applying..." : "Apply"}
            </button>
          </div>
          {message && (
            <div className={`gi-discount-coupon-message ${message.includes("applied") ? "success" : "error"}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscountCoupon; 