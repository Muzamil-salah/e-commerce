// import Order from "../../../DB/models/order.model.js";
// import Product from "../../../DB/models/Product.model.js";
// import getCartItems from "../../cart/services/getCartItems.service.js";

// const createOrder = async (req, res, next) => {
//   try {
//     const { 
//       shippingAddress, 
//       paymentMethod, 
//       itemsPrice, 
//       taxPrice, 
//       shippingPrice, 
//       totalPrice 
//     } = req.body;

//     // Get cart items using the service function properly
//     const { cartItems, error } = await getCartItems(req, res);
//     if (error) {
//       return res.status(400).json({ message: error });
//     }

//     // Verify products and prepare order items
//     const orderItems = await Promise.all(cartItems.map(async cartItem => {
//       const product = await Product.findById(cartItem.product._id);
//       if (!product) {
//         throw new Error(`Product ${cartItem.product._id} not found`);
//       }
      
//       // Verify stock availability
//       if (product.countInStock < cartItem.quantity) {
//         throw new Error(`Not enough stock for ${product.name}`);
//       }

//       return {
//         product: {
//           _id: product._id,
//           name: product.name,
//           price: product.price,
//           images: product.images,
//           countInStock: product.countInStock
//         },
//         quantity: cartItem.quantity
//       };
//     }));

//     // Create order
//     const order = new Order({
//       user: req.user._id,
//       orderItems,
//       shippingAddress,
//       paymentMethod,
//       itemsPrice,
//       taxPrice,
//       shippingPrice,
//       totalPrice
//     });

//     // Save order and reduce stock
//     const createdOrder = await order.save();
//     await Promise.all(orderItems.map(item => 
//       Product.updateOne(
//         { _id: item.product._id },
//         { $inc: { countInStock: -item.quantity } }
//       )
//     );

//     res.status(201).json(createdOrder);

//   } catch (error) {
//     res.status(400).json({ 
//       message: error.message,
//       error: error.stack 
//     });
//   }
// }

// export default createOrder;



import Order from "../../../DB/models/order.model.js";
import Product from "../../../DB/models/Product.model.js";
import Cart from "../../../DB/models/Cart.model.js";
import getCartItems from "../../cart/services/getCartItems.service.js";

const createOrder= async(req , res , next)=>{
    try {
        const { 
            cartItems, 
            shippingAddress, 
            paymentMethod, 
            itemsPrice, 
            taxPrice, 
            shippingPrice
          } = req.body;
          
          const orderItems = await Promise.all(cartItems.map(async cartItem => {
            console.log(orderItems);
              const product = await Product.findById(cartItem.product._id);
              if (!product) {
                  throw new Error(`Product ${cartItem.product._id} not found`);
                }
                
                // Verify stock availability
                if (product.countInStock < cartItem.quantity) {
                    return res.status(404).json({status:'fail',message:`Not enough stock for ${product.name}`})
                }
                console.log('im hereeeeeeeeeeeeeeee');
      
            return {
              product: {
                _id: product._id,
                name: product.name,
                price: product.price,
                images: product.images,
                countInStock: product.countInStock
              },
              quantity: cartItem.quantity
            };
          }));

         const {totalPrice}= await getCartItems(req , res);
         console.log(totalPrice);
         
          const order = new Order({
            user: req.user._id,
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
          });

          const createdOrder = await order.save();
    await Promise.all(orderItems.map(item => 
      Product.updateOne(
        { _id: item.product._id },
        { $inc: { countInStock: -item.quantity } }
      )
    ));

    res.status(201).json(createdOrder);

    } catch (error) {
        res.status(400).json({ 
            message:'server error',
            error: error.message 
          });
    }
}

export default createOrder