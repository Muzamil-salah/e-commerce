
import Cart from "../../../DB/models/Cart.model.js";
import jwt from 'jsonwebtoken';

const getCartItems = async (req, res, next) => {
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