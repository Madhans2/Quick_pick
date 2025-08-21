// controllers/orderController.js
import getProductModel from "../models/Product.js";
import Order from "../models/Order.js";

export const placeOrder = async (req, res) => {
  try {
    const { items, totalPrice, shippingAddress } = req.body;
    const userId = req.user.id;

    if (!items || items.length === 0) {
      return res.status(400).json({ msg: "No items in order" });
    }

    // Check stock and update each product
    for (let item of items) {
      const { productId, quantity, collectionName } = item;

      const ProductModel = getProductModel(collectionName);
      const product = await ProductModel.findById(productId);

      if (!product) {
        return res.status(404).json({ msg: `Product not found: ${productId}` });
      }

      if (product.stock < quantity) {
        return res.status(400).json({ msg: `Not enough stock for ${product.title}` });
      }

      // Reduce stock
      product.stock -= quantity;
      await product.save();
    }

    // Create order
    const order = new Order({
      userId,
      items,
      totalPrice,
      shippingAddress,
      status: "Placed",
      createdAt: new Date(),
    });

    await order.save();

    res.json({ msg: "Order placed successfully ✅", order });
  } catch (err) {
    console.error("Place order error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};
