import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  brand: { type: String },
  rating: { type: Number, default: 0 }, // ✅ keep numeric
  price: { type: Number, required: true },
  image_url: { type: String },
  category: {
    main: { type: String },
    sub: { type: String },
  },
  stock: {
    type: Number,
    required: true,
    min: [0, "Stock cannot be negative"], // ✅ validation
  },
});

// ✅ Pre-save hook to prevent negative stock
productSchema.pre("save", function (next) {
  if (this.stock < 0) {
    this.stock = 0;
  }
  next();
});


export default mongoose.model('Product', productSchema);
