
import Cart from "../../../DB/models/Cart.model.js";
import jwt from 'jsonwebtoken';

const getCartItems = async (req, res, next) => {
    try {
        const userId = req.user._id;
        console.log(userId);
        
        const cart = await Cart.findOne({ user: userId })
            .populate('items.product', 'name price images countInStock');
        console.log("cart : ",cart);
        
        if (!cart || cart.items.length === 0) {
            return res.status(404).json({
                status: "fail",
                message:'cart have no items'
            });
        }

        const totalPrice = cart.items.reduce((acc, item) => 
            acc + (item.quantity * item.product.price), 0);

        console.log("totalPrice : "+totalPrice);
        
        return res.status(200).json({
            status: 'success',
            cartItems: cart.items,
            length: cart.items.length,
            totalPrice
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
}

export default getCartItems;