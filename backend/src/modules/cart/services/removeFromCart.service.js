
import Cart from "../../../DB/models/Cart.model.js";
import jwt from 'jsonwebtoken';

const deleteFromCart = async (req, res, next) => {
    try {
        const productId = req.params.id;
        const { authorization } = req.headers;
        const [Bearer, token] = authorization.split(" ") || [];
        
        if (!Bearer || !token) {
            return res.status(400).json({ message: 'Invalid token components' });
        }

        let signature;
        switch (Bearer) {
            case 'admin': signature = process.env.TOKEN_SIGNATURE_ADMIN; break;
            case 'Bearer': signature = process.env.TOKEN_SIGNATURE; break;
            default: return res.status(400).json({ message: 'Invalid token type' });
        }

        const decoded = jwt.decode(token, signature);
        const userId = decoded.id;

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