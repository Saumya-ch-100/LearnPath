import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const makeAdmin = async (email) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.log(`❌ User with email "${email}" not found.`);
      process.exit(1);
    }

    if (user.role === 'admin') {
      console.log(`ℹ️  User "${user.name}" (${user.email}) is already an admin.`);
      process.exit(0);
    }

    user.role = 'admin';
    await user.save();

    console.log(`✅ Successfully promoted "${user.name}" (${user.email}) to admin!`);
    console.log(`\nUser Details:`);
    console.log(`  - Name: ${user.name}`);
    console.log(`  - Email: ${user.email}`);
    console.log(`  - Role: ${user.role}`);
    console.log(`  - ID: ${user._id}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.log('❌ Please provide an email address.');
  console.log('Usage: node src/scripts/makeAdmin.js <email>');
  console.log('Example: node src/scripts/makeAdmin.js meow@gmail.com');
  process.exit(1);
}

makeAdmin(email);
