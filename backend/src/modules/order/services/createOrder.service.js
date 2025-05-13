
// import Order from "../../../DB/models/order.model.js";
// import Product from "../../../DB/models/Product.model.js";
// import Cart from "../../../DB/models/Cart.model.js";
// import getCartItems from "../../cart/services/getCartItems.service.js";

// const createOrder= async(req , res , next)=>{
//     try {
//         const { 
//             cartItems, 
//             shippingAddress, 
//             paymentMethod, 
//             itemsPrice, 
//             taxPrice, 
//             shippingPrice
//           } = req.body;
          
//           const orderItems = await Promise.all(cartItems.map(async cartItem => {
//             console.log(orderItems);
//               const product = await Product.findById(cartItem.product._id);
//               if (!product) {
//                   throw new Error(`Product ${cartItem.product._id} not found`);
//                 }
                
//                 // Verify stock availability
//                 if (product.countInStock < cartItem.quantity) {
//                     return res.status(404).json({status:'fail',message:`Not enough stock for ${product.name}`})
//                 }
//                 console.log('im hereeeeeeeeeeeeeeee');
      
//             return {
//               product: {
//                 _id: product._id,
//                 name: product.name,
//                 price: product.price,
//                 images: product.images,
//                 countInStock: product.countInStock
//               },
//               quantity: cartItem.quantity
//             };
//           }));

//          const {totalPrice}= await getCartItems(req , res);
//          console.log(totalPrice);
         
//           const order = new Order({
//             user: req.user._id,
//             orderItems,
//             shippingAddress,
//             paymentMethod,
//             itemsPrice,
//             taxPrice,
//             shippingPrice,
//             totalPrice
//           });

//           const createdOrder = await order.save();
//     await Promise.all(orderItems.map(item => 
//       Product.updateOne(
//         { _id: item.product._id },
//         { $inc: { countInStock: -item.quantity } }
//       )
//     ));

//     res.status(201).json(createdOrder);

//     } catch (error) {
//         res.status(400).json({ 
//             message:'server error',
//             error: error.message 
//           });
//     }
// }

// export default createOrder




import Order from '../../../DB/models/order.model.js';
import Cart from '../../../DB/models/Cart.model.js';

 const createOrder = async (req, res) => {
  try {

    const user=req.user;
    const cart= await Cart.findOne({user:user}).select('items _id').populate({
    path: 'items.product',
    select: 'price' // Only get the price field from Product
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

    

    // const createdOrder = await order.save();
    // console.log('createOrder : '+createdOrder);
    
    // await Cart.findOneAndDelete({user:user})
   return res.status(201).json({status:'success',createdOrder:order});
  } catch (error) {
    console.log('im here');
    console.log(error.message );
    
    
   return res.status(500).json({status:'fail', error: error.message });
  }
};


export default createOrder