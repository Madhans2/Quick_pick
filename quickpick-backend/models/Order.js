import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, required: true },
        quantity: { type: Number, required: true, min: 1 },
        collectionName: { type: String, required: true } // Same fix as cart
      }
    ],
    totalPrice: { type: Number, required: true },
    status: { type: String, default: "Pending" } // Pending, Shipped, Delivered
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
