import Order from "../../../DB/models/order.model.js";

const deleteOrder=async(req , res , next)=>{
    try {
        const orderId=req.params.orderId;
        const order= await Order.findByIdAndDelete(orderId , {new:true})
        if(!order){
            return res.status(404).json({status:'fail' , message:'order not found'})
        }
        return res.status(200).json({status:'success' , order})
    } catch (error) {
        return res.status(500).json({status:'fail' , message:error.message})
    }
}


export default deleteOrder