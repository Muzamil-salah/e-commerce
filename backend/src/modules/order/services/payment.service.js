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

// Create PayPal payment
export const createPayPalPayment = async (req, res) => {
  try {
    
    const orderId = req.params.id;
    console.log(req.user);
    
    console.log(orderId);
    
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

    const createPayment = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal'
      },
      redirect_urls: {
        return_url: `${process.env.FRONTEND_URL}/Home`,
        cancel_url: `${process.env.FRONTEND_URL}/placeorder`
      },
      transactions: [{
        amount: {
          currency: 'USD', //changed it from USD///////////////////////
          total: parseFloat(order.totalPrice).toFixed(2)
        },
        description: `Payment for order ${order._id}`,
        custom: order._id.toString()
      }]
    };

    return new Promise((resolve, reject) => {
      paypal.payment.create(createPayment, (error, payment) => {
        if (error) {
          console.error(error);
          return res.status(400).json({ status: 'fail', message: 'PayPal payment creation failed', error: error.message });
        }

        // Find the approval URL in the payment links
        const approvalUrl = payment.links.find(link => link.rel === 'approval_url').href;
        
        return res.status(200).json({ 
          status: 'success', 
          approvalUrl,
          paymentId: payment.id
        });
      });
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'fail', message: 'PayPal payment creation failed', error: error.message });
  }
};

// Verify PayPal payment
export const verifyPayPalPayment = async (req, res) => {
  try {
    const { paymentId, payerId } = req.query;
    const { orderId } = req.params;

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

        // Update order
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
          id: payment.id,
          status: payment.state,
          update_time: payment.update_time,
          email_address: payment.payer.payer_info.email
        };
        order.status = 'Processing';
        
        await order.save();

        return res.redirect(`${process.env.FRONTEND_URL}/order/${orderId}?payment=success`);
      });
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'fail', message: 'PayPal payment verification failed', error: error.message });
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