import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, required: true },
  quantity: { type: Number, default: 1 },
  collectionName: { type: String, required: true } // <-- REQUIRED
}); 

export default mongoose.model("Cart", cartSchema);
