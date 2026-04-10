// scripts/seed-users.ts
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['Manager', 'Staff'], default: 'Staff' },
  isActive: { type: Boolean, default: true }
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    const salt = await bcrypt.genSalt(10);
    const hashPwd = await bcrypt.hash('123456', salt);

    const users = [
      { username: 'admin', passwordHash: hashPwd, role: 'Manager', isActive: true },
      { username: 'staff', passwordHash: hashPwd, role: 'Staff', isActive: true }
    ];

    // Delete existing users to ensure clean state
    await User.deleteMany({});
    await User.insertMany(users);
    
    console.log('✅ Users seeded successfully! (admin & staff - password: 123456)');
  } catch (err) {
    console.error('Error seeding users:', err);
  } finally {
    mongoose.disconnect();
    console.log('Disconnected');
  }
}

seed();
