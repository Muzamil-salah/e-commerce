
import Cart from "../../../DB/models/Cart.model.js";
import jwt from 'jsonwebtoken';

const getCartItems = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const cart = await Cart.findOne({ user: userId })
            .populate('items.product', 'name price images countInStock');
        
        if (!cart || cart.items.length === 0) {
            return res.status(200).json({
                status: "success",
                cartItems: [],
                length: 0,
                totalPrice: 0
            });
        }

        const totalPrice = cart.items.reduce((acc, item) => 
            acc + (item.quantity * item.product.price), 0);

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