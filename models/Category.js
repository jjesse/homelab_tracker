const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    maxlength: 50
  },
  color: {
    type: String,
    required: true,
    default: '#6c757d', // Default gray color
    match: /^#[0-9A-F]{6}$/i // Hex color validation
  },
  description: {
    type: String,
    trim: true,
    maxlength: 200
  },
  isDefault: {
    type: Boolean,
    default: false // Mark system default categories
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
CategorySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for faster queries
CategorySchema.index({ user: 1, name: 1 });

module.exports = mongoose.model('Category', CategorySchema);