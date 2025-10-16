const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { ensureGuest } = require('../config/auth');
const { check, validationResult } = require('express-validator');
const { defaultCategories } = require('../scripts/seedCategories');

// User model
const User = require('../models/User');
const Category = require('../models/Category');

// Register
router.get('/register', ensureGuest, (req, res) => {
  res.render('register', { 
    errors: [],
    name: '',
    email: '',
    password: '',
    password2: ''
  });
});

// Login
router.get('/login', ensureGuest, (req, res) => res.render('login'));

// Register
router.post('/register', [
  check('name', 'Name is required').notEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  check('password2', 'Passwords do not match').custom((value, { req }) => value === req.body.password)
], (req, res) => {
  const { name, email, password, password2 } = req.body;

  const errors = validationResult(req).array();

  if (errors.length > 0) {
    return res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  }

  User.findOne({ email: email })
    .then(user => {
      if (user) {
        errors.push({ msg: 'Email is already registered' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save()
              .then(async user => {
                // Automatically create default categories for new user
                try {
                  const categoriesToCreate = defaultCategories.map(cat => ({
                    ...cat,
                    user: user._id,
                    isDefault: true
                  }));

                  await Category.insertMany(categoriesToCreate);
                  console.log(`Created ${categoriesToCreate.length} default categories for new user: ${user.email}`);
                } catch (error) {
                  console.error('Error creating default categories for new user:', error);
                  // Don't fail registration if category creation fails
                }

                req.flash('success_msg', 'You are now registered and can log in');
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successReturnToOrRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
  });
});

module.exports = router;
