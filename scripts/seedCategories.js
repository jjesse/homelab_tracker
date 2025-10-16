const mongoose = require('mongoose');
const Category = require('../models/Category');
const User = require('../models/User');
require('dotenv').config();

// Default categories with colors
const defaultCategories = [
  { name: 'Server', color: '#007bff', description: 'Physical and virtual servers' },
  { name: 'Workstation', color: '#28a745', description: 'Desktop and laptop computers' },
  { name: 'Network', color: '#ffc107', description: 'Network equipment and infrastructure' },
  { name: 'IoT', color: '#17a2b8', description: 'Internet of Things devices' },
  { name: 'Storage', color: '#6f42c1', description: 'Storage systems and NAS devices' },
  { name: 'Security', color: '#dc3545', description: 'Security appliances and firewalls' },
  { name: 'Development', color: '#fd7e14', description: 'Development and testing systems' },
  { name: 'Testing', color: '#e83e8c', description: 'Quality assurance and testing environments' },
  { name: 'Other', color: '#6c757d', description: 'Miscellaneous devices' }
];

async function seedCategories() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all users
    const users = await User.find({});
    console.log(`Found ${users.length} users`);

    for (const user of users) {
      console.log(`\nSeeding categories for user: ${user.email}`);
      
      // Check if user already has categories
      const existingCategories = await Category.find({ user: user._id });
      
      if (existingCategories.length > 0) {
        console.log(`User ${user.email} already has ${existingCategories.length} categories. Skipping...`);
        continue;
      }

      // Create default categories for this user
      const categoriesToCreate = defaultCategories.map(cat => ({
        ...cat,
        user: user._id,
        isDefault: true
      }));

      await Category.insertMany(categoriesToCreate);
      console.log(`Created ${categoriesToCreate.length} default categories for ${user.email}`);
    }

    console.log('\n✅ Category seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seed function
if (require.main === module) {
  seedCategories();
}

module.exports = { seedCategories, defaultCategories };