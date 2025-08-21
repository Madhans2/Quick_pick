import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error(err));

// Generic Schema to insert into any collection dynamically
const genericSchema = new mongoose.Schema({}, { strict: false });

// Function to import a dataset into its own collection (overwrite mode)
const importDataset = async (filename, collectionName) => {
  const rawData = fs.readFileSync(`./datasets/${filename}`, 'utf-8');
  const jsonData = JSON.parse(rawData);

  // Convert $oid string to actual ObjectId
  const formattedData = jsonData.map(item => {
    if (item._id && item._id.$oid) {
      item._id = new mongoose.Types.ObjectId(item._id.$oid);
    }
    return item;
  });

  // Create a dynamic model per collection
  const DynamicModel = mongoose.model(collectionName, genericSchema, collectionName);

  // DELETE existing data from this collection (important for Option 1)
  await DynamicModel.deleteMany({});
  console.log(`Cleared existing data in ${collectionName} collection`);

  // INSERT new data
  await DynamicModel.insertMany(formattedData);
  console.log(`Imported ${filename} into ${collectionName} collection`);
};

// Main function to import all datasets
const importAllData = async () => {
  try {
    const datasets = [
      { filename: 'appliances.json', collection: 'appliances' },
      { filename: 'categories.json', collection: 'categories' },
      { filename: 'fashions.json', collection: 'fashions' },
      { filename: 'kitchens.json', collection: 'kitchens' },
      { filename: 'laptops.json', collection: 'laptops' },
      { filename: 'mobiles.json', collection: 'mobiles' },
      { filename: 'monitors.json', collection: 'monitors' },
      { filename: 'plastic_toys.json', collection: 'plastic_toys' },
      { filename: 'remote_cars.json', collection: 'remote_cars' },
      { filename: 'stationaries.json', collection: 'stationaries' },
      { filename: 'teddy.json', collection: 'teddy' },
      { filename: 'toys.json', collection: 'toys' },
      { filename: 'tv.json', collection: 'tv' }
    ];

    for (const dataset of datasets) {
      await importDataset(dataset.filename, dataset.collection);
    }

    console.log('✅ All datasets imported successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

importAllData();
