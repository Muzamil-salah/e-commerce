import React, { useContext, useState, useEffect } from 'react';
import { storeContext } from '../context/storeContext';
import { orderContext } from '../context/OrderContext.js';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

export default function PlaceOrder() {
  let [subPrice , setSubtotal]=useState(0)
   let [shipping , setShipping]=useState(0)
   let [tax , setTax]=useState(0)
    let [total , setTotal]=useState(0)
 
  const { getCart, deleteCart, cartItems, setCartItems } = useContext(storeContext);
  const { createOrder, getOrderById, orders, setOrders, loading, setLoading, error, setError, getOrderPrices } = useContext(orderContext)
  const navigate = useNavigate();
  const [shippingAddress, setshippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    phone: '',
    country: '',
    // paymentMethod: 'CashOnDelivery'
  });
  const [paymentMethod, setPaymentMethod] = useState('CashOnDelivery')

  async function getPrevValues() {
    let data = await getCart()
    setCartItems(data.cartItems)
    console.log(data);
    console.log(cartItems);

    const { subtotal, shippingPrice, taxPrice ,totalPrice} = await getOrderPrices()
    setSubtotal(subtotal)
    setShipping(shippingPrice)
    setTax(taxPrice)
    setTotal(totalPrice)
    console.log(subtotal + '  ' + shippingPrice + '  ' + taxPrice +'  '+totalPrice);


  }
  useEffect(() => {
    // هنا بتحطي الفانكشن اللي تشتغل مرة واحدة بس
    getPrevValues()




  }, []);

  const handleChange = (e) => {
  setshippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
};
  const handlePaymentMethodChange = (e) => {
  setPaymentMethod(e.target.value);
};

  const placeOrderHandler = async () => {
   console.log("Submitting:", { shippingAddress, paymentMethod });
    
    setLoading(true);
    try {
      const orderData = {
        shippingAddress,
        paymentMethod
      };

      const data = await createOrder(orderData);
 console.log(data);
 

      if (data.status === 'success') {
        console.log('im succccessssssssss');
        
        await deleteCart();
        toast.success('Order placed successfully!');
        navigate(`/order/${data.createdOrder._id}`);
      }
      else{
        toast.warning('please enter valid data!!');
      }
    } catch (error) {
      console.log(error);
      
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="Dark-Color text-white py-5 text-center">
        <h3 className=' py-5'>Your cart is empty</h3>
        <Link to="/products" className="btn bg-main text-white mt-3">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="Dark-Color text-white py-5 ">
      <div className="container pt-5">
        <div className="row">
          <div className="col-md-8">
            <h2>Shipping Information</h2>
            <div className="card Dark-Color border-main mb-4">
              <div className="card-body text-white">
                <div className="form-group mb-3">
                  <label>Address</label>
                  <input
                    type="text"
                    className="form-control Gray-Color text-black"
                    name="address"
                    value={shippingAddress.address}
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
                        className="form-control Gray-Color text-black"
                        name="city"
                        value={shippingAddress.city}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group mb-3">
                      <label>country</label>
                      <input
                        type="text"
                        className="form-control Gray-Color text-black"
                        name="country"
                        value={shippingAddress.country}
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
                        className="form-control Gray-Color text-black"
                        name="postalCode"
                        value={shippingAddress.postalCode}
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
                    className="form-control Gray-Color text-black"
                    name="phone"
                    value={shippingAddress.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group mb-3">
                  <label>Payment Method</label>
                  <select
                    className="form-control Gray-Color"
                    name="paymentMethod"
                    value={paymentMethod}
                    onChange={handlePaymentMethodChange}
                  >
                    <option value="CashOnDelivery">Cash on Delivery</option>
                    <option value="PayPal">PayPal</option>
                  </select>
                </div>
                <div>
                    <Link 
                  to="/cart" 
                  className={`btn text-white bg-main mt-3 mb-3 me-3  `}
                >
                  Cancel
                </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4 text-white">
            <h2>Order Summary</h2>
            <div className="card Dark-Color border-main">
              <div className="card-body text-white">
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <span> {Number(subPrice).toLocaleString()} EGP</span>
                  {/* <span>{Number(cart.totalPrice).toLocaleString()} EGP</span> */}
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping:</span>
                  <span> {Number(shipping).toLocaleString()} EGP</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Tax:</span>
                  <span> {Number(tax).toLocaleString()} EGP</span>
                  {/* <span>{Number(cart.totalPrice * 0.14).toLocaleString()} EGP</span> */}
                </div>
                <hr className="border-main" />
                <div className="d-flex justify-content-between mb-3">
                  <strong>Total:</strong>
                  <strong>
                    {Number(total).toLocaleString()} EGP
                    {/* {Number(cart.totalPrice + 50 + cart.totalPrice * 0.14).toLocaleString()} EGP */}
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