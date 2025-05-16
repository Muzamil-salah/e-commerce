// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import Cookies from 'js-cookie';

// export default function LiveOrders() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const token = Cookies.get('token');
//         const response = await axios.get('http://localhost:8000/api/v1/order/getAll', {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
        
//         if (response.data.status === 'success') {
//           setOrders(response.data.orders);
//         } else {
//           setError('Failed to fetch orders');
//         }
//       } catch (err) {
//         setError(err.response?.data?.message || 'Error fetching orders');
//         toast.error(err.response?.data?.message || 'Error fetching orders');
//       } finally {
//         setLoading(false);
        
//       }
//     };

//     fetchOrders();
//   }, []);

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//   };

//   const getStatusBadge = (status) => {
//     let badgeClass = '';
//     switch (status) {
//       case 'Processing':
//         badgeClass = 'bg-warning text-dark';
//         break;
//       case 'Shipped':
//         badgeClass = 'bg-info text-white';
//         break;
//       case 'Delivered':
//         badgeClass = 'bg-success text-white';
//         break;
//       case 'Cancelled':
//         badgeClass = 'bg-danger text-white';
//         break;
//       default:
//         badgeClass = 'bg-secondary text-white';
//     }
//     return <span className={`badge ${badgeClass}`}>{status}</span>;
//   };

//   if (loading) {
//     return (
//       <div className="mt-5 pt-5 text-center">
//         <div className="spinner-border text-primary" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="mt-5 pt-5 text-center text-danger">
//         <p>{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className=' bg-dark'>
//       <div className=" container pt-5">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <Link to="/admin" className="text-decoration-none">
//           <i className="fa-solid fa-circle-arrow-left fs-2 main-color"></i>
//         </Link>
//         <h2 className="text-center mb-0 text-white" >Live Orders</h2>
//         <div style={{ width: '32px' }}></div> {/* Spacer for alignment */}
//       </div>

//       <div className="table-responsive">
//         <table className="table table-striped table-hover">
//           <thead className="table-dark">
//             <tr>
//               <th>Order ID</th>
//               <th>Customer</th>
//               <th>Date</th>
//               <th>Items</th>
//               <th>Total</th>
//               <th>Status</th>
//               <th>Details</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {orders.length > 0 ? (
//               orders.map((order) => (
//                 <tr key={order._id}>
//                   <td>{order._id.substring(0, 8)}...</td>
//                   <td>{order.user?.name || 'Guest'}</td>
//                   <td>{formatDate(order.createdAt)}</td>
//                   <td>{order.orderItems.length}</td>
//                   <td>${order.totalPrice.toFixed(2)}</td>
//                   <td>{getStatusBadge(order.status)}</td>
//                   <td>
//                     <Link
//                       to={`/order/${order._id}`}
//                       className="btn btn-sm bg-main "
//                     >
//                       View
//                     </Link>
//                   </td>
                  
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="7" className="text-center py-4">
//                   No orders found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//     </div>
//   );
// }



// ///////////////////////////////////////////////////////////////////////////////////////////

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

