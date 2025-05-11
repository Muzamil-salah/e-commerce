
import Wishlist from "../../../DB/models/wishlist.model.js";
import jwt from 'jsonwebtoken';

const findByUserId = async (req, res, next) => {
    try {
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
        
        // Find wishlist and populate products
        const wishlist = await Wishlist.findOne({ user: userId }).populate('products');
        
        if (!wishlist) {
            return res.status(200).json({
                status: 'success',
                wishlistItems: [],
                length: 0
            });
        }

        return res.status(200).json({
            status: 'success',
            wishlistItems: wishlist.products,
            length: wishlist.products.length
        });

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

export default findByUserId;