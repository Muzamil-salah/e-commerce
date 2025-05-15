import { Router } from "express";
import { authorization , authentication } from "../../middleware/auth.middleware.js";
import { endpoint } from "../user/user.endpoint.js";
import addReview from "./services/addReview.service.js";
const router= Router()

router.post('/add/:productId' , authentication() , addReview)




export default router