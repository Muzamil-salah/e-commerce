import React, { useContext, useEffect, useState } from 'react';
import { storeContext } from '../context/storeContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../Loader/Loader';
import { orderContext } from '../context/OrderContext.js';

export default function OrderList() {
  const { getMyOrders } = useContext(storeContext);
   const {createOrder , getOrderById ,orders,setOrders,loading,setLoading,error,setError,} = useContext(orderContext)
  // const [orders, setOrders] = useState([]);
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrderById();
        console.log(data);
        
        // setOrders(data);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="Dark-Color text-white py-5">
      <div className="container pt-5">
        <h2 className="mb-4">My Orders</h2>
        {orders.length === 0 ? (
          <div className="text-center py-5">
            <h4>You have no orders yet</h4>
            <Link to="/products" className="btn bg-main text-white mt-3">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>{order.totalPrice.toLocaleString()} EGP</td>
                    <td>
                      <span className={`badge ${
                        order.orderStatus === 'Delivered' ? 'bg-success' :
                        order.orderStatus === 'Cancelled' ? 'bg-danger' :
                        'bg-warning'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td>
                      <Link to={`/order/${order._id}`} className="btn btn-sm bg-main text-white">
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}