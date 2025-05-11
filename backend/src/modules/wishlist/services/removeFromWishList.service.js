import Wishlist from "../../../DB/models/wishlist.model.js";
import Product from "../../../DB/models/Product.model.js";
import jwt from 'jsonwebtoken';

const removeFromWishlist = async (req, res, next) => {
    try {
        const productId = req.params.id;
        const { authorization } = req.headers;
        const [Bearer, token] = authorization.split(" ") || [];
        
        if (!token || !Bearer) {
            return res.status(400).json({ message: "Invalid token components" });
        }

        let signature = undefined;
        switch (Bearer) {
            case "admin":
                signature = process.env.TOKEN_SIGNATURE_ADMIN;
                break;
            case "Bearer":
                signature = process.env.TOKEN_SIGNATURE;
                break;
            default:
                break;
        }
        
        const decoded = jwt.decode(token, signature);
        const userId = decoded.id;
        
        // Find user's wishlist
        const wishlist = await Wishlist.findOne({ user: userId });
        
        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }

        // Check if product exists in wishlist
        const productIndex = wishlist.products.indexOf(productId);
        
        if (productIndex === -1) {
            return res.status(404).json({ message: 'Product not found in wishlist' });
        }

        // Remove product from wishlist
        wishlist.products.splice(productIndex, 1);
        await wishlist.save();
        await Product.findByIdAndUpdate(productId, { isLoved: false });

        return res.status(200).json({
            status: 'success',
            message: 'Product removed from wishlist',
            wishlist: wishlist.products,
            length: wishlist.products.length
        });

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

export default removeFromWishlist;