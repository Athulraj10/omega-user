const Order = require("../../models/order");
const OrderValidation = require("../../services/OrderValidation");
const Response = require("../../services/Response");
const { v4: uuidv4 } = require('uuid');

class OrderController {
  // Create a new order
  static async createOrder(req, res) {
    try {
      const { error } = OrderValidation.validateCreateOrder(req.body);
      console.log({error});
      if (error) {
        return Response.validationErrorResponseData(
          res,
          error.details.map((detail) => detail.message).join(", ")
        );
      }

      const orderData = {
        ...req.body,
        user: req.authUserId,
        orderNumber:uuidv4(),
      };

      const order = new Order(orderData);
      await order.save();

      // Populate user details for response
      await order.populate("user", "firstName lastName email");

      return Response.successResponseData(
        res,
        order,
        201,
        "Order created successfully"
      );
    } catch (error) {
      console.error("Error creating order:", error);
      return Response.errorResponseData(
        res,
        "Failed to create order",
        500
      );
    }
  }

  // Get user's order history
  static async getUserOrders(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const status = req.query.status;
      const skip = (page - 1) * limit;

      const filter = { user: req.user._id };
      if (status) {
        filter.orderStatus = status;
      }

      const orders = await Order.find(filter)
        .populate("user", "firstName lastName email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const totalOrders = await Order.countDocuments(filter);
      const totalPages = Math.ceil(totalOrders / limit);

      const response = {
        orders,
        pagination: {
          currentPage: page,
          totalPages,
          totalOrders,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      };

      return Response.successResponseData(
        res,
        response,
        200,
        "Orders retrieved successfully"
      );
    } catch (error) {
      console.error("Error getting user orders:", error);
      return Response.errorResponseData(
        res,
        "Failed to retrieve orders",
        500
      );
    }
  }

  // Get single order by ID
  static async getOrderById(req, res) {
    try {
      const { id } = req.params;

      const order = await Order.findOne({
        _id: id,
        user: req.user._id,
      }).populate("user", "firstName lastName email");

      if (!order) {
        return Response.errorResponseData(
          res,
          "Order not found",
          404
        );
      }

      return Response.successResponseData(
        res,
        order,
        200,
        "Order retrieved successfully"
      );
    } catch (error) {
      console.error("Error getting order:", error);
      return Response.errorResponseData(
        res,
        "Failed to retrieve order",
        500
      );
    }
  }

  // Get order by order number
  static async getOrderByNumber(req, res) {
    try {
      const { orderNumber } = req.params;

      const order = await Order.findOne({
        orderNumber: orderNumber,
        user: req.user._id,
      }).populate("user", "firstName lastName email");

      if (!order) {
        return Response.errorResponseData(
          res,
          "Order not found",
          404
        );
      }

      return Response.successResponseData(
        res,
        order,
        200,
        "Order retrieved successfully"
      );
    } catch (error) {
      console.error("Error getting order:", error);
      return Response.errorResponseData(
        res,
        "Failed to retrieve order",
        500
      );
    }
  }

  // Cancel order
  static async cancelOrder(req, res) {
    try {
      const { id } = req.params;
      const { error } = OrderValidation.validateCancelOrder(req.body);
      
      if (error) {
        return Response.validationErrorResponseData(
          res,
          error.details.map((detail) => detail.message).join(", ")
        );
      }

      const order = await Order.findOne({
        _id: id,
        user: req.user._id,
      });

      if (!order) {
        return Response.errorResponseData(
          res,
          "Order not found",
          404
        );
      }

      // Check if order can be cancelled
      const cancellableStatuses = ["pending", "confirmed"];
      if (!cancellableStatuses.includes(order.orderStatus)) {
        return Response.errorResponseData(
          res,
          "Order cannot be cancelled at this stage",
          400
        );
      }

      order.orderStatus = "cancelled";
      order.cancelledAt = new Date();
      order.cancelledBy = req.user._id;
      order.cancellationReason = req.body.cancellationReason;

      await order.save();

      return Response.successResponseData(
        res,
        order,
        200,
        "Order cancelled successfully"
      );
    } catch (error) {
      console.error("Error cancelling order:", error);
      return Response.errorResponseData(
        res,
        "Failed to cancel order",
        500
      );
    }
  }

  // Update order status (Admin only)
  static async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { error } = OrderValidation.validateUpdateOrderStatus(req.body);
      
      if (error) {
        return Response.validationErrorResponseData(
          res,
          error.details.map((detail) => detail.message).join(", ")
        );
      }

      const order = await Order.findById(id);

      if (!order) {
        return Response.errorResponseData(
          res,
          "Order not found",
          404
        );
      }

      // Update order status
      order.orderStatus = req.body.orderStatus;
      
      if (req.body.trackingNumber) {
        order.trackingNumber = req.body.trackingNumber;
      }
      
      if (req.body.estimatedDelivery) {
        order.estimatedDelivery = new Date(req.body.estimatedDelivery);
      }

      // Set deliveredAt when status is delivered
      if (req.body.orderStatus === "delivered") {
        order.deliveredAt = new Date();
      }

      await order.save();

      return Response.successResponseData(
        res,
        order,
        200,
        "Order status updated successfully"
      );
    } catch (error) {
      console.error("Error updating order status:", error);
      return Response.errorResponseData(
        res,
        "Failed to update order status",
        500
      );
    }
  }

  // Get order statistics for user
  static async getOrderStats(req, res) {
    try {
      const userId = req.user._id;

      const stats = await Order.aggregate([
        { $match: { user: userId } },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalSpent: { $sum: "$total" },
            pendingOrders: {
              $sum: { $cond: [{ $eq: ["$orderStatus", "pending"] }, 1, 0] }
            },
            confirmedOrders: {
              $sum: { $cond: [{ $eq: ["$orderStatus", "confirmed"] }, 1, 0] }
            },
            processingOrders: {
              $sum: { $cond: [{ $eq: ["$orderStatus", "processing"] }, 1, 0] }
            },
            shippedOrders: {
              $sum: { $cond: [{ $eq: ["$orderStatus", "shipped"] }, 1, 0] }
            },
            deliveredOrders: {
              $sum: { $cond: [{ $eq: ["$orderStatus", "delivered"] }, 1, 0] }
            },
            cancelledOrders: {
              $sum: { $cond: [{ $eq: ["$orderStatus", "cancelled"] }, 1, 0] }
            },
          }
        }
      ]);

      const orderStats = stats[0] || {
        totalOrders: 0,
        totalSpent: 0,
        pendingOrders: 0,
        confirmedOrders: 0,
        processingOrders: 0,
        shippedOrders: 0,
        deliveredOrders: 0,
        cancelledOrders: 0,
      };

      return Response.successResponseData(
        res,
        orderStats,
        200,
        "Order statistics retrieved successfully"
      );
    } catch (error) {
      console.error("Error getting order stats:", error);
      return Response.errorResponseData(
        res,
        "Failed to retrieve order statistics",
        500
      );
    }
  }

  // Get all orders (Admin only)
  static async getAllOrders(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const status = req.query.status;
      const userId = req.query.userId;
      const skip = (page - 1) * limit;

      const filter = {};
      if (status) {
        filter.orderStatus = status;
      }
      if (userId) {
        filter.user = userId;
      }

      const orders = await Order.find(filter)
        .populate("user", "firstName lastName email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const totalOrders = await Order.countDocuments(filter);
      const totalPages = Math.ceil(totalOrders / limit);

      const response = {
        orders,
        pagination: {
          currentPage: page,
          totalPages,
          totalOrders,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      };

      return Response.successResponseData(
        res,
        response,
        200,
        "Orders retrieved successfully"
      );
    } catch (error) {
      console.error("Error getting all orders:", error);
      return Response.errorResponseData(
        res,
        "Failed to retrieve orders",
        500
      );
    }
  }
}

module.exports = OrderController;
