
import Cart from "../../../DB/models/Cart.model.js";
import jwt from 'jsonwebtoken';

const resetCart = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        const [Bearer, token] = authorization.split(" ") || [];
        
        let signature;
        switch (Bearer) {
            case 'admin': signature = process.env.TOKEN_SIGNATURE_ADMIN; break;
            case 'Bearer': signature = process.env.TOKEN_SIGNATURE; break;
            default: return res.status(400).json({ message: 'Invalid token type' });
        }

        const decoded = jwt.decode(token, signature);
        const userId = decoded.id;

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