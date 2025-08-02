const { Order, Product, Cart } = require("../models");
const { errorResponseData } = require("./Response");

class CheckoutService {
  /**
   * Validate cart items and stock availability
   */
  static async validateCartItems(userId) {
    const cart = await Cart.findOne({ userId, isActive: true })
      .populate({
        path: 'items.product',
        select: 'name price discountPrice stock status'
      });

    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty");
    }

    const validationResults = {
      validItems: [],
      invalidItems: [],
      totalAmount: 0,
      totalItems: 0
    };

    for (const cartItem of cart.items) {
      const product = cartItem.product;
      
      if (!product) {
        validationResults.invalidItems.push({
          item: cartItem,
          reason: "Product no longer exists"
        });
        continue;
      }

      if (product.status !== '1') {
        validationResults.invalidItems.push({
          item: cartItem,
          reason: "Product is currently unavailable"
        });
        continue;
      }

      if (product.stock < cartItem.quantity) {
        validationResults.invalidItems.push({
          item: cartItem,
          reason: `Insufficient stock. Available: ${product.stock}`
        });
        continue;
      }

      const priceAtPurchase = product.discountPrice || product.price;
      const itemTotal = priceAtPurchase * cartItem.quantity;

      validationResults.validItems.push({
        product: product._id,
        quantity: cartItem.quantity,
        priceAtPurchase: priceAtPurchase,
        itemTotal: itemTotal,
        productName: product.name
      });

      validationResults.totalAmount += itemTotal;
      validationResults.totalItems += cartItem.quantity;
    }

    return validationResults;
  }

  /**
   * Process checkout and create order
   */
  static async processCheckout(userId, shippingAddress, paymentMethod = 'cod', couponCode = null) {
    // Validate cart items
    const validationResults = await this.validateCartItems(userId);
    
    if (validationResults.validItems.length === 0) {
      throw new Error("No valid items in cart");
    }

    // Get cart for coupon validation
    const cart = await Cart.findOne({ userId, isActive: true });
    
    // Apply coupon discount if valid
    let discountAmount = 0;
    let finalAmount = validationResults.totalAmount;
    
    if (couponCode && cart.appliedCoupon && cart.appliedCoupon.code === couponCode) {
      discountAmount = cart.appliedCoupon.discountAmount;
      finalAmount = Math.max(0, validationResults.totalAmount - discountAmount);
    }

    // Create order
    const order = await Order.create({
      user: userId,
      items: validationResults.validItems.map(item => ({
        product: item.product,
        quantity: item.quantity,
        priceAtPurchase: item.priceAtPurchase
      })),
      shippingAddress: {
        label: shippingAddress.label || 'Home',
        addressLine1: shippingAddress.addressLine1,
        addressLine2: shippingAddress.addressLine2,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country,
        phone: shippingAddress.phone
      },
      totalAmount: finalAmount,
      originalAmount: validationResults.totalAmount,
      discountAmount: discountAmount,
      paymentMethod: paymentMethod,
      status: 'pending',
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending'
    });

    // Update product stock
    for (const item of validationResults.validItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    // Clear cart
    await Cart.findByIdAndUpdate(cart._id, {
      items: [],
      subtotal: 0,
      totalItems: 0,
      appliedCoupon: {},
      lastUpdated: new Date()
    });

    return order;
  }

  /**
   * Get checkout summary
   */
  static async getCheckoutSummary(userId) {
    const cart = await Cart.findOne({ userId, isActive: true })
      .populate({
        path: 'items.product',
        select: 'name price discountPrice images stock status sku brand'
      });

    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty");
    }

    const summary = {
      items: [],
      subtotal: 0,
      totalItems: 0,
      discountAmount: 0,
      finalTotal: 0,
      appliedCoupon: cart.appliedCoupon || null
    };

    for (const cartItem of cart.items) {
      const product = cartItem.product;
      
      if (!product || product.status !== '1' || product.stock < cartItem.quantity) {
        continue; // Skip unavailable items
      }

      const price = product.discountPrice || product.price;
      const itemTotal = price * cartItem.quantity;

      summary.items.push({
        ...cartItem.toObject(),
        product: product,
        unitPrice: price,
        totalPrice: itemTotal,
        isAvailable: true
      });

      summary.subtotal += itemTotal;
      summary.totalItems += cartItem.quantity;
    }

    summary.discountAmount = cart.appliedCoupon?.discountAmount || 0;
    summary.finalTotal = Math.max(0, summary.subtotal - summary.discountAmount);

    return summary;
  }

  /**
   * Cancel order and restore stock
   */
  static async cancelOrder(orderId, userId) {
    const order = await Order.findOne({ _id: orderId, user: userId });
    
    if (!order) {
      throw new Error("Order not found");
    }

    if (!['pending', 'processing'].includes(order.status)) {
      throw new Error("Order cannot be cancelled at this stage");
    }

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity }
      });
    }

    // Update order status
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { 
        status: "cancelled",
        updatedAt: new Date()
      },
      { new: true }
    );

    return updatedOrder;
  }
}

module.exports = CheckoutService; 