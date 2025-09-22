import { Router } from 'express';
import passport from 'passport';
import User from '../models/User.js';
import { ensureAuthenticated } from '../config/auth.js';

const router = Router();

router.get('/profile', ensureAuthenticated, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select('-password');
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}
		res.json(user);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

router.post('/register', async (req, res) => {
	try {
		const { name, email, password } = req.body;
		let user = await User.findOne({ email });
		if (user) {
			req.flash('error_msg', 'Email already registered');
			return res.redirect('/register');
		}
		user = new User({ name, email, password });
		await user.save();
		req.flash('success_msg', 'You are now registered and can log in');
		res.redirect('/login');
	} catch (err) {
		req.flash('error_msg', 'Error registering user');
		res.redirect('/register');
	}
});

router.post('/login', (req, res, next) => {
	passport.authenticate('local', {
		successRedirect: '/dashboard',
		failureRedirect: '/login',
		failureFlash: true
	})(req, res, next);
});

router.get('/logout', (req, res) => {
	req.logout(function(err) {
		if (err) {
			return res.status(500).json({ message: err.message });
		}
		req.flash('success_msg', 'You are logged out');
		res.redirect('/login');
	});
});

export default router;
// ...existing code...
