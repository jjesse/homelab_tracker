import { Router } from 'express';
import { ensureAuthenticated } from '../config/auth.js';
import User from '../models/User.js';

const router = Router();

// Welcome Page
router.get('/', (req, res) => res.render('index'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, async (req, res) => {
	try {
		const user = await User.findById(req.user.id)
			.populate({
				path: 'devices',
				options: { sort: { 'name': 1 } }
			})
			.exec();

		if (!user) {
			req.flash('error_msg', 'User not found');
			return res.redirect('/users/login');
		}

		const success_msg = req.flash('success_msg');
		const error_msg = req.flash('error_msg');

		res.render('dashboard', {
			user: user,
			success_msg,
			error_msg,
			reloadCharts: req.session.reloadCharts || false
		});

		req.session.reloadCharts = false;
	} catch (err) {
		console.error('Dashboard error:', err);
		req.flash('error_msg', 'Error loading dashboard');
		res.status(500).redirect('/');
	}
});

export default router;
