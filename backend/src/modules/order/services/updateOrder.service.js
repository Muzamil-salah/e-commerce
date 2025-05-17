import Order from "../../../DB/models/order.model.js";
import Product from "../../../DB/models/Product.model.js";
const updateOrder=async(req , res , next)=>{
    try {
        
        const updates = req.body;
        const { isPaid ,isDelivered } = req.body;
        const orderId=req.params.orderId;

        const orderToUpdate= await Order.findById(orderId)
    
        console.log(orderToUpdate.orderItems);
        if(!orderToUpdate){
            return res.status(404).json({status:'fail' , message:'order not found'})
        }
        if(isPaid){
            orderToUpdate.paidAt=Date.now()
            orderToUpdate.orderItems.forEach(async (item) => {
            let product= await Product.findById(item.product)
          let updatedProduct=  await Product.findByIdAndUpdate(product._id , {countInStock:product.countInStock-item.quantity} , {new:true})
        })
        }
        else if(isDelivered){
            orderToUpdate.deliveredAt=Date.now()
        }

        const validUpdates = Object.keys(updates).reduce((acc, key) => {
            acc[key] = updates[key];
            if(updates.isPaid){
                acc["paidAt"]=Date.now()
            }
            if(updates.isDelivered){
                acc["deliveredAt"]=Date.now()
            }
            
            return acc;
    }, {});
    console.log(validUpdates);
  let orderAfterUpdates= await Order.findByIdAndUpdate(orderId , validUpdates)
    

    res.status(200).json({ status: 'success', data: orderAfterUpdates });

    } catch (error) {
        return res.status(500).json({status:'fail' , message:error.message})
    }
}
export default updateOrder