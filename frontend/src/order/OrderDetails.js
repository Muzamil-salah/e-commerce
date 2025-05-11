import React, { useContext, useEffect, useState } from 'react';
import { storeContext } from '../context/storeContext';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../Loader/Loader';

export default function OrderDetails() {
  const { getOrder } = useContext(storeContext);
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrder(orderId);
        setOrder(data.order);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch order');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) return <Loader />;
  if (!order) return <div className="Dark-Color text-white py-5 text-center">Order not found</div>;

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

  return (
    <div className="Dark-Color text-white py-5">
      <div className="container">
        <div className="row">
          <div className="col-md-8">
            <h2>Order #{order._id}</h2>
            <div className="card Dark-Color border-main mb-4">
              <div className="card-body">
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
                <p className={getStatusColor(order.orderStatus)}>
                  <strong>Status: </strong> {order.orderStatus}
                </p>
              </div>
            </div>

            <div className="card Dark-Color border-main mb-4">
              <div className="card-body">
                <h4 className="mb-3">Payment</h4>
                <p>
                  <strong>Method: </strong> {order.paymentMethod}
                </p>
                <p className={order.paymentStatus === 'Paid' ? 'text-success' : 'text-danger'}>
                  <strong>Status: </strong> {order.paymentStatus}
                </p>
              </div>
            </div>

            <div className="card Dark-Color border-main">
              <div className="card-body">
                <h4 className="mb-3">Order Items</h4>
                {order.orderItems.map((item) => (
                  <div key={item._id} className="row border-bottom py-2 align-items-center">
                    <div className="col-md-2">
                      <img src={item.product.images[0]} alt={item.product.name} className="img-fluid" />
                    </div>
                    <div className="col-md-5">
                      <Link to={`/product/${item.product._id}`} className="text-white">
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
            <div className="card Dark-Color border-main">
              <div className="card-body">
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
                {order.orderStatus === 'Processing' && (
                  <button className="btn btn-danger w-100 mb-2">Cancel Order</button>
                )}
                {order.paymentMethod === 'CreditCard' && order.paymentStatus === 'Unpaid' && (
                  <button className="btn bg-main text-white w-100">Pay Now</button>
                )}
                <Link to="/orders" className="btn btn-outline-main w-100 mt-2">
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