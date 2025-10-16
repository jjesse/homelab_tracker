const mongoose = require('mongoose');
require('dotenv').config();

// User model
const User = require('../models/User');

// DB Config
const db = process.env.MONGODB_URI || 'mongodb://localhost:27017/homelab';

mongoose.connect(db)
  .then(() => {
    console.log('MongoDB Connected');
    return User.find({}, 'name email createdAt');
  })
  .then(users => {
    console.log('\nExisting users:');
    console.log('===============');
    if (users.length === 0) {
      console.log('No users found in database');
    } else {
      users.forEach(user => {
        console.log(`Name: ${user.name}`);
        console.log(`Email: ${user.email}`);
        console.log(`Created: ${user.createdAt}`);
        console.log('---');
      });
    }
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });