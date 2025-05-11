
import Cart from "../../../DB/models/Cart.model.js";
import Product from "../../../DB/models/Product.model.js";
import jwt from 'jsonwebtoken';

const updateQuantity = async (req, res, next) => {
    try {
        const { operation } = req.body;
        const productId = req.params.id;
        const { authorization } = req.headers;
        const [Bearer, token] = authorization.split(" ") || [];
        
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

        // Get product info for stock validation
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ 
                status: 'fail', 
                message: 'Product not found' 
            });
        }

        // Find user's cart
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ 
                status: 'fail', 
                message: 'Cart not found' 
            });
        }

        // Find the item in cart
        const itemIndex = cart.items.findIndex(
            item => item.product.toString() === productId
        );
        
        if (itemIndex === -1) {
            return res.status(404).json({ 
                status: 'fail', 
                message: 'Product not found in cart' 
            });
        }

        // Update quantity based on operation
       
            // Increment/decrement operation
            switch (operation) {
                case "+":
                    cart.items[itemIndex].quantity += 1;
                    break;
                case "-":
                    cart.items[itemIndex].quantity -=1;
                    break;
                default:
                    return res.status(400).json({
                        status: 'fail',
                        message: 'Invalid operation'
                    });
            }

            if (cart.items[itemIndex].quantity > product.countInStock) {
                return res.status(400).json({ 
                    status: 'fail', 
                    message: 'Quantity exceeds available stock' 
                });
            }
            else if(cart.items[itemIndex].quantity<1){
                return res.status(400).json({ 
                    status: 'fail', 
                    message: "Quantity can't be less than 1" 
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

export default updateQuantity;