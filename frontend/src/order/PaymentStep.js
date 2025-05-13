
import React, { useState } from 'react';
import { usePayment } from '../context/PaymentContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const PaymentStep = ({ order, paymentMethod }) => {
  const { processPayment, createPayPalPayment ,verifyPayPalPayment ,isPaymentCreated,setIsPaymentCreated,} = usePayment();
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  

  const handleSuccess = () => {
    toast.success('Payment successful!');
    navigate(`/order/${order._id}`);
  };

  const handleCreditCardPayment = async (event) => {
    event.preventDefault();
    setIsProcessing(true);
    
    try {
      const mockPaymentId = `mock_payment_${Date.now()}`;
      await processPayment(order._id, 'CreditCard', { paymentId: mockPaymentId });
      handleSuccess();
    } catch (error) {
      toast.error(error.message || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayPalPayment = async () => {
    setIsProcessing(true);
    
    try {
      const data = await createPayPalPayment(order._id);
      console.log(data);
      
      if(data.status=='success'){
        // handleSuccess();
        console.log('suucceesssssssssss');
        
        // setIsPaymentCreated(true)
      }
      // window.location.href = approvalUrl;
    } catch (error) {
      // toast.error(error.message || 'PayPal payment failed');
      setIsProcessing(false);
    }
    // const verifyPayment= await verifyPayPalPayment(order._id)
    // console.log(verifyPayment);
    
  };

    const handlePayPalVerification= async () => {
    try {
      const data = await verifyPayPalPayment(order._id);
      console.log(data);
      
      // if(data.status=='success'){
      //   console.log('successsss');
      // }
      // window.location.href = approvalUrl;
    } catch (error) {
      // toast.error(error.message || 'PayPal payment failed');
    }
    // const verifyPayment= await verifyPayPalPayment(order._id)
    // console.log(verifyPayment);
    
  };
  if(isPaymentCreated){
    console.log('paymeeent done!!!!!!!!!');
    handlePayPalVerification()
  }


  const handleCashOnDelivery = async () => {
    setIsProcessing(true);
    try {
      await processPayment(order._id, 'CashOnDelivery', {});
      handleSuccess();
    } catch (error) {
      toast.error(error.message || 'Order confirmation failed');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!order) {
    return <div className="alert alert-danger">Order information not available</div>;
  }

  return (
    <div className="mt-4">
      <h4 className="mb-3">Complete Payment</h4>
      
      {paymentMethod === 'CreditCard' && (
        <div className="card p-3 mb-3">
          <form onSubmit={handleCreditCardPayment}>
            <div className="mb-3">
              <label className="form-label">Card Number</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="1234 5678 9012 3456" 
                required 
              />
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Expiration Date</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="MM/YY" 
                  required 
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">CVC</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="123" 
                  required 
                />
              </div>
            </div>
            <button 
              type="submit" 
              className="btn bg-main text-white w-100" 
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : `Pay $${order.totalPrice.toFixed(2)}`}
            </button>
          </form>
        </div>
      )}

      {paymentMethod === 'PayPal' && (
        <div>
          <button 
            onClick={handlePayPalPayment} 
            className="btn bg-main text-white w-100"
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : `Pay with PayPal $${order.totalPrice.toFixed(2)}`}
          </button>
        </div>
      )}

      {paymentMethod === 'CashOnDelivery' && (
        <div className="alert alert-info">
          You selected Cash on Delivery. No payment is required now.
          <button 
            className="btn bg-main text-white w-100 mt-2"
            onClick={handleCashOnDelivery}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Confirm Order'}
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentStep;