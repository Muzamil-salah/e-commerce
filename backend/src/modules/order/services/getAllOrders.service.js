import Order from "../../../DB/models/order.model.js";

const getAllOrders=async(req , res , next)=>{
    try {
        console.log('i entered');
        
    const orders= await Order.find().populate('user' ,'_id name')
    if(!orders){
        console.log('no orders found');
        
        return res.status(404).json({status:'fail' , message:'no labs found'})
    }
    console.log(orders);
    
    return res.status(200).json({status:'success' , orders , length:orders.length})
} catch (error) {
    return res.status(500).json({status:'fail' , message:error.message})
}
}


export default getAllOrders