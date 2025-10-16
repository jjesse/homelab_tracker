const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Device = require('../models/Device');
const { ensureAuthenticated } = require('../config/auth');

// @desc    Get all categories for current user
// @route   GET /categories
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user.id }).sort({ name: 1 });
    res.render('categories', {
      title: 'Category Management',
      categories,
      user: req.user,
      messages: req.flash()
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    req.flash('error_msg', 'Error loading categories');
    res.redirect('/dashboard');
  }
});

// @desc    Create new category
// @route   POST /categories
router.post('/', ensureAuthenticated, async (req, res) => {
  try {
    const { name, color, description } = req.body;
    
    // Validate required fields
    if (!name || !color) {
      req.flash('error_msg', 'Name and color are required');
      return res.redirect('/categories');
    }

    // Check if category already exists for this user
    const existingCategory = await Category.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') }, 
      user: req.user.id 
    });

    if (existingCategory) {
      req.flash('error_msg', 'Category name already exists');
      return res.redirect('/categories');
    }

    const newCategory = new Category({
      name: name.trim(),
      color: color,
      description: description ? description.trim() : '',
      user: req.user.id
    });

    await newCategory.save();
    req.flash('success_msg', `Category "${name}" created successfully`);
    res.redirect('/categories');
  } catch (error) {
    console.error('Error creating category:', error);
    req.flash('error_msg', 'Error creating category');
    res.redirect('/categories');
  }
});

// @desc    Update category
// @route   PUT /categories/:id
router.put('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const { name, color, description } = req.body;
    
    const category = await Category.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    });

    if (!category) {
      req.flash('error_msg', 'Category not found');
      return res.redirect('/categories');
    }

    // Check if new name conflicts with existing category (excluding current)
    if (name !== category.name) {
      const existingCategory = await Category.findOne({ 
        name: { $regex: new RegExp(`^${name}$`, 'i') }, 
        user: req.user.id,
        _id: { $ne: req.params.id }
      });

      if (existingCategory) {
        req.flash('error_msg', 'Category name already exists');
        return res.redirect('/categories');
      }
    }

    // Update category
    category.name = name.trim();
    category.color = color;
    category.description = description ? description.trim() : '';
    
    await category.save();
    req.flash('success_msg', `Category "${name}" updated successfully`);
    res.redirect('/categories');
  } catch (error) {
    console.error('Error updating category:', error);
    req.flash('error_msg', 'Error updating category');
    res.redirect('/categories');
  }
});

// @desc    Delete category
// @route   DELETE /categories/:id
router.delete('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const category = await Category.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    });

    if (!category) {
      req.flash('error_msg', 'Category not found');
      return res.redirect('/categories');
    }

    // Check if category is being used by any devices
    const deviceCount = await Device.countDocuments({ 
      category: category.name, 
      user: req.user.id 
    });

    if (deviceCount > 0) {
      req.flash('error_msg', `Cannot delete category "${category.name}" - it is used by ${deviceCount} device(s)`);
      return res.redirect('/categories');
    }

    await Category.findByIdAndDelete(req.params.id);
    req.flash('success_msg', `Category "${category.name}" deleted successfully`);
    res.redirect('/categories');
  } catch (error) {
    console.error('Error deleting category:', error);
    req.flash('error_msg', 'Error deleting category');
    res.redirect('/categories');
  }
});

// @desc    Get categories as JSON (for API/AJAX)
// @route   GET /categories/api
router.get('/api', ensureAuthenticated, async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user.id }).sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Error fetching categories' });
  }
});

module.exports = router;