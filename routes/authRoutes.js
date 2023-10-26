const express = require('express');

const router = express.Router();
const passport = require('passport');
const AuthController = require('../controllers/AuthController');
const inputValidation = require('../validator/validateRequest');
const rateLimiter = require('../middleware/rateLimiter');
const { logMiddleware } = require('../middleware/logger');
const uservalidator = require('../validator/user');
require('../middleware/passport');
const { signToken } = require('../middleware/jwt');

// Register a new user
router.post(
	'/checkUsername',
	uservalidator.validate('checkEmail'), // validation middleware
	inputValidation, // custom validation middleware
	rateLimiter,
	// cache,
	logMiddleware,
	AuthController.checkUsername // controller
);

router.post(
	'/register',
	uservalidator.validate('registerUser'), // validation middleware
	inputValidation, // custom validation middleware
	rateLimiter,
	// cache,
	logMiddleware,
	AuthController.register // controller
);

router.post('/verify', rateLimiter, logMiddleware, AuthController.verify);

router.post(
	'/registerDetails',
	rateLimiter,
	logMiddleware,
	AuthController.registerDetails
);

router.post(
	'/forgotPassword/check',
	rateLimiter,
	logMiddleware,
	AuthController.forgotPasswordEmailCheck
);

router.post(
	'/forgotPassword/verify',
	rateLimiter,
	logMiddleware,
	AuthController.forgotPasswordEmailVerify
);

router.post(
	'/forgotPassword/reset',
	rateLimiter,
	logMiddleware,
	AuthController.forgotPasswordReset
);

// Log in a user
router.post(
	'/login',
	uservalidator.validate('login'), // validation middleware
	inputValidation, // custom validation middleware
	rateLimiter,
	logMiddleware,
	AuthController.login
);

// google oauth routes
router.get(
	'/google',
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
		const isPhoneVerified = Object.hasOwn(req.user, 'phone');
		const token = signToken(req.user.email);

		return res
			.status(301)
			.redirect(
				`${process.env.FRONTEND}/oauth?token=${token}&isPhoneVerified=${isPhoneVerified}`
			);
	}
);

module.exports = router;