export default function LiveOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const statuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

  // Validation schema
  const orderSchema = Yup.object().shape({
    status: Yup.string()
      .required('Status is required'),
    isPaid: Yup.boolean().required(),
    isDelivered: Yup.boolean().required()
  });

    const fetchOrders = async () => {
      try {
        const token = Cookies.get('token');
        const response = await axios.get('http://localhost:8000/api/v1/order/getAll', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (response.data.status === 'success') {
          setOrders(response.data.orders);
        } else {
          setError('Failed to fetch orders');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching orders');
        toast.error(err.response?.data?.message || 'Error fetching orders');
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
  

    fetchOrders();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status) => {
    let badgeClass = '';
    switch (status) {
      case 'Processing':
        badgeClass = 'bg-warning text-dark';
        break;
      case 'Shipped':
        badgeClass = 'bg-info text-white';
        break;
      case 'Delivered':
        badgeClass = 'bg-success text-white';
        break;
      case 'Cancelled':
        badgeClass = 'bg-danger text-white';
        break;
      default:
        badgeClass = 'bg-secondary text-white';
    }
    return <span className={`badge ${badgeClass}`}>{status}</span>;
  };

  const handleEditClick = (order) => {
    console.log(order);
    
    setCurrentOrder(order);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setCurrentOrder(null);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      console.log(currentOrder);
      
      const token = Cookies.get('token');
      const response = await axios.put(
        `http://localhost:8000/api/v1/order/update/${currentOrder._id}`,
        { 
          status: values.status,
          isPaid: values.isPaid,
          isDelivered: values.isDelivered
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      

      if (response.data.status === 'success') {
        toast.success('Order updated successfully');
        console.log(orders);
        
        setOrders(orders.map(order => 
          order._id === currentOrder._id ? response.data.data : order
        ));
        handleCloseEditModal();
        fetchOrders()
        
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating order');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="mt-5 pt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-5 pt-5 text-center text-danger">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className='bg-dark'>
      <div className="container pt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Link to="/admin" className="text-decoration-none">
            <i className="fa-solid fa-circle-arrow-left fs-2 main-color"></i>
          </Link>
          <h2 className="text-center mb-0 text-white">Live Orders</h2>
          <div style={{ width: '32px' }}></div>
        </div>

        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Details</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id.substring(0, 8)}...</td>
                    <td>{order.user?.name || 'Guest'}</td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>{order.orderItems.length}</td>
                    <td>${order.totalPrice.toFixed(2)}</td>
                    <td>{getStatusBadge(order.status)}</td>
                    <td>
                      <Link
                        to={`/order/${order._id}`}
                        className="btn btn-sm bg-main"
                      >
                        View
                      </Link>
                    </td>
                    <td>
                      <button 
                        className="btn btn-sm btn-primary"
                        onClick={() => handleEditClick(order)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Edit Order Modal */}
        {showEditModal && (
          <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Order #{currentOrder?._id.substring(0, 8)}...</h5>
                  <button type="button" className="btn-close" onClick={handleCloseEditModal}></button>
                </div>
                <div className="modal-body">
                  {currentOrder && (
                    <Formik
                      initialValues={{
                        status: currentOrder.status,
                        isPaid: currentOrder.isPaid || false,
                        isDelivered: currentOrder.isDelivered || false
                      }}
                      validationSchema={orderSchema}
                      onSubmit={handleSubmit}
                    >
                      {({ isSubmitting, values }) => (
                        <Form>
                          <div className="mb-3">
                            <label htmlFor="status" className="form-label">Status</label>
                            <Field as="select" name="status" className="form-select">
                              {statuses.map(status => (
                                <option key={status} value={status}>{status}</option>
                              ))}
                            </Field>
                            <ErrorMessage name="status" component="div" className="text-danger small" />
                          </div>

                          <div className="mb-3">
                            <label className="form-label">Payment Status</label>
                            <div className="d-flex gap-4">
                              <label className="d-flex align-items-center gap-2">
                                <Field 
                                  type="radio" 
                                  name="isPaid" 
                                  value="true" 
                                  className="form-check-input"
                                />
                                Paid
                              </label>
                              <label className="d-flex align-items-center gap-2">
                                <Field 
                                  type="radio" 
                                  name="isPaid" 
                                  value="false" 
                                  className="form-check-input"
                                />
                                Not Paid
                              </label>
                            </div>
                          </div>

                          <div className="mb-3">
                            <label className="form-label">Delivery Status</label>
                            <div className="d-flex gap-4">
                              <label className="d-flex align-items-center gap-2">
                                <Field 
                                  type="radio" 
                                  name="isDelivered" 
                                  value="true" 
                                  className="form-check-input"
                                />
                                Delivered
                              </label>
                              <label className="d-flex align-items-center gap-2">
                                <Field 
                                  type="radio" 
                                  name="isDelivered" 
                                  value="false" 
                                  className="form-check-input"
                                />
                                Not Delivered
                              </label>
                            </div>
                          </div>

                          <div className="d-flex justify-content-end">
                            <button 
                              type="button" 
                              className="btn btn-secondary me-2" 
                              onClick={handleCloseEditModal}
                            >
                              Cancel
                            </button>
                            <button 
                              type="submit" 
                              className="btn btn-primary" 
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </button>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}