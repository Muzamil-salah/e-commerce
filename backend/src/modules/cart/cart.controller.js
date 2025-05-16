import { Router } from "express";
import addToCart from "./services/addToCart.service.js";
import getCartItems from "./services/getCartItems.service.js";
import deleteFromCart from "./services/removeFromCart.service.js";
import resetCart from "./services/resetCart.service.js";
import updateQuantity from "./services/updateQuantity.service.js";
import { authentication } from "../../middleware/auth.middleware.js";
const router=Router();

router.post('/add/:id',authentication() ,addToCart );
router.get('/all', authentication(), getCartItems )
router.delete('/delete/:id' , authentication() , deleteFromCart)
router.delete('/reset',authentication() , resetCart)
router.put('/update/:id',authentication() , updateQuantity)

export default router;