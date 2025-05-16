
import Order from '../../../DB/models/order.model.js';
import Cart from '../../../DB/models/Cart.model.js';

 const createOrder = async (req, res) => {
  try {

    const user=req.user;
    const cart= await Cart.findOne({user:user}).select('items _id').populate({
    path: 'items.product',
    select: 'price'
  });

    let orderItems=cart.items
  
    const itemsPrice = orderItems.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);

    const {  shippingAddress, paymentMethod } = req.body;

    if (orderItems && orderItems.length === 0) {
     return res.status(400).json({status:'fail' , message:'no items found in cart'})
    }

    const taxPrice = itemsPrice * 0.15;
    const shippingPrice = itemsPrice > 1000 ?  25 : 50;
    const totalPrice = itemsPrice + taxPrice + shippingPrice;

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

   return res.status(201).json({status:'success',createdOrder:order});
  } catch (error) {
    console.log('im here');
    console.log(error.message );
    
    
   return res.status(500).json({status:'fail', error: error.message });
  }
};


export default createOrder