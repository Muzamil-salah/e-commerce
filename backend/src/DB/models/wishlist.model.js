import mongoose, { model, Schema } from "mongoose";

const wishlistSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true // Ensures one document per user
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    }]
}, {
    timestamps: true
});

const Wishlist = model('Wishlist', wishlistSchema) || mongoose.models.Wishlist;

export default Wishlist;