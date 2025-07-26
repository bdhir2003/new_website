// Script to check and create admin user
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

async function checkAndCreateAdmin() {
  const client = new MongoClient('mongodb://localhost:27017/student-portfolio');
  
  try {
    await client.connect();
    const db = client.db('student-portfolio');
    const users = db.collection('users');
    
    // Check if admin user exists
    const adminUser = await users.findOne({ role: 'admin' });
    
    if (adminUser) {
      console.log('✅ Admin user found:', adminUser.email);
      console.log('Admin user details:', {
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role,
        id: adminUser._id
      });
    } else {
      console.log('❌ No admin user found. Creating one...');
      
      // Create admin user
      const hashedPassword = await bcrypt.hash('admin123', 12);
      const newAdmin = {
        email: 'admin@portfolio.com',
        password: hashedPassword,
        name: 'Portfolio Admin',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const result = await users.insertOne(newAdmin);
      console.log('✅ Admin user created successfully!');
      console.log('Login credentials:');
      console.log('Email: admin@portfolio.com');
      console.log('Password: admin123');
      console.log('User ID:', result.insertedId);
    }
    
    // List all users
    console.log('\n📋 All users in database:');
    const allUsers = await users.find({}).toArray();
    allUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} (${user.role}) - ID: ${user._id}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

checkAndCreateAdmin();
