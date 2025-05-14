import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

export default function LiveOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
    <div className='bg-grad'>
      <div className=" container mt-5 pt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Link to="/admin" className="text-decoration-none">
          <i className="fa-solid fa-circle-arrow-left fs-2 main-color"></i>
        </Link>
        <h2 className="text-center mb-0 text-white" >Live Orders</h2>
        <div style={{ width: '32px' }}></div> {/* Spacer for alignment */}
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
                      className="btn btn-sm bg-main "
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
}