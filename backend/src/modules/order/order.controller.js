import { Router } from "express";
import createOrder from "./services/createOrder.service.js";
import { protect } from "../../middleware/order.middleware.js";
import { authentication , authorization } from "../../middleware/auth.middleware.js";
import getOrderById from "./services/getById.service.js";
import getOrderPrices from "./services/getOrderPrices.service.js";
import getByOrderId from "./services/getOrderById.service.js";
import { endpoint } from "../user/user.endpoint.js";
const router= Router();

router.post('/add' ,authentication(), createOrder)
router.get('/getById' , authentication() , getOrderById)  
router.get('/getPrices' , authentication(),getOrderPrices)
router.get('/:id' , authentication(),getByOrderId)




export default router;