const Joi = require("joi");

class OrderValidation {
  static createOrderSchema = Joi.object({
    items: Joi.array()
      .items(
        Joi.object({
          product: Joi.string().required().messages({
            "string.empty": "Product ID is required",
            "any.required": "Product ID is required",
          }),
          title: Joi.string().required().messages({
            "string.empty": "Product title is required",
            "any.required": "Product title is required",
          }),
          image: Joi.string().required().messages({
            "string.empty": "Product image is required",
            "any.required": "Product image is required",
          }),
          price: Joi.number().positive().required().messages({
            "number.base": "Price must be a number",
            "number.positive": "Price must be positive",
            "any.required": "Price is required",
          }),
          quantity: Joi.number().integer().min(1).required().messages({
            "number.base": "Quantity must be a number",
            "number.integer": "Quantity must be an integer",
            "number.min": "Quantity must be at least 1",
            "any.required": "Quantity is required",
          }),
          totalPrice: Joi.number().positive().required().messages({
            "number.base": "Total price must be a number",
            "number.positive": "Total price must be positive",
            "any.required": "Total price is required",
          }),
        })
      )
      .min(1)
      .required()
      .messages({
        "array.min": "At least one item is required",
        "any.required": "Items are required",
      }),
    shippingAddress: Joi.object({
      label: Joi.string().optional(),
      addressLine1: Joi.string().required().messages({
        "string.empty": "Shipping address is required",
        "any.required": "Shipping address is required",
      }),
      city: Joi.string().optional(),
      state: Joi.string().optional(),
      postalCode: Joi.string().optional(),
      country: Joi.string().required().messages({
        "string.empty": "Country is required",
        "any.required": "Country is required",
      }),
      phone: Joi.string().optional(),
    }).required().messages({
      "any.required": "Shipping address is required",
    }),
    billingAddress: Joi.object({
      label: Joi.string().optional(),
      addressLine1: Joi.string().required().messages({
        "string.empty": "Billing address is required",
        "any.required": "Billing address is required",
      }),
      city: Joi.string().optional(),
      state: Joi.string().optional(),
      postalCode: Joi.string().optional(),
      country: Joi.string().required().messages({
        "string.empty": "Country is required",
        "any.required": "Country is required",
      }),
      phone: Joi.string().optional(),
    }).required().messages({
      "any.required": "Billing address is required",
    }),
    paymentMethod: Joi.string()
      .valid("cash_on_delivery", "credit_card", "paypal", "stripe")
      .default("cash_on_delivery")
      .messages({
        "any.only": "Invalid payment method",
      }),
    shippingMethod: Joi.string()
      .valid("free", "standard", "express")
      .default("free")
      .messages({
        "any.only": "Invalid shipping method",
      }),
    subtotal: Joi.number().positive().required().messages({
      "number.base": "Subtotal must be a number",
      "number.positive": "Subtotal must be positive",
      "any.required": "Subtotal is required",
    }),
    tax: Joi.number().min(0).default(0).messages({
      "number.base": "Tax must be a number",
      "number.min": "Tax cannot be negative",
    }),
    discount: Joi.number().min(0).default(0).messages({
      "number.base": "Discount must be a number",
      "number.min": "Discount cannot be negative",
    }),
    total: Joi.number().positive().required().messages({
      "number.base": "Total must be a number",
      "number.positive": "Total must be positive",
      "any.required": "Total is required",
    }),
    notes: Joi.string().max(500).optional().messages({
      "string.max": "Notes cannot exceed 500 characters",
    }),
  });

  static updateOrderStatusSchema = Joi.object({
    orderStatus: Joi.string()
      .valid("pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "returned")
      .required()
      .messages({
        "any.only": "Invalid order status",
        "any.required": "Order status is required",
      }),
    trackingNumber: Joi.string().optional(),
    estimatedDelivery: Joi.date().optional(),
    notes: Joi.string().max(500).optional().messages({
      "string.max": "Notes cannot exceed 500 characters",
    }),
  });

  static cancelOrderSchema = Joi.object({
    cancellationReason: Joi.string().max(500).required().messages({
      "string.empty": "Cancellation reason is required",
      "string.max": "Cancellation reason cannot exceed 500 characters",
      "any.required": "Cancellation reason is required",
    }),
  });

  static validateCreateOrder(data) {
    return this.createOrderSchema.validate(data, { abortEarly: false });
  }

  static validateUpdateOrderStatus(data) {
    return this.updateOrderStatusSchema.validate(data, { abortEarly: false });
  }

  static validateCancelOrder(data) {
    return this.cancelOrderSchema.validate(data, { abortEarly: false });
  }
}

module.exports = OrderValidation; 