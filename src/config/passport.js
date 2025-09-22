import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../../dist/models/User.js';

export default function configurePassport() {
	passport.use(
		new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
			try {
				const user = await User.findOne({ email });
				if (!user) {
					return done(null, false, { message: 'That email is not registered' });
				}
				const isMatch = await bcrypt.compare(password, user.password);
				if (isMatch) {
					return done(null, user);
				} else {
					return done(null, false, { message: 'Password incorrect' });
				}
			} catch (err) {
				return done(err);
			}
		})
	);

	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	passport.deserializeUser(async (id, done) => {
		try {
			const user = await User.findById(id);
			done(null, user);
		} catch (err) {
			done(err);
		}
	});
}

// ...existing code...
