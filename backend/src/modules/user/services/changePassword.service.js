import User from "../../../DB/models/User.model.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt';
const changePassword = async (req, res, next) => {
    try {
        const {currentPassword , newPassword , confirmPassword} = req.body;
        const { authorization } = req.headers;
        const [Bearer, token] = authorization.split(" ") || []
        let signature = undefined;
        switch (Bearer) {
            case 'admin': signature = process.env.TOKEN_SIGNATURE_ADMIN;
                break;
            case 'Bearer': signature = process.env.TOKEN_SIGNATURE
                break;
            default:
                break
        }
        const decoded = jwt.decode(token, signature);
        const userId = decoded.id;
        const searchUser= await User.findById(userId)
        if(!searchUser){
            return res.status(404).json({message:'user not found ' , status:'fail'})
        }
        const match=bcrypt.compareSync(currentPassword , searchUser.password)
        if(!match){
            return res.status(400).json({message:'old password is incorrect' , status:'fail'})
        }
        if(newPassword != confirmPassword){
            return res.status(400).json({message:"password doesn't match" , status:'fail'})
        }
         const hashPassword=bcrypt.hashSync(newPassword , parseInt(process.env.SALT));
        const updatedUser= await User.findByIdAndUpdate(userId , {password:hashPassword})
        if(!updatedUser){
            return res.status(404).json({message:'user not found' , status:'fail'})
        }
        return res.status(200).json({status:'success' , message:'password updated successfully!'})
        
        

    } catch (error) {
        return res.status(500).json({message:'server error', error})
    }
}

export default changePassword