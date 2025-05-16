

import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../Loader/Loader';
import { orderContext } from '../context/OrderContext.js';
import PaymentStep from './PaymentStep.js';
import { usePayment } from '../context/PaymentContext';
import Cookies from 'js-cookie';

export default function OrderDetails() {
  const { getOrder ,updateOrder } = useContext(orderContext);
  const { verifyPayPalPayment } = usePayment();
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [orderStatus,setorderStatus]=useState('')



  const updateOrderFunction=async(updates)=>{
      try {
        //  let updates={isPaid:true}
         const response=await updateOrder(updates , order._id)
         console.log(response.data);
         setorderStatus(response.data.status)
         fetchOrder()
         
      } catch (error) {
        console.log(error);
        
      }
    }
 const fetchOrder = async () => {
      try {
        const data = await getOrder(orderId);
        
        if (data.status === 'success') {
          setOrder(data.order);
          setPaymentMethod(data.order.paymentMethod);
          setorderStatus(data.order.status)
         
          
           
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch order');
      } finally {
        setLoading(false);
         console.log('status   :  '+orderStatus);
      }

    };

  useEffect(() => {
   

    // Check for PayPal return
    const paymentId = searchParams.get('paymentId');
    const payerId = searchParams.get('PayerID');
    const paymentSuccess = searchParams.get('payment') === 'success';

    if (paymentId && payerId) {
      verifyPayPalPayment(orderId, paymentId, payerId)
        .then(() => {
          navigate(`/order/${orderId}?payment=success`, { replace: true });
          fetchOrder();
        })
        .catch(error => {
          toast.error('Payment verification failed');
          navigate(`/order/${orderId}`, { replace: true });
        });
    } else if (paymentSuccess) {
      toast.success('Payment successful!');
      fetchOrder();
    } else {
      fetchOrder();
    }
  }, [orderId, searchParams, navigate, getOrder, verifyPayPalPayment , orderStatus]);

  const handlePaymentSuccess = () => {
    // Refresh order data after successful payment
    getOrder(orderId)
      .then(data => {
        if (data.status === 'success') {
          setOrder(data.order);
          toast.success('Payment successful!');
        }
      });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing':
        return 'text-warning';
      case 'Shipped':
        return 'text-info';
      case 'Delivered':
        return 'text-success';
      case 'Cancelled':
        return 'text-danger';
      default:
        return 'text-white';
    }
  };

  if (loading) return <Loader />;
  if (!order) return <div className="Dark-Color text-white py-5 text-center">Order not found</div>;

  return (
    <div className="Dark-Color text-white py-5">
      <div className="container pt-5">
        <div className="row">
          <div className="col-md-8 ">
            <h2>Order #{order._id}</h2>
            <div className="card bg-dark-color  ">
              <div className="card-body text-white">
                <h4 className="mb-3">Shipping</h4>
                <p>
                  <strong>Name: </strong> {order.user.name}
                </p>
                <p>
                  <strong>Phone: </strong> {order.shippingAddress.phone}
                </p>
                <p>
                  <strong>Address: </strong> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                </p>
                <p className={getStatusColor(order.status)}>
                  <strong>Status: </strong> {orderStatus}
                </p>
              </div>
            </div>

            <div className="card bg-dark-color border-main">
              <div className="card-body text-white">
                <h4 className="">Payment</h4>
                <p>
                  <strong>Method: </strong> {order.paymentMethod}
                </p>
                <p className={order.isPaid === true ? 'text-success' : 'text-danger'}>
                  <strong className='text-white'>Status: </strong> 
                  <h5 className='d-inline'>{order.isPaid ? 'paid' : 'not paid'}</h5>
                </p>
              </div>
            </div>

            <div className="card bg-dark-color border-main">
              <div className="card-body text-white">
                <h4 className="">Order Items</h4>
                {order.orderItems.map((item) => (
                  <div key={item._id} className="row border-bottom align-items-center">
                    <div className="col-md-2">
                      <img src={item.product.images[0]} alt={item.product.name} className="img-fluid" />
                    </div>
                    <div className="col-md-5">
                      <Link to={`/product-details/${item.product._id}`} className="text-white">
                        {item.product.name}
                      </Link>
                    </div>
                    <div className="col-md-3 text-center">
                      {item.quantity} x {item.product.price} EGP = {item.quantity * item.product.price} EGP
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card bg-dark-color border-main">
              <div className="card-body text-white">
                <h4 className="mb-3">Order Summary</h4>
                <div className="d-flex justify-content-between mb-2">
                  <span>Items</span>
                  <span>{order.itemsPrice.toLocaleString()} EGP</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping</span>
                  <span>{order.shippingPrice.toLocaleString()} EGP</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Tax</span>
                  <span>{order.taxPrice.toLocaleString()} EGP</span>
                </div>
                <hr className="border-main" />
                <div className="d-flex justify-content-between mb-3">
                  <strong>Total</strong>
                  <strong>{order.totalPrice.toLocaleString()} EGP</strong>
                </div>
                
                {order.status === 'Processing' && !order.isPaid && (
                  <button onClick={()=>{
                updateOrderFunction({status:'Cancelled'} )
                
                  }} className="btn btn-danger w-100 mb-2">Cancel Order</button>
                )}
                
                {/* Payment Step Integration */}
                {!order.isPaid && (
                  <PaymentStep 
                    order={order} 
                    paymentMethod={order.paymentMethod} 
                    onSuccess={handlePaymentSuccess}
                  />
                )}
                
                <Link to="/orders" className="btn btn-outline-main text-white w-100 mt-2">
                  Back to Orders
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}