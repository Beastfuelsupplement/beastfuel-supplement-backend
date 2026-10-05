// Run this file to seed initial data: node seed.js
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
require('dotenv').config();

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/beastfuel-store');
  console.log('Connected to MongoDB');

  // Create admin user
  const adminExists = await User.findOne({ email: 'admin@beastfuel.com' });
  if (!adminExists) {
    await User.create({
      email: 'admin@beastfuel.com',
      password: 'admin123',
      name: 'Admin',
      role: 'admin'
    });
    console.log('✅ Admin user created (admin@beastfuel.com / admin123)');
  }

  // Create sample products
  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    await Product.insertMany([
      { name: 'Protein Powder - Chocolate', price: 29.99, stock: 50, category: 'Supplements', flavor: 'Chocolate', weight: '1kg' },
      { name: 'Protein Powder - Vanilla', price: 29.99, stock: 40, category: 'Supplements', flavor: 'Vanilla', weight: '1kg' },
      { name: 'BCAA Energy Drink', price: 24.99, stock: 100, category: 'Drinks', flavor: 'Berry', weight: '500ml' },
      { name: 'Pre-Workout Formula', price: 34.99, stock: 30, category: 'Supplements', flavor: 'Fruit Punch', weight: '300g' },
      { name: 'Creatine Monohydrate', price: 19.99, stock: 80, category: 'Supplements', weight: '500g' },
    ]);
    console.log('✅ Sample products created');
  }

  console.log('🎉 Seeding complete!');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
