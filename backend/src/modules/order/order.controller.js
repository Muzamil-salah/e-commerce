import { Router } from "express";
import createOrder from "./services/createOrder.service.js";
import { protect } from "../../middleware/order.middleware.js";
import { authentication , authorization } from "../../middleware/auth.middleware.js";
import getOrderById from "./services/getById.service.js";
import getOrderPrices from "./services/getOrderPrices.service.js";
import getByOrderId from "./services/getOrderById.service.js";
import { 
  processPayment, 
  createPayPalPayment, 
  verifyPayPalPayment,
  createStripePaymentIntent
} from "./services/payment.service.js";
import { endpoint } from "../user/user.endpoint.js";
const router= Router();

router.post('/add' ,authentication(), createOrder)
router.get('/getById' , authentication() , getOrderById)  
router.get('/getPrices' , authentication(),getOrderPrices)
router.get('/:id' , authentication(),getByOrderId)
router.post('/payment/process', authentication(), processPayment);
router.post('/payment/paypal/create', authentication(), createPayPalPayment);
router.get('/payment/paypal/verify/:orderId', authentication(), verifyPayPalPayment);
router.post('/payment/stripe/create-intent', authentication(), createStripePaymentIntent);




export default router;