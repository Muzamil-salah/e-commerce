import React, { useContext, useState } from 'react';
import { storeContext } from '../context/storeContext';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

export default function PlaceOrder() {
  const { cart, createOrder, clearCart } = useContext(storeContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: '',
    postalCode: '',
    phone: '',
    paymentMethod: 'CashOnDelivery'
  });

  const handleChange = (e) => {
    setShippingInfo({...shippingInfo, [e.target.name]: e.target.value});
  };

  const placeOrderHandler = async () => {
    setLoading(true);
    try {
      const orderData = {
        orderItems: cart.cartItems,
        shippingAddress: shippingInfo,
        paymentMethod: shippingInfo.paymentMethod,
        totalPrice: cart.totalPrice
      };
      
      const data = await createOrder(orderData);
      
      if(data.status === 'success') {
        await clearCart();
        toast.success('Order placed successfully!');
        navigate(`/order/${data.order._id}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!cart || cart.cartItems.length === 0) {
    return (
      <div className="Dark-Color text-white py-5 text-center">
        <h3>Your cart is empty</h3>
        <Link to="/products" className="btn bg-main text-white mt-3">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="Dark-Color text-white py-5">
      <div className="container">
        <div className="row">
          <div className="col-md-8">
            <h2>Shipping Information</h2>
            <div className="card Dark-Color border-main mb-4">
              <div className="card-body">
                <div className="form-group mb-3">
                  <label>Address</label>
                  <input
                    type="text"
                    className="form-control Gray-Color text-white"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label>City</label>
                      <input
                        type="text"
                        className="form-control Gray-Color text-white"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label>Postal Code</label>
                      <input
                        type="text"
                        className="form-control Gray-Color text-white"
                        name="postalCode"
                        value={shippingInfo.postalCode}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="form-group mb-3">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    className="form-control Gray-Color text-white"
                        name="phone"
                        value={shippingInfo.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label>Payment Method</label>
                      <select
                        className="form-control Gray-Color text-white"
                        name="paymentMethod"
                        value={shippingInfo.paymentMethod}
                        onChange={handleChange}
                      >
                        <option value="CashOnDelivery">Cash on Delivery</option>
                        <option value="CreditCard">Credit Card</option>
                        <option value="PayPal">PayPal</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <h2>Order Summary</h2>
                <div className="card Dark-Color border-main">
                  <div className="card-body">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Subtotal:</span>
                      <span>{Number(cart.totalPrice).toLocaleString()} EGP</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Shipping:</span>
                      <span>50 EGP</span>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                      <span>Tax:</span>
                      <span>{Number(cart.totalPrice * 0.14).toLocaleString()} EGP</span>
                    </div>
                    <hr className="border-main" />
                    <div className="d-flex justify-content-between mb-3">
                      <strong>Total:</strong>
                      <strong>
                        {Number(cart.totalPrice + 50 + cart.totalPrice * 0.14).toLocaleString()} EGP
                      </strong>
                    </div>
                    <button
                      className="btn bg-main text-white w-100"
                      onClick={placeOrderHandler}
                      disabled={loading}
                    >
                      {loading ? 'Processing...' : 'Place Order'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }