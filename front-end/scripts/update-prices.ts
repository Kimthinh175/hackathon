// scripts/update-prices.ts
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

const ProductSchema = new mongoose.Schema({
  price: Number
}, { strict: false });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');
    
    // Update all products that don't have a price or price is 0
    const result = await Product.updateMany(
      { $or: [{ price: { $exists: false } }, { price: 0 }] },
      { $set: { price: 500000 } }
    );
    
    console.log(`Updated ${result.modifiedCount} products with default price 500,000.`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected');
  }
}

main();
