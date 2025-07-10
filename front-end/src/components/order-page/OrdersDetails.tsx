"use client"
import { RootState } from "@/store"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Col, Row } from "react-bootstrap"
import { useSelector, useDispatch } from "react-redux"
import { fetchOrderDetailRequest } from "../../store/actions"

interface OrderItem {
   product: string
   quantity: number
   priceAtPurchase: number
}

interface Order {
   _id: string
   user: string
   items: OrderItem[]
   shippingAddress: {
      label?: string
      addressLine1: string
      addressLine2?: string
      city: string
      state?: string
      postalCode: string
      country: string
      phone?: string
   }
   status: string
   paymentStatus: string
   totalAmount: number
   createdAt: string
   updatedAt: string
}

const ProductOrderDetails = ({ id }: { id: string }) => {
   const { orderDetails, loading, error } = useSelector(
      (state: RootState) =>
         state.order || { orderDetails: null, loading: false, error: null }
   )
   const router = useRouter()
   const dispatch = useDispatch()
   const [currentDate, setCurrentDate] = useState<string>(
      new Date().toLocaleDateString("en-GB")
   )

   useEffect(() => {
      if (id) {
         dispatch(fetchOrderDetailRequest(id))
      }
      setCurrentDate(new Date().toLocaleDateString("en-GB"))
   }, [dispatch, id])

   const handleBackBtn = () => {
      router.push("/orders")
   }

   if (loading) {
      return (
         <section className='gi-faq padding-tb-40 gi-wishlist'>
            <div className='container'>
               <Row>
                  <Col md={12}>
                     <div className='text-center'>
                        <p>Loading order details...</p>
                     </div>
                  </Col>
               </Row>
            </div>
         </section>
      )
   }

   if (error) {
      return (
         <section className='gi-faq padding-tb-40 gi-wishlist'>
            <div className='container'>
               <Row>
                  <Col md={12}>
                     <div className='text-center'>
                        <p>Error: {error}</p>
                     </div>
                  </Col>
               </Row>
            </div>
         </section>
      )
   }

   if (!orderDetails) {
      return (
         <section className='gi-faq padding-tb-40 gi-wishlist'>
            <div className='container'>
               <Row>
                  <Col md={12}>
                     <div className='text-center'>
                        <p>Order not found</p>
                     </div>
                  </Col>
               </Row>
            </div>
         </section>
      )
   }

   return (
      <>
         <section className='gi-faq padding-tb-40 gi-wishlist'>
            <div className='container'>
               <Row>
                  <Col lg={3} className='m-b-991'>
                     <div className='bill-box' style={{ lineHeight: "25px" }}>
                        <div className='gi-single-list'>
                           <ul>
                              <li>
                                 <strong className='gi-check-subtitle'>Order ID:</strong>{" "}
                                 <span style={{ color: "#777" }}>{orderDetails._id}</span>
                              </li>
                              <li>
                                 <strong className='gi-check-subtitle'>Status:</strong>{" "}
                                 <span style={{ color: "#777" }}>
                                    {orderDetails.status}
                                 </span>
                              </li>
                              <li>
                                 <strong className='gi-check-subtitle'>Payment:</strong>{" "}
                                 <span style={{ color: "#777" }}>
                                    {orderDetails.paymentStatus}
                                 </span>
                              </li>
                              <li>
                                 <strong className='gi-check-subtitle'>Total:</strong>{" "}
                                 <span style={{ color: "#777" }}>
                                    ${orderDetails.totalAmount}
                                 </span>
                              </li>
                              <li>
                                 <strong className='gi-check-subtitle'>Date:</strong>{" "}
                                 <span style={{ color: "#777" }}>
                                    {new Date(
                                       orderDetails.createdAt
                                    ).toLocaleDateString()}
                                 </span>
                              </li>
                           </ul>
                        </div>
                        {orderDetails.shippingAddress && (
                           <div className='gi-single-list'>
                              <h6>Shipping Address:</h6>
                              <ul>
                                 <li>
                                    <strong className='gi-check-subtitle'>
                                       Address:
                                    </strong>{" "}
                                    <span style={{ color: "#777" }}>
                                       {orderDetails.shippingAddress.addressLine1}
                                    </span>
                                 </li>
                                 {orderDetails.shippingAddress.addressLine2 && (
                                    <li>
                                       <span style={{ color: "#777" }}>
                                          {orderDetails.shippingAddress.addressLine2}
                                       </span>
                                    </li>
                                 )}
                                 <li>
                                    <strong className='gi-check-subtitle'>City:</strong>{" "}
                                    <span style={{ color: "#777" }}>
                                       {orderDetails.shippingAddress.city}
                                    </span>
                                 </li>
                                 {orderDetails.shippingAddress.state && (
                                    <li>
                                       <strong className='gi-check-subtitle'>
                                          State:
                                       </strong>{" "}
                                       <span style={{ color: "#777" }}>
                                          {orderDetails.shippingAddress.state}
                                       </span>
                                    </li>
                                 )}
                                 <li>
                                    <strong className='gi-check-subtitle'>
                                       Postal Code:
                                    </strong>{" "}
                                    <span style={{ color: "#777" }}>
                                       {orderDetails.shippingAddress.postalCode}
                                    </span>
                                 </li>
                                 <li>
                                    <strong className='gi-check-subtitle'>
                                       Country:
                                    </strong>{" "}
                                    <span style={{ color: "#777" }}>
                                       {orderDetails.shippingAddress.country}
                                    </span>
                                 </li>
                                 {orderDetails.shippingAddress.phone && (
                                    <li>
                                       <strong className='gi-check-subtitle'>
                                          Phone:
                                       </strong>{" "}
                                       <span style={{ color: "#777" }}>
                                          {orderDetails.shippingAddress.phone}
                                       </span>
                                    </li>
                                 )}
                              </ul>
                           </div>
                        )}
                     </div>
                  </Col>
                  <Col md={12} lg={9}>
                     <div className='gi-vendor-dashboard-card'>
                        <div className='gi-vendor-card-header'>
                           <button
                              onClick={handleBackBtn}
                              style={{
                                 display: "flex",
                                 alignItems: "center",
                                 backgroundColor: "#5caf90",
                                 padding: "10px 10px",
                                 borderRadius: "4px",
                                 color: "whitesmoke",
                              }}
                              className=''
                              type='submit'
                           >
                              <i
                                 style={{ display: "flex" }}
                                 className='fi fi-rs-arrow-left'
                              ></i>
                           </button>
                           <h5>Order Items</h5>
                           <span
                              style={{ float: "inline-end" }}
                              className='gi-register-wrap'
                           ></span>
                        </div>
                        <div className='gi-vendor-card-body'>
                           <div className='gi-vendor-card-table'>
                              <table className='table gi-table'>
                                 <thead>
                                    <tr>
                                       <th scope='col'>ID</th>
                                       <th scope='col'>Product ID</th>
                                       <th scope='col'>Quantity</th>
                                       <th scope='col'>Price</th>
                                       <th scope='col'>Total</th>
                                    </tr>
                                 </thead>
                                 <tbody
                                    style={{ textAlign: "center" }}
                                    className='wish-empt'
                                 >
                                    {orderDetails.items &&
                                    orderDetails.items.length > 0 ? (
                                       orderDetails.items.map(
                                          (item: OrderItem, itemIndex: number) => (
                                             <tr
                                                key={`${itemIndex}`}
                                                className='pro-gl-content'
                                             >
                                                <td scope='row'>
                                                   <span>{itemIndex + 1}</span>
                                                </td>
                                                <td>
                                                   <span>{item.product}</span>
                                                </td>
                                                <td>
                                                   <span>{item.quantity}</span>
                                                </td>
                                                <td>
                                                   <span>${item.priceAtPurchase}</span>
                                                </td>
                                                <td>
                                                   <span>
                                                      $
                                                      {item.priceAtPurchase *
                                                         item.quantity}
                                                   </span>
                                                </td>
                                             </tr>
                                          )
                                       )
                                    ) : (
                                       <tr>
                                          <td colSpan={5} className='text-center'>
                                             <span>No items found</span>
                                          </td>
                                       </tr>
                                    )}
                                 </tbody>
                              </table>
                           </div>
                        </div>
                     </div>
                  </Col>
               </Row>
            </div>
         </section>
      </>
   )
}

export default ProductOrderDetails
