import Order from '../../../DB/models/order.model.js';
import Cart from '../../../DB/models/Cart.model.js';

 const getOrderPrices = async (req, res) => {
  try {

    const user=req.user;
    const cart= await Cart.findOne({user:user}).select('items _id').populate({
    path: 'items.product',
    select: 'price' 
  });

    let orderItems=cart.items
    console.log(cart);
    const itemsPrice = orderItems.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);
    
    const taxPrice = itemsPrice * 0.15;
    const shippingPrice = itemsPrice > 1000 ? 25 : 50;
    const totalPrice = itemsPrice + taxPrice + shippingPrice;

   return res.status(201).json({status:'success',subtotal:itemsPrice , shippingPrice , taxPrice ,totalPrice});
  } catch (error) {
   return res.status(500).json({status:'fail', error: error.message });
  }
};


export default getOrderPrices