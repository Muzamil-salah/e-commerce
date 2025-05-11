import { Router } from "express";
import createOrder from "./services/createOrder.service.js";
import { protect } from "../../middleware/order.middleware.js";

const router= Router();

router.post('/add' ,protect, createOrder)




export default router;