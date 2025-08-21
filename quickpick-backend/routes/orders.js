import express from "express";
import mongoose from "mongoose";
import { Order } from "../models/Order.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Create Order
router.post("/", verifyToken, async (req, res) => {
  try {
    const { items, totalPrice } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ message: "No items in order" });
    }

    // Check stock & reduce it
    for (let item of items) {
      const { productId, quantity, collectionName } = item;

      // Get correct MongoDB collection dynamically
      const collection = mongoose.connection.collection(collectionName);

      // Find product
      const product = await collection.findOne({ _id: new mongoose.Types.ObjectId(productId) });
      if (!product) {
        return res.status(404).json({ message: `Product not found in ${collectionName}` });
      }

      // Check stock
      if (product.stock < quantity) {
        return res.status(400).json({ message: `Not enough stock for ${product.title}` });
      }

      // Reduce stock
      await collection.updateOne(
        { _id: new mongoose.Types.ObjectId(productId) },
        { $inc: { stock: -quantity } }
      );
    }

    // Create order after stock updates
    const order = new Order({
      userId: req.user.id,
      items,
      totalPrice,
      status: "Pending",
      createdAt: new Date(),
    });

    await order.save();

    res.status(201).json({ message: "Order placed successfully ✅", order });
  } catch (err) {
    console.error("Order creation error:", err);
    res.status(500).json({ message: "Error creating order", error: err.message });
  }
});

// Get Orders for Logged-in User
router.get("/", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .sort({ createdAt: -1 }); // newest first

    console.log("Orders being sent to frontend:", orders);
    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});


export default router;
