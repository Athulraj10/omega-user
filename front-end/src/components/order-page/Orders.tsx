"use client"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../store"
import TrackViewModal from "../model/TrackViewModal"
import { Col, Row } from "react-bootstrap"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { fetchOrdersRequest } from "../../store/actions"

const OrderPage = () => {
   const [show, setShow] = useState(false)
   const { orders, loading, error } = useSelector(
      (state: RootState) => state.order || { orders: [], loading: false, error: null }
   )
   const router = useRouter()
   const dispatch = useDispatch()

   const [currentDate, setCurrentDate] = useState(new Date().toLocaleDateString("en-GB"))

   useEffect(() => {
      dispatch(fetchOrdersRequest())
      setCurrentDate(new Date().toLocaleDateString("en-GB"))
   }, [dispatch])

   const handleClose = () => setShow(false)
   const handleShow = () => {
      setShow(true)
   }

   if (loading) {
      return (
         <section className='gi-faq padding-tb-40 gi-wishlist'>
            <div className='container'>
               <div className='section-title-2'>
                  <h2 className='gi-title'>
                     Product <span>Order List</span>
                  </h2>
                  <p>Your product Order is our first priority.</p>
               </div>
               <Row>
                  <Col md={12}>
                     <div className='text-center'>
                        <p>Loading orders...</p>
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
               <div className='section-title-2'>
                  <h2 className='gi-title'>
                     Product <span>Order List</span>
                  </h2>
                  <p>Your product Order is our first priority.</p>
               </div>
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

   return (
      <>
         <section className='gi-faq padding-tb-40 gi-wishlist'>
            <div className='container'>
               <div className='section-title-2'>
                  <h2 className='gi-title'>
                     Product <span>Order List</span>
                  </h2>
                  <p>Your product Order is our first priority.</p>
               </div>
               <Row>
                  <Col md={12}>
                     <div className='gi-vendor-dashboard-card'>
                        <div className='gi-vendor-card-header'>
                           <h5>Pending Orders</h5>
                           <div className='gi-header-btn'>
                              <Link className='gi-btn-2' href='/shop-left-sidebar-col-3'>
                                 Shop Now
                              </Link>
                           </div>
                        </div>
                        <div className='gi-vendor-card-body'>
                           <div className='gi-vendor-card-table'>
                              <table className='table gi-table'>
                                 <thead>
                                    <tr>
                                       <th scope='col'>Orders ID</th>
                                       <th scope='col'>Shipping</th>
                                       <th scope='col'>Quantity</th>
                                       <th scope='col'>Date</th>
                                       <th scope='col'>Price</th>
                                       <th scope='col'>Status</th>
                                       <th scope='col'>Action</th>
                                    </tr>
                                 </thead>
                                 <tbody className='wish-empt'>
                                    {orders.filter(
                                       (o: any) =>
                                          o.status === "pending" ||
                                          o.status === "processing"
                                    ).length === 0 ? (
                                       <tr>
                                          <td colSpan={7} className='text-center'>
                                             <span style={{ display: "flow" }}>
                                                No pending orders found
                                             </span>
                                          </td>
                                       </tr>
                                    ) : (
                                       <>
                                          {orders
                                             .filter(
                                                (o: any) =>
                                                   o.status === "pending" ||
                                                   o.status === "processing"
                                             )
                                             .map((data: any, index) => (
                                                <tr
                                                   key={index}
                                                   style={{ cursor: "pointer" }}
                                                   className='pro-gl-content'
                                                >
                                                   <td scope='row'>
                                                      <span>{data._id}</span>
                                                   </td>
                                                   <td>
                                                      <span>Standard</span>
                                                   </td>
                                                   <td>
                                                      <span>{data.items.length}</span>
                                                   </td>
                                                   <td>
                                                      <span>
                                                         {new Date(
                                                            data.createdAt
                                                         ).toLocaleDateString()}
                                                      </span>
                                                   </td>
                                                   <td>
                                                      <span>${data.totalAmount}</span>
                                                   </td>
                                                   <td>
                                                      <span className='avl'>
                                                         {data.status}
                                                      </span>
                                                   </td>
                                                   <td>
                                                      <span className='avl'>
                                                         <Link
                                                            href={`/orders/${data._id}`}
                                                            style={{
                                                               padding: "20px 30px",
                                                            }}
                                                            className='gi-btn-2'
                                                         >
                                                            View
                                                         </Link>
                                                      </span>
                                                   </td>
                                                </tr>
                                             ))}
                                       </>
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
         <section className='gi-faq padding-tb-40 gi-wishlist'>
            <div className='container'>
               <Row>
                  <Col md={12}>
                     <div className='gi-vendor-dashboard-card'>
                        <div className='gi-vendor-card-header'>
                           <h5>Completed Orders</h5>
                        </div>
                        <div className='gi-vendor-card-body'>
                           <div className='gi-vendor-card-table'>
                              <table className='table gi-table'>
                                 <thead>
                                    <tr>
                                       <th scope='col'>Orders ID</th>
                                       <th scope='col'>Shipping</th>
                                       <th scope='col'>Quantity</th>
                                       <th scope='col'>Date</th>
                                       <th scope='col'>Price</th>
                                       <th scope='col'>Status</th>
                                       <th scope='col'>Action</th>
                                    </tr>
                                 </thead>
                                 <tbody className='wish-empt'>
                                    {orders.filter(
                                       (o: any) =>
                                          o.status === "delivered" ||
                                          o.status === "shipped"
                                    ).length === 0 ? (
                                       <tr>
                                          <td colSpan={7} className='text-center'>
                                             <span style={{ display: "flow" }}>
                                                No completed orders found
                                             </span>
                                          </td>
                                       </tr>
                                    ) : (
                                       <>
                                          {orders
                                             .filter(
                                                (o: any) =>
                                                   o.status === "delivered" ||
                                                   o.status === "shipped"
                                             )
                                             .map((data: any, index: number) => (
                                                <tr
                                                   key={index}
                                                   style={{ cursor: "pointer" }}
                                                   onClick={handleShow}
                                                   className='pro-gl-content'
                                                >
                                                   <td scope='row'>
                                                      <span>{data._id}</span>
                                                   </td>
                                                   <td>
                                                      <span>Standard</span>
                                                   </td>
                                                   <td>
                                                      <span>{data.items.length}</span>
                                                   </td>
                                                   <td>
                                                      <span>
                                                         {new Date(
                                                            data.createdAt
                                                         ).toLocaleDateString()}
                                                      </span>
                                                   </td>
                                                   <td>
                                                      <span>${data.totalAmount}</span>
                                                   </td>
                                                   <td>
                                                      <span className='out'>
                                                         {data.status}
                                                      </span>
                                                   </td>
                                                   <td>
                                                      <span className='avl'>
                                                         <Link
                                                            href={`/orders/${data._id}`}
                                                            style={{
                                                               padding: "20px 30px",
                                                            }}
                                                            className='gi-btn-2'
                                                         >
                                                            View
                                                         </Link>
                                                      </span>
                                                   </td>
                                                </tr>
                                             ))}
                                       </>
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
         <TrackViewModal
            currentDate={currentDate}
            handleClose={handleClose}
            show={show}
         />
      </>
   )
}

export default OrderPage
