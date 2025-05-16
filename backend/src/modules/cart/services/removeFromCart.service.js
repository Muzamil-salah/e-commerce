
import Cart from "../../../DB/models/Cart.model.js";
import jwt from 'jsonwebtoken';

const deleteFromCart = async (req, res, next) => {
    try {
        const productId = req.params.id;
        const userId =req.user._id;

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({
                status: 'fail',
                message: 'Cart not found'
            });
        }

        const initialLength = cart.items.length;
        cart.items = cart.items.filter(item => 
            item.product.toString() !== productId
        );

        if (cart.items.length === initialLength) {
            return res.status(404).json({
                status: 'fail',
                message: 'Product not found in cart'
            });
        }

        await cart.save();
        const updatedCart = await Cart.findOne({ user: userId })
            .populate('items.product', 'name price images countInStock');
        
        const totalPrice = updatedCart.items.reduce((acc, item) => 
            acc + (item.quantity * item.product.price), 0);

        return res.status(200).json({
            status: 'success',
            cartItems: updatedCart.items,
            length: updatedCart.items.length,
            totalPrice
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
}

export default deleteFromCart;