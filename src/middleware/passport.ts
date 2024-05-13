import crypto from 'crypto';
import Hashids from 'hashids';
import passport from 'passport';
import { Strategy as GoogleTokenStrategy } from 'passport-google-oauth2';

import User from '../models/User';
import {
	BACKEND,
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
} from '../utils/secrets';
import { logger } from './logger';

function generateSecurePassword(length = 12) {
	const charset =
		'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=';
	const password = [];

	for (let i = 0; i < length; i += 1) {
		const randomIndex = crypto.randomInt(0, charset.length);
		password.push(charset.charAt(randomIndex));
	}

	return password.join('');
}

passport.use(
	new GoogleTokenStrategy(
		{
			clientID: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET,
			callbackURL: `${BACKEND}/auth/google/callback`,
			passReqToCallback: true,
		},
		async (req, accessToken, refreshToken, params, profile, done) => {
			try {
				let user = await User.findOne({ googleId: profile.id });

				// save googleId for old user with
				if (!user) {
					user = await User.findOne({
						email: profile.emails[0].value,
					});

					if (user) {
						user.googleId = profile.id;
						await user.save();
					}
				}

				if (!user) {
					let username = profile.displayName.substring(0, 20);
					let usernameTaken = true;
					let i = 0;

					while (usernameTaken) {
						const remainingIndices =
							username.length + i.toString().length > 20
								? 20 - i.toString().length
								: username.length;
						const candidateUsername =
							i === 0
								? username
								: `${username.substring(
										0,
										remainingIndices
									)}${i}`;
						// eslint-disable-next-line no-await-in-loop
						const existingUser = await User.findOne({
							username: candidateUsername,
						});

						if (!existingUser) {
							username = candidateUsername;
							usernameTaken = false;
						} else {
							i += 1;
						}
					}

					const hashids = new Hashids(username, 5);
					const referral = `bet${hashids.encode(profile.id)}`;

					user = new User({
						googleId: profile.id,
						email: profile.emails[0].value,
						name: profile.name.givenName,
						// You should generate a secure password or use another authentication method.
						password: generateSecurePassword(), // Replace with a secure password generation method.
						username,
						verified: true,
						referalCode: referral,
					});
					await user.save();
				}

				req.user = user;

				return done(null, user);
			} catch (error) {
				logger.error('Error in passport.js:', error);
				return done(error);
			}
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	const user = await User.findById(id);
	done(null, user);
});
