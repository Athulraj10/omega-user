"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useRouter } from "next/navigation";
import OrderApiService from "../../services/orderApi";
import { Order } from "../../types/order";
import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
import { showErrorToast } from "../../components/toast-popup/Toastify";
import Spinner from "../../components/button/Spinner";

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const isLogin = useSelector((state: RootState) => state.registration.isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (!isLogin) {
      router.push("/login");
      return;
    }

    loadOrders();
  }, [isLogin, currentPage, selectedStatus]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await OrderApiService.getUserOrders(currentPage, 10, selectedStatus);
      setOrders(response.orders);
      setTotalPages(response.pagination.totalPages);
    } catch (error: any) {
      console.error("Error loading orders:", error);
      showErrorToast(error.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "confirmed":
        return "text-blue-600 bg-blue-100";
      case "processing":
        return "text-purple-600 bg-purple-100";
      case "shipped":
        return "text-indigo-600 bg-indigo-100";
      case "delivered":
        return "text-green-600 bg-green-100";
      case "cancelled":
        return "text-red-600 bg-red-100";
      case "returned":
        return "text-orange-600 bg-orange-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  if (!isLogin) {
    return null;
  }

  return (
    <>
      <Breadcrumb title="My Orders" />
      <section className="gi-orders-section padding-tb-40">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h2 className="mb-4">My Orders</h2>

              {/* Status Filter */}
              <div className="mb-4">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="form-select"
                  style={{ maxWidth: "200px" }}
                >
                  <option value="">All Orders</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="returned">Returned</option>
                </select>
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <Spinner />
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-5">
                  <h4>No orders found</h4>
                  <p>You haven't placed any orders yet.</p>
                  <button
                    onClick={() => router.push("/")}
                    className="btn btn-primary"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <>
                  {/* Orders List */}
                  <div className="orders-list">
                    {orders.map((order) => (
                      <div key={order._id} className="card mb-4">
                        <div className="card-header d-flex justify-content-between align-items-center">
                          <div>
                            <h5 className="mb-0">Order #{order.orderNumber}</h5>
                            <small className="text-muted">
                              Placed on {formatDate(order.createdAt)}
                            </small>
                          </div>
                          <div className="text-end">
                            <span
                              className={`badge px-3 py-2 ${getStatusColor(
                                order.orderStatus
                              )}`}
                            >
                              {order.orderStatus.charAt(0).toUpperCase() +
                                order.orderStatus.slice(1)}
                            </span>
                            <div className="mt-2">
                              <strong>Total: {formatPrice(order.total)}</strong>
                            </div>
                          </div>
                        </div>
                        <div className="card-body">
                          {/* Order Items */}
                          <div className="order-items mb-3">
                            <h6>Items:</h6>
                            {order.items.map((item, index) => (
                              <div
                                key={index}
                                className="d-flex align-items-center mb-2"
                              >
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  style={{
                                    width: "50px",
                                    height: "50px",
                                    objectFit: "cover",
                                    marginRight: "15px",
                                  }}
                                />
                                <div className="flex-grow-1">
                                  <div className="fw-bold">{item.title}</div>
                                  <small className="text-muted">
                                    Qty: {item.quantity} × {formatPrice(item.price)}
                                  </small>
                                </div>
                                <div className="fw-bold">
                                  {formatPrice(item.totalPrice)}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Order Details */}
                          <div className="row">
                            <div className="col-md-6">
                              <h6>Shipping Address:</h6>
                              <p className="mb-1">
                                {order.shippingAddress.addressLine1}
                              </p>
                              {order.shippingAddress.city && (
                                <p className="mb-1">
                                  {order.shippingAddress.city}
                                  {order.shippingAddress.state && `, ${order.shippingAddress.state}`}
                                  {order.shippingAddress.postalCode && ` ${order.shippingAddress.postalCode}`}
                                </p>
                              )}
                              <p className="mb-1">{order.shippingAddress.country}</p>
                              {order.shippingAddress.phone && (
                                <p className="mb-0">Phone: {order.shippingAddress.phone}</p>
                              )}
                            </div>
                            <div className="col-md-6">
                              <h6>Order Summary:</h6>
                              <div className="d-flex justify-content-between">
                                <span>Subtotal:</span>
                                <span>{formatPrice(order.subtotal)}</span>
                              </div>
                              <div className="d-flex justify-content-between">
                                <span>Tax:</span>
                                <span>{formatPrice(order.tax)}</span>
                              </div>
                              <div className="d-flex justify-content-between">
                                <span>Shipping:</span>
                                <span>{formatPrice(order.shippingCost)}</span>
                              </div>
                              {order.discount > 0 && (
                                <div className="d-flex justify-content-between text-success">
                                  <span>Discount:</span>
                                  <span>-{formatPrice(order.discount)}</span>
                                </div>
                              )}
                              <hr />
                              <div className="d-flex justify-content-between fw-bold">
                                <span>Total:</span>
                                <span>{formatPrice(order.total)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Tracking Info */}
                          {order.trackingNumber && (
                            <div className="mt-3">
                              <h6>Tracking Information:</h6>
                              <p className="mb-1">
                                <strong>Tracking Number:</strong> {order.trackingNumber}
                              </p>
                              {order.estimatedDelivery && (
                                <p className="mb-0">
                                  <strong>Estimated Delivery:</strong>{" "}
                                  {formatDate(order.estimatedDelivery)}
                                </p>
                              )}
                            </div>
                          )}

                          {/* Order Notes */}
                          {order.notes && (
                            <div className="mt-3">
                              <h6>Notes:</h6>
                              <p className="mb-0">{order.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <nav aria-label="Orders pagination">
                      <ul className="pagination justify-content-center">
                        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                          >
                            Previous
                          </button>
                        </li>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <li
                            key={page}
                            className={`page-item ${currentPage === page ? "active" : ""}`}
                          >
                            <button
                              className="page-link"
                              onClick={() => setCurrentPage(page)}
                            >
                              {page}
                            </button>
                          </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                          >
                            Next
                          </button>
                        </li>
                      </ul>
                    </nav>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default OrdersPage; 