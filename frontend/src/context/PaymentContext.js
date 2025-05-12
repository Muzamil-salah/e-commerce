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

  // Create PayPal payment
  // const createPayPalPayment = async (orderId) => {
  //   try {
  //     console.log('im in createPayPalPayment function in payment context');
      
  //     setLoading(true);
  //     const { data } = await axios.post(`http://localhost:8000/api/v1/order/payment/paypal/create/${orderId}`,{
  //                   headers:{
  //                     authorization:`Bearer ${Cookies.get('token')}`,
  //                   }
  //               }).then(({data})=>data).catch(err => err)
      
  //     return data;
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
    
    if (response.data.approvalUrl) {
      setUrl(response.data.approvalUrl)
      console.log(response.data.approvalUrl);
      
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
let [approvalUrl , setUrl]=useState('');
  return (
    <PaymentContext.Provider
      value={{
        approvalUrl,
        setUrl,
        loading,
        error,
        processPayment,
        createPayPalPayment,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => useContext(PaymentContext);