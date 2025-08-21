// controllers/cartController.js
import getProductModel from "../models/Product.js"; // ✅ returns model based on collectionName
import Cart from "../models/Cart.js";

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, collectionName } = req.body;
    const userId = req.user.id; // ✅ assumes user is authenticated

    // Get product model dynamically
    const ProductModel = getProductModel(collectionName);
    const product = await ProductModel.findById(productId);

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    // Check stock before adding
    if (product.stock < quantity) {
      return res.status(400).json({ msg: "Not enough stock available" });
    }

    // Check if already in cart
    let cartItem = await Cart.findOne({ userId, productId, collectionName });

    if (cartItem) {
      // Increase quantity
      if (product.stock < cartItem.quantity + quantity) {
        return res.status(400).json({ msg: "Not enough stock available" });
      }
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      // Create new cart entry
      cartItem = new Cart({
        userId,
        productId,
        collectionName,
        quantity,
      });
      await cartItem.save();
    }

    // Reduce stock in MongoDB
    product.stock -= quantity;
    await product.save();

    res.json({
      msg: "Product added to cart ✅",
      cartItem,
      product,
    });
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};
