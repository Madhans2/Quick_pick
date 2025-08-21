import mongoose from "mongoose";

const uri = "mongodb+srv://madhanbilla:Madhanbilla@sample.7lhwsko.mongodb.net/"; // replace with your MongoDB URI

// all your collections
const collections = [
  "appliances",
  "categories",
  "fashions",
  "kitchens",
  "laptops",
  "mobiles",
  "monitors",
  "plastic_toys",
  "remote_cars",
  "stationaries",
  "teddy",
  "toys",
  "tv",
];

async function fixStockAll() {
  try {
    await mongoose.connect(uri);
    const db = mongoose.connection.db;

    for (const col of collections) {
      const result = await db.collection(col).updateMany(
        { stock: { $type: "string" } },
        [{ $set: { stock: { $toInt: "$stock" } } }]
      );

      console.log(
        `✅ Collection "${col}" updated. Modified: ${result.modifiedCount}`
      );
    }

    console.log("🎉 All collections stock fields fixed!");
    process.exit();
  } catch (err) {
    console.error("❌ Error fixing stock:", err);
    process.exit(1);
  }
}

fixStockAll();
