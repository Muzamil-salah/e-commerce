
import Wishlist from "../../../DB/models/wishlist.model.js";
import Product from "../../../DB/models/Product.model.js";
import jwt from 'jsonwebtoken';

const addToWishlist = async (req, res, next) => {
    try {
        const productId = req.params.id;
        const { authorization } = req.headers;
        const [Bearer, token] = authorization.split(" ") || [];

        const productToBeAdded= await Product.findById(productId)
        if(!productToBeAdded){
            return res.status(404).json({status:'fail' , message:'product not found'})
        }
        
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

        // Find or create wishlist for user
        let wishlist = await Wishlist.findOne({ user: userId });

        if (!wishlist) {
            wishlist = await Wishlist.create({ user: userId, products: [] });
        }

        // Check if product already exists in wishlist
        const productIndex = wishlist.products.indexOf(productId);
        
        if (productIndex !== -1) {
            // Remove product from wishlist
            wishlist.products.splice(productIndex, 1);
            await wishlist.save();
            await Product.findByIdAndUpdate(productId, { isLoved: false });
            
            return res.status(200).json({
                status: 'deleted',
                message: 'Product removed from wishlist',
                wishlist: wishlist.products,
                length: wishlist.products.length
            });
        }

        // Add product to wishlist
        wishlist.products.push(productId);
        await wishlist.save();
        await Product.findByIdAndUpdate(productId, { isLoved: true });

        return res.status(201).json({
            status: 'success',
            message: 'Product added to wishlist',
            wishlist: wishlist.products,
            length: wishlist.products.length
        });

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

export default addToWishlist;