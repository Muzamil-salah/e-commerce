import mongoose, { model, Schema } from "mongoose";
import cartItemSchema from "./CartItem.model.js";
const cartSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    items: [cartItemSchema]
  },
  { timestamps: true }
);

const Cart = model('Cart', cartSchema) || mongoose.models.Cart

export default Cart;