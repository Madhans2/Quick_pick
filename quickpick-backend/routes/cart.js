// routes/cart.js
import express from "express";
import Cart from "../models/Cart.js";
import { verifyToken } from "../middleware/auth.js";
import mongoose from "mongoose";

const router = express.Router();

// ✅ Add to cart
router.post("/", verifyToken, async (req, res) => {
  try {
    const { productId, quantity = 1, collectionName } = req.body;

    if (!productId || !collectionName) {
      return res.status(400).json({ message: "Product ID and collection name are required" });
    }

    const collection = mongoose.connection.collection(collectionName);

    // Find product
    const product = await collection.findOne({ _id: new mongoose.Types.ObjectId(productId) });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const currentStock = Number(product.stock); // force number
    if (currentStock < quantity) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    // Reduce stock
    await collection.updateOne(
      { _id: new mongoose.Types.ObjectId(productId) },
      { $inc: { stock: -quantity } }
    );

    // Save cart item
    const cartItem = new Cart({
      userId: req.user.id,
      productId,
      quantity,
      collectionName
    });
    await cartItem.save();

    res.json({ message: "Product added to cart & stock updated ✅", cartItem });
  } catch (err) {
    console.error("Add to cart backend error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Get cart
router.get("/", verifyToken, async (req, res) => {
  try {
    const cartItems = await Cart.find({ userId: req.user.id });

    const cartWithProducts = await Promise.all(
      cartItems.map(async (item) => {
        if (!item.collectionName) return null;

        const ProductModel = mongoose.connection.collection(item.collectionName);
        const product = await ProductModel.findOne({
          _id: new mongoose.Types.ObjectId(item.productId)
        });

        if (!product) return null;

        return {
          ...item.toObject(),
          product: { ...product, stock: Number(product.stock) } // cast stock
        };
      })
    );

    res.json(cartWithProducts.filter(Boolean));
  } catch (err) {
    console.error("Error fetching cart:", err);
    res.status(500).json({ message: "Error fetching cart" });
  }
});

// ✅ Delete cart item (restore stock)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const cartItem = await Cart.findOne({ _id: req.params.id, userId: req.user.id });
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    const { productId, quantity, collectionName } = cartItem;

    const collection = mongoose.connection.collection(collectionName);
    await collection.updateOne(
      { _id: new mongoose.Types.ObjectId(productId) },
      { $inc: { stock: Number(quantity) } } // ensure numeric
    );

    await Cart.deleteOne({ _id: req.params.id, userId: req.user.id });

    res.json({ message: "Item removed from cart ✅ and stock updated" });
  } catch (err) {
    console.error("Error removing cart item:", err);
    res.status(500).json({ message: "Failed to remove item" });
  }
});

// ✅ Update quantity
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { quantity } = req.body;
    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const cartItem = await Cart.findOne({ _id: req.params.id, userId: req.user.id });
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    const Product = mongoose.connection.collection(cartItem.collectionName);
    const product = await Product.findOne({ _id: new mongoose.Types.ObjectId(cartItem.productId) });

    if (!product) return res.status(404).json({ message: "Product not found" });

    const currentStock = Number(product.stock);
    const diff = quantity - cartItem.quantity;

    if (diff > 0) {
      // increasing quantity → reduce stock
      if (currentStock < diff) {
        return res.status(400).json({ message: "Not enough stock available" });
      }
      await Product.updateOne(
        { _id: new mongoose.Types.ObjectId(cartItem.productId) },
        { $inc: { stock: -diff } }
      );
    } else if (diff < 0) {
      // decreasing quantity → restore stock
      await Product.updateOne(
        { _id: new mongoose.Types.ObjectId(cartItem.productId) },
        { $inc: { stock: Math.abs(diff) } }
      );
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    res.json({ message: "Cart updated successfully ✅", cartItem });
  } catch (err) {
    console.error("Update quantity error:", err);
    res.status(500).json({ message: "Failed to update cart" });
  }
});

export default router;
