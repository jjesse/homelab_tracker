const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const User = require('../models/User');
const Category = require('../models/Category');

// Welcome Page
router.get('/', (req, res) => res.render('index'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, async (req, res) => {
  try {
    // Deep populate devices to ensure all fields are available for charts
    const user = await User.findById(req.user.id)
      .populate({
        path: 'devices',
        options: { 
          sort: { 'name': 1 } // Sort devices by name
        }
      })
      .exec();

    if (!user) {
      req.flash('error_msg', 'User not found');
      return res.redirect('/users/login');
    }

    // Get user's categories for the device form
    const categories = await Category.find({ user: req.user.id }).sort({ name: 1 });

    // Get flash messages for CSV import
    const success_msg = req.flash('success_msg');
    const error_msg = req.flash('error_msg');

    res.render('dashboard', {
      user: user,
      categories: categories,
      success_msg,
      error_msg,
      reloadCharts: req.session.reloadCharts || false
    });

    // Clear the reload flag
    req.session.reloadCharts = false;

  } catch (err) {
    console.error('Dashboard error:', err);
    req.flash('error_msg', 'Error loading dashboard');
    res.status(500).redirect('/');
  }
});

module.exports = router;
