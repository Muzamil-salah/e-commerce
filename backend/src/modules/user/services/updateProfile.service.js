import User from "../../../DB/models/User.model.js";
import jwt from 'jsonwebtoken'
const updateProfile= async(req , res , next)=>{
    try {
        const {name , email} = req.body;
            const userId=req.user._id;
                const updatedUser= await User.findByIdAndUpdate(userId ,{name , email})
                console.log(updatedUser);
                
                if(!updatedUser){
                    return res.status(404).json({message:'user not found' , status:'fail'})
                }

                return res.status(200).json({status:'success' , message:'user updated successfully'})
    } catch (error) {
        return res.status(500).json({message:'server error' , error})
    }
}

export default updateProfile