import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

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
  const createPayPalPayment = async (orderId) => {
    try {
      setLoading(true);
      const { data } = await axios.post('http://localhost:8000/api/order/payment/paypal/create', { orderId });
      return data;
    } catch (error) {
      setError(error.response?.data?.message || 'PayPal payment creation failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <PaymentContext.Provider
      value={{
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