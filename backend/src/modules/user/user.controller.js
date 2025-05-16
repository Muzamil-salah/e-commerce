import { Router } from "express";
import { authentication , authorization  } from "../../middleware/auth.middleware.js";
// import { endpoint } from "./user.endpoint.js";
import signup  from "./services/signup.service.js";
import login from "./services/login.service.js";
import updateProfile from "./services/updateProfile.service.js";
import getProfileData from "./services/getProfileData.service.js";
import changePassword from "./services/changePassword.service.js";


const router=Router();
router.post('/register' , signup)
router.post('/login' , login)
router.put('/update',authentication() , updateProfile)
router.get('/profile',authentication() , getProfileData)
router.put('/password',authentication() , changePassword)
export default router;