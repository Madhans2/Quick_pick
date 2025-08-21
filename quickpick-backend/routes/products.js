import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Generic Schema (strict: false) to allow dynamic fields
const genericSchema = new mongoose.Schema({}, { strict: false });

// Helper to safely get or create a dynamic model
const getModel = (collection) => {
  return mongoose.models[collection] || mongoose.model(collection, genericSchema, collection);
};

// 🔍 GLOBAL SEARCH (must be on top!)
router.get("/search", async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ message: "Query is required" });

  try {
    const collections = [
      "mobiles",
      "laptop",
      "tv",
      "appliances",
      "kitchens",
      "fashions",
      "monitors",
      "plastic_toy",
      "remote_cars",
      "stationaries",
      "teddy",
      "toy",
      "categories",
    ];

    let results = [];
    for (const collection of collections) {
      const Model = getModel(collection);
      const items = await Model.find({
        title: { $regex: q, $options: "i" },
      });
      results.push(...items.map((item) => ({ ...item.toObject(), collection })));
    }

    if (!results.length) {
      return res.status(404).json({ message: "No products found" });
    }

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});



// GET /api/products/:collection - Fetch all items from a collection
router.get('/:collection', async (req, res) => {
  const { collection } = req.params;

  try {
    const DynamicModel = getModel(collection);
    const items = await DynamicModel.find({});
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});



// GET /api/products/:collection/:id - Fetch single item by ID
router.get('/:collection/:id', async (req, res) => {
  const { collection, id } = req.params;

  try {
    const DynamicModel = getModel(collection);
    const item = await DynamicModel.findById(id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// test this in your backend route temporarily
router.get('/test-mobiles', async (req, res) => {
  const Model = mongoose.model('mobiles', genericSchema, 'mobiles');
  const data = await Model.find();
  res.json(data);
});


export default router;
