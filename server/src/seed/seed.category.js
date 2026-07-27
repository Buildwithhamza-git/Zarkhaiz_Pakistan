const mongoose = require("mongoose");
const path = require("path");
const slugify = require("slugify");

// ✅ Load .env properly
require("dotenv").config({
  path: path.resolve(__dirname, "../../.env"),
});

// ✅ Models
const Category = require("../features/category/category.model");
const Product = require("../features/product/product.model");

// ✅ ENV
const MONGO_URI = process.env.MONGO_URI;

// 🔒 Safety check
if (!MONGO_URI) {
  throw new Error("❌ MONGO_URI is missing in .env");
}

// 🔥 Categories (20+ with slug)
const categoriesData = [
  "Crops",
  "Seeds",
  "Pesticides",
  "Fertilizers",
  "Tools",
  "Machinery",
  "Irrigation",
  "Herbicides",
  "Fungicides",
  "Organic Farming",
  "Greenhouse Supplies",
  "Soil Conditioners",
  "Storage Equipment",
  "Harvesting Tools",
  "Plant Growth Regulators",
  "Compost & Waste",
  "Agri Tech",
].map((name) => ({
  name,
  slug: slugify(name, { lower: true }),
}));

// 🔥 Products generator
const generateProducts = (categories) => {
  const productMap = {
    Crops: ["Basmati Rice", "Wheat Grain", "Maize (Corn)", "Sugarcane"],

    Seeds: [
      "Hybrid Rice Seeds",
      "Wheat Seeds (Certified)",
      "Vegetable Seed Pack",
      "Cotton Seeds",
    ],

    Pesticides: [
      "Imidacloprid Insecticide",
      "Chlorpyrifos 20% EC",
      "Cypermethrin Spray",
      "Lambda Cyhalothrin",
    ],

    Fertilizers: [
      "Urea Fertilizer",
      "DAP Fertilizer",
      "NPK 20-20-20",
      "Potash Fertilizer",
    ],

    Tools: [
      "Hand Hoe",
      "Garden Shovel",
      "Pruning Shears",
      "Water Sprayer Pump",
    ],

    Machinery: [
      "Tractor 50HP",
      "Rotavator",
      "Threshing Machine",
      "Plough Machine",
    ],

    Irrigation: [
      "Drip Irrigation Kit",
      "Water Pump 1HP",
      "Sprinkler System",
      "Irrigation Pipe Set",
    ],

    Herbicides: [
      "Glyphosate Herbicide",
      "Atrazine Weed Killer",
      "Paraquat Herbicide",
      "Butachlor",
    ],

    Fungicides: [
      "Mancozeb Fungicide",
      "Carbendazim",
      "Copper Oxychloride",
      "Sulfur Fungicide",
    ],

    "Organic Farming": [
      "Vermicompost",
      "Neem Oil",
      "Organic Pesticide Spray",
      "Bio Fertilizer",
    ],
  };

  return categories.flatMap((cat) => {
    const items = productMap[cat.name] || [
      `${cat.name} Supply`,
      `${cat.name} Equipment`,
    ];

    return items.map((item) => ({
      name: item,
      slug: slugify(item, { lower: true }), // ✅ optional (if product schema needs it)
      description: `High quality ${item.toLowerCase()} for farming use`,
      price: Math.floor(Math.random() * 100) + 20,
      stock: 100,
      unit: "kg",
      category: cat._id,
      seller: new mongoose.Types.ObjectId(),
      status: "Active",
      featured: Math.random() > 0.6,
      brand: cat.name,
      tags: [cat.slug, "agri"],
    }));
  });
};

// 🚀 Seeder function
const seedDB = async () => {
  try {
    console.log("🌱 Starting Seeder...");

    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB Connected");

    // ❌ Clear old data
    await Category.deleteMany();
    await Product.deleteMany();
    console.log("🧹 Old data cleared");

    // ✅ Insert categories
    const createdCategories = await Category.insertMany(categoriesData);
    console.log(`✅ ${createdCategories.length} Categories inserted`);

    // ✅ Insert products
    const products = generateProducts(createdCategories);
    await Product.insertMany(products);
    console.log(`✅ ${products.length} Products inserted`);

    console.log("🎉 SEEDING COMPLETE!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeder Error:", err.message);
    process.exit(1);
  }
};

// ▶️ Run
seedDB();