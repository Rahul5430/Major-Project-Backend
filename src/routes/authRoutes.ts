import express, { Router } from 'express';
import passport from 'passport';

import AuthController from '../controllers/AuthController';
import { signToken } from '../middleware/jwt';
import { logMiddleware } from '../middleware/logger';
import rateLimiter from '../middleware/rateLimiter';
import userValidator from '../validator/user';
import inputValidation from '../validator/validateRequest';

const router: Router = express.Router();

router.post(
	'/checkUsername',
	userValidator.validate('checkEmail'),
	inputValidation,
	rateLimiter,
	logMiddleware,
	AuthController.checkUsername
);

router.post(
	'/register',
	userValidator.validate('registerUser'),
	inputValidation,
	rateLimiter,
	logMiddleware,
	AuthController.register
);

router.post(
	'/login',
	userValidator.validate('login'),
	inputValidation,
	rateLimiter,
	logMiddleware,
	AuthController.login
);

// google oauth routes
router.get(
	'/google',
	(req, res, next) => {
		// req.session.callbackUrl = req.query.callbackUrl;
		return next();
	},
	passport.authenticate('google', { scope: ['email', 'profile'] })
);

router.get(
	'/google/callback',
	passport.authenticate('google', {
		failureRedirect: `${process.env.FRONTEND}/oauthFail`,
	}),
	(req, res) => {
		if (!req.user) {
			console.log('no user found!!');
			return res.redirect(`${process.env.FRONTEND}/oauthFail`);
		}

		const token = signToken(req.user.email);

		return res
			.status(301)
			.redirect(
				`${process.env.FRONTEND}/oauth?token=${token}&username=${req.user.username}`
			);
	}
);

export default router;
