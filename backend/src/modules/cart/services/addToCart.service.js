

import Cart from "../../../DB/models/Cart.model.js";
import Product from "../../../DB/models/Product.model.js";
import jwt from 'jsonwebtoken';

const addToCart = async (req, res, next) => {
    try {
        const productId = req.params.id;
        const { authorization } = req.headers;
        const [Bearer, token] = authorization.split(" ") || [];
        console.log(Bearer , token);
        
        
        if (!Bearer || !token) {
            return res.status(400).json({ message: 'Invalid token components' });
        }

        let signature;
        switch (Bearer) {
            case "admin": signature = process.env.TOKEN_SIGNATURE_ADMIN; break;
            case "Bearer": signature = process.env.TOKEN_SIGNATURE; break;
            default: return res.status(400).json({ message: 'Invalid token type' });
        }

        const decoded = jwt.decode(token, signature);
        const userId = decoded.id;

        // Check product exists and has sufficient stock
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        // if (quantity > product.countInStock) {
        //     return res.status(400).json({ message: 'Quantity exceeds available stock' });
        // }

        // Find or create cart
        let cart = await Cart.findOne({ user: userId }).populate('items.product');
        if (!cart) {
            cart = await Cart.create({ user: userId, items: [] });
        }
        console.log(cart);
        

        // Check if product already in cart
        const existingItem = cart.items.find(item => 
            item.product._id.toString() === productId
        );

        if (existingItem) {
            // Remove product from cart (toggle behavior)
            cart.items = cart.items.filter(item => 
                item.product._id.toString() !== productId
            );
        } else {
            // Add product to cart
            cart.items.push({ product: productId });
        }

        await cart.save();
        const updatedCart = await Cart.findOne({ user: userId })
            .populate('items.product', 'name price images countInStock');

        const totalPrice = updatedCart.items.reduce((acc, item) => 
            acc + (item.quantity * item.product.price), 0);

        return res.status(existingItem ? 200 : 201).json({
            status: existingItem ? 'remove' : 'success',
            message: existingItem ? 'Product removed from cart' : 'Product added to cart',
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

export default addToCart;