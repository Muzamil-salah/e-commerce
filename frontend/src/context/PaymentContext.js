import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Process payment (navigation will be handled by components)
  const processPayment = async (orderId, paymentMethod, paymentData) => {
    try {
      setLoading(true);
      const { data } = await axios.post('/api/order/payment/process', {
        orderId,
        paymentMethod,
        ...paymentData
      });
      return data;
    } catch (error) {
      setError(error.response?.data?.message || 'Payment failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  //Create PayPal payment
  // const createPayPalPayment = async (id) => {
  //   try {
  //     console.log('im in createPayPalPayment function in payment context');
      
  //     setLoading(true);
  //     const response  = await axios.post(`http://localhost:8000/api/v1/order/payment/paypal/create/${id}`,{},{
  //                   headers:{
  //                     authorization:`Bearer ${Cookies.get('token')}`,
  //                   }
  //               }).then(({data})=>data).catch(err => err)
  //                   console.log(response);
       
  //   if (response.data.approvalUrl) {
  //      Cookies.set('paymentId', response.data.paymentId);
  //      let paymentId=Cookies.get('paymentId')
  //      console.log('paymentId :  '+paymentId);
       
      
  //     window.location.href = response.data.approvalUrl;

  //   } else {
  //     throw new Error('No approval URL received');
  //   }

      
  //     return response.data;
  //   } catch (error) {
  //     console.log(error.response?.data);
      
  //     setError(error.response?.data?.message || 'PayPal payment creation failed');
  //     throw error;
  //   } finally {
  //     setLoading(false);
  //   }
  // };

   async function createPayPalPayment(id) {
  try {
    Cookies.set('orderId' ,id)
    const response = await axios.post(
      `http://localhost:8000/api/v1/order/payment/paypal/create/${id}`,
      {}, // empty body since we're using URL params
      {
        headers: {
          'Authorization': `Bearer ${Cookies.get('token')}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log(response);
    
    
    if (response.data.approvalUrl) {
       Cookies.set('paymentId', response.data.paymentId);
       let paymentId=Cookies.get('paymentId')
       console.log('paymentId :  '+paymentId);
       
      
      window.location.href = response.data.approvalUrl;
    } else {
      throw new Error('No approval URL received');
    }
    return response.data;
  } catch (error) {
    console.error('PayPal payment error:', error.response?.data || error.message);
    throw error;
  }
}

async function verifyPayPalPayment(orderId) {
  try {
    let paymentId=Cookies.get('paymentId')
    const response = await axios.get(
      `http://localhost:8000/api/v1/order/payment/paypal/verify/${orderId}`,
      {
        params: { paymentId },
        headers: {
          'Authorization': `Bearer ${Cookies.get('token')}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log(response);
    return response.data;
  } catch (error) {
    console.error('PayPal payment error:', error.response?.data || error.message);
    throw error;
  }
}
let [isPaymentCreated , setIsPaymentCreated]=useState()
  return (
    <PaymentContext.Provider
      value={{
        isPaymentCreated,
        setIsPaymentCreated,
        loading,
        error,
        processPayment,
        createPayPalPayment,
        verifyPayPalPayment
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => useContext(PaymentContext);