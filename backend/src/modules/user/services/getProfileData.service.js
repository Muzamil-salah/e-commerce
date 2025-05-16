import User from "../../../DB/models/User.model.js";
import jwt from 'jsonwebtoken'
const getProfileData= async (req , res , next)=>{
    try {
                    const userId=req.user._id;
                    
                    const userData= await User.findById(userId)
                    if(!userData){
                        return res.status(404).json({message:'user not found' , status:'fail'})

                    }

                    return res.status(200).json({status:'success' , userData})
    } catch (error) {
        return res.status(500).json({message:'server error' , error})
    }
}

export default getProfileData