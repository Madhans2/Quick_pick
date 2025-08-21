import express from "express";
import Wishlist from "../models/wishlist.model.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Get user wishlist
router.get("/", verifyToken, async (req, res) => {
  const wishlist = await Wishlist.findOne({ userId: req.user.id }).populate("products");
  res.json(wishlist?.products || []);
});

// Add product to wishlist
router.post("/", verifyToken, async (req, res) => {
  const { productId } = req.body;
  let wishlist = await Wishlist.findOne({ userId: req.user.id });
  
  if (!wishlist) {
    wishlist = new Wishlist({ userId: req.user.id, products: [productId] });
  } else if (!wishlist.products.includes(productId)) {
    wishlist.products.push(productId);
  }
  await wishlist.save();
  res.json({ message: "Added to wishlist" });
});

// Remove product from wishlist
router.delete("/:productId", verifyToken, async (req, res) => {
  const { productId } = req.params;
  await Wishlist.updateOne(
    { userId: req.user.id },
    { $pull: { products: productId } }
  );
  res.json({ message: "Removed from wishlist" });
});

export default router;
