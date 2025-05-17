import Order from "../../../DB/models/order.model.js";
 const getOrderById = async (req, res) => {
  try {
    const userId=req.user._id
    const order = await Order.find({user:userId})
      .populate('user', 'name email')
      .populate('orderItems.product', 'name images price');

    if (!order) {
     return res.status(404).json({status:'fail' , message:'order not found'})
    }
    order.forEach(item=>{
        if (item.user._id.toString() !== req.user._id.toString()) {
     return res.status(401).json({status:'fail' , message:'not authorized'})
    }
    })
   return res.status(200).json({status:'success',orders:order });
  } catch (error) {
    res.status(500).json({ status:'fail',error: error.message });
  }
};

export default getOrderById