
import Cart from "../../../DB/models/Cart.model.js";
import jwt from 'jsonwebtoken';

const resetCart = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const cart = await Cart.findOneAndUpdate(
            { user: userId },
            { items: [] },
            { new: true }
        );

        if (!cart) {
            return res.status(200).json({
                status: 'success',
                message: 'Cart was already empty',
                totalPrice: 0
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Cart cleared successfully',
            totalPrice: 0
        });

    } catch (error) {
        return res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
}

export default resetCart;