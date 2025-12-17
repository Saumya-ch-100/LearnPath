import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import connectDB from '../config/db.js';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

// Seed users configuration
const seedUsers = [
  {
    name: 'Admin User',
    email: 'admin@test.com',
    password: 'password123',
    role: 'admin',
  },
  {
    name: 'Dr. Sarah Johnson',
    email: 'sarah.mentor@test.com',
    password: 'password123',
    role: 'mentor',
    bio: 'Full-stack developer with 10+ years of experience in web technologies. Passionate about helping learners grow.',
    specializations: ['Frontend Development', 'React', 'JavaScript', 'UI/UX Design'],
    availability: 'Weekday evenings and weekends',
    isAvailableForMentoring: true,
    maxLearners: 10,
  },
  {
    name: 'James Rodriguez',
    email: 'james.mentor@test.com',
    password: 'password123',
    role: 'mentor',
    bio: 'Backend engineer specializing in Node.js, databases, and cloud infrastructure. Love teaching system design.',
    specializations: ['Backend Development', 'Node.js', 'Database Design', 'AWS'],
    availability: 'Flexible schedule, prefer async communication',
    isAvailableForMentoring: true,
    maxLearners: 8,
  },
  {
    name: 'Priya Sharma',
    email: 'priya.mentor@test.com',
    password: 'password123',
    role: 'mentor',
    bio: 'DevOps engineer and full-stack developer. Help students with complete software development lifecycle.',
    specializations: ['Full-Stack Development', 'Python', 'DevOps', 'CI/CD'],
    availability: 'Weekends only',
    isAvailableForMentoring: true,
    maxLearners: 5,
  },
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('🌱 Starting user seed process...\n');

    for (const userData of seedUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });

      if (existingUser) {
        console.log(`⚠️  ${userData.role.toUpperCase()} user already exists: ${userData.email}`);
        continue;
      }

      // Hash password
      const passwordHash = await bcrypt.hash(userData.password, 10);

      // Create user directly with specified role
      const newUser = await User.create({
        name: userData.name,
        email: userData.email,
        passwordHash,
        role: userData.role,
      });

      console.log(`✅ Created ${userData.role.toUpperCase()} user: ${newUser.email}`);
    }

    console.log('\n✨ Seed complete:');
    console.log('   • Admin:  admin@test.com / password123');
    console.log('   • Mentor: sarah.mentor@test.com / password123 (Frontend/React specialist)');
    console.log('   • Mentor: james.mentor@test.com / password123 (Backend/Node.js specialist)');
    console.log('   • Mentor: priya.mentor@test.com / password123 (Full-Stack/DevOps specialist)');
    console.log('\n💡 Use these credentials to test admin and mentor features.\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
}

// Run seed
seedDatabase();
