import Stripe from 'stripe';
import paypal from 'paypal-rest-sdk';
import Order from '../../../DB/models/order.model.js';
import dotenv from 'dotenv';

dotenv.config();

// Configure Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Configure PayPal
paypal.configure({
  mode: process.env.PAYPAL_MODE || 'sandbox', // sandbox or live
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET
});

// Process Payment
export const processPayment = async (req, res) => {
  try {
    const { orderId, paymentMethod } = req.body;
    const order = await Order.findById(orderId).populate('user');

    if (!order) {
      return res.status(404).json({ status: 'fail', message: 'Order not found' });
    }

    if (order.user._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ status: 'fail', message: 'Not authorized' });
    }

    if (order.isPaid) {
      return res.status(400).json({ status: 'fail', message: 'Order is already paid' });
    }

    let paymentResult;

    if (paymentMethod === 'CreditCard') {
      // Process Stripe payment
      const { paymentId } = req.body;
      
      if (!paymentId) {
        return res.status(400).json({ status: 'fail', message: 'Payment ID is required' });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(order.totalPrice * 100), // Convert to cents
        currency: 'usd',
        payment_method: paymentId,
        confirm: true,
        description: `Payment for order ${order._id}`,
        metadata: { orderId: order._id.toString() }
      });

      if (paymentIntent.status !== 'succeeded') {
        return res.status(400).json({ status: 'fail', message: 'Payment failed' });
      }

      paymentResult = {
        id: paymentIntent.id,
        status: paymentIntent.status,
        update_time: new Date().toISOString(),
        email_address: order.user.email
      };
    } else if (paymentMethod === 'PayPal') {
      // Process PayPal payment
      const { paymentId, payerId } = req.body;
      
      if (!paymentId || !payerId) {
        return res.status(400).json({ status: 'fail', message: 'Payment ID and Payer ID are required' });
      }

      const executePayment = {
        payer_id: payerId,
        transactions: [{
          amount: {
            currency: 'USD',
            total: order.totalPrice.toFixed(2)
          }
        }]
      };

      return new Promise((resolve, reject) => {
        paypal.payment.execute(paymentId, executePayment, async (error, payment) => {
          if (error) {
            console.error(error);
            return res.status(400).json({ status: 'fail', message: 'PayPal payment failed', error: error.response.details });
          }

          if (payment.state !== 'approved') {
            return res.status(400).json({ status: 'fail', message: 'PayPal payment not approved' });
          }

          paymentResult = {
            id: payment.id,
            status: payment.state,
            update_time: payment.update_time,
            email_address: payment.payer.payer_info.email
          };

          // Update order
          order.isPaid = true;
          order.paidAt = Date.now();
          order.paymentResult = paymentResult;
          order.status = 'Processing';
          
          await order.save();

          return res.status(200).json({ 
            status: 'success', 
            message: 'Payment successful',
            order
          });
        });
      });
    } else {
      return res.status(400).json({ status: 'fail', message: 'Invalid payment method' });
    }

    // Update order for Stripe payment
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = paymentResult;
    order.status = 'Processing';
    
    await order.save();

    return res.status(200).json({ 
      status: 'success', 
      message: 'Payment successful',
      order
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'fail', message: 'Payment processing failed', error: error.message });
  }
};

export const createPayPalPayment = async (req, res) => {
   try {
       const orderId = req.params.id;
    
    const order = await Order.findById(orderId)


    if (!order) {
      return res.status(404).json({ status: 'fail', message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ status: 'fail', message: 'Not authorized' });
    }

    if (order.isPaid) {
      return res.status(400).json({ status: 'fail', message: 'Order is already paid' });
    }

  const createPayment = {
    intent: 'sale',
    payer: {
      payment_method: 'paypal',
    },
    redirect_urls: {
      return_url: `${process.env.FRONTEND_URL}/Home?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/Home?success=false`,
    },
    transactions: [{
      amount: {
        currency: 'USD', // Must be USD for sandbox
        total: order.totalPrice.toFixed(2), // Total amount
        details: {
          subtotal: order.itemsPrice.toFixed(2), // Required
          shipping: order.shippingPrice.toFixed(2), // Required
          tax: order.taxPrice.toFixed(2), // Required
        },
      },
      description: `Order #${order._id}`,
      invoice_number: order._id.toString(), // Unique invoice ID
    }],
  };

  const payment = await new Promise((resolve, reject) => {
    paypal.payment.create(createPayment, (error, payment) => {
      if (error) {
        console.error('PayPal creation error:', error.response?.details);
        return reject(error);
      }
      resolve(payment);
    });
  });

  return res.status(201).json({status:'success' , paymentId: payment.id, approvalUrl:payment.links.find(l => l.rel === 'approval_url').href})
   } catch (error) {
     console.error(error);
    return res.status(500).json({ status: 'fail', message: 'PayPal payment creation failed', error: error.message });
   }
};

// Verify PayPal payment
export const verifyPayPalPayment = async (req, res) => {
  try {
    console.log('i entered here!!!!!');
    
     const { paymentId } = req.query;
    const  orderId  = req.params.orderId;
    const order = await Order.findById(orderId);
    if (!paymentId ) {
      return res.status(400).json({status:'fail' , message:'missing values'})
    }

    if (!order) {
      return res.status(404).json({ status: 'fail', message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ status: 'fail', message: 'Not authorized' });
    }

    if (order.isPaid) {
      return res.status(400).json({ status: 'fail', message: 'Order is already paid' });
    }


     // 2. Get payment details first
    const paymentDetails = await new Promise((resolve, reject) => {
      paypal.payment.get(paymentId, (err, payment) => {
        if (err) return reject(err);
        resolve(payment);
      });
    });
  if(paymentDetails.payer){
    return res.status(200).json({status:'success' , message:'paid'})
  }
  else{

    return res.status(200).json({status:'fail' , message:'not paid'})
  }
    
  } catch (error) {
    console.error('Full PayPal verification error:', {
      message: error.message,
      debug_id: error.response?.debug_id,
      details: error.response?.details
    });

    return res.status(400).json({
      status: 'fail',
      message: 'Payment verification failed',
      debug_id: error.response?.debug_id,
      error_details: error.response
    });
  }
};

// Create Stripe payment intent
export const createStripePaymentIntent = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ status: 'fail', message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ status: 'fail', message: 'Not authorized' });
    }

    if (order.isPaid) {
      return res.status(400).json({ status: 'fail', message: 'Order is already paid' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalPrice * 100), // Convert to cents
      currency: 'usd',
      metadata: { orderId: order._id.toString() }
    });

    return res.status(200).json({ 
      status: 'success', 
      clientSecret: paymentIntent.client_secret 
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'fail', message: 'Stripe payment intent creation failed', error: error.message });
  }
};