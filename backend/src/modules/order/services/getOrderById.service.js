import Order from "../../../DB/models/order.model.js";

const getByOrderId=async(req , res , next)=>{
    try {
        const user=req.user;
        const orderId=req.params.id;
        
        
        const order= await Order.findById(orderId).populate('user' ,'_id name ').populate('orderItems.product' , '_id name images price')
        if(!order){
            return res.status(404).json({status:'fail' , message:'order not found'})
        }
        
        // if(order.user._id.toString() !== req.user._id.toString()){
        //     return res.status(401).json({status:'fail' , message:'not authorized'})
        // }
    
        return res.status(200).json({status:'success' , order})
    } catch (error) {
        return res.status(500).json({status:'fail' , message:error.message})
    }
}

export default getByOrderId