const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');

dotenv.config();

const products = [];

// 25 vegetables
for (let i = 1; i <= 25; i++) {
  products.push({
    name: `Vegetable ${i}`,
    category: 'vegetable',
    pricePerKg: 20 + i,
    isAvailable: true
  });
}

// 25 fruits
for (let i = 1; i <= 25; i++) {
  products.push({
    name: `Fruit ${i}`,
    category: 'fruit',
    pricePerKg: 30 + i,
    isAvailable: true
  });
}

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    await Product.deleteMany();
    console.log('Existing products cleared');

    const inserted = await Product.insertMany(products);
    console.log(`✅ ${inserted.length} products inserted`);

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedProducts();
