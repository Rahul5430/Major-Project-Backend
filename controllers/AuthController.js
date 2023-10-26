require('dotenv').config();
const Hashids = require('hashids/cjs');
const User = require('../models/User');
const { encrypt, compare } = require('../middleware/bcrypt');
const { generateOTP } = require('../middleware/otp');
const { signToken, verifyToken } = require('../middleware/jwt');
const {
	sendVerifyMail,
	sendForgotMail,
	verifyEmail,
} = require('../middleware/nodemailer');
const { logger } = require('../middleware/logger');

// Handle user registration
exports.checkUsername = async (req, res) => {
	try {
		// if user exists but is not verified, then let them recreate account by overwriting account
		// current flow is that the not verified account is to be deleted and overwritten
		const usernameExists = await User.findOne({
			username: req.body.username,
		});
		if (usernameExists) {
			if (usernameExists.verified)
				return res.status(401).json({
					message: 'Username already exists',
					usernameExists: true,
				});
			await User.deleteOne({ username: req.body.username });
			// delete an already existing username that has been unverified
		}

		return res.status(200).json({
			usernameExists: false,
		});
	} catch (error) {
		logger.error(error.message);
		return res
			.status(400)
			.json({ message: 'Failure in checking username!!' });
	}
};

exports.register = async (req, res) => {
	try {
		// if user exists but is not verified, then let them recreate account by overwriting account
		// current flow is that the not verified account is to be deleted and overwritten
		const usernameExists = await User.findOne({
			username: req.body.username,
		});
		if (usernameExists) {
			if (usernameExists.verified)
				return res
					.status(401)
					.json({ message: 'Username already exists' });
			await User.deleteOne({ username: req.body.username });
		}

		const isExisting = await User.findOne({ email: req.body.email });
		if (isExisting) {
			if (isExisting.verified)
				return res
					.status(401)
					.json({ message: 'Email Already exists' });
			await User.deleteOne({ email: req.body.email });
		}

		const hashedPassword = await encrypt(req.body.password);
		if (!hashedPassword) {
			return res.status(500).json({ message: 'Error hashing password' });
		}

		const otpGenerated = generateOTP();
		const hashids = new Hashids(req.body.userame, 5);
		const referal = `bet${hashids.encode(otpGenerated)}`;
		const newUser = await User.create({
			username: req.body.username,
			name: req.body.name,
			email: req.body.email,
			phone: req.body.phone,
			password: hashedPassword,
			otp: otpGenerated,
			referalCode: referal,
			verified: false,
			isPhoneVerified: true,
		});

		if (!newUser) {
			return res.status(401).json({ message: 'Unable to sign you up' });
		}

		// send mail for verification
		try {
			await sendVerifyMail({
				to: req.body.email,
				OTP: otpGenerated,
			});
			if (!sendVerifyMail)
				return res.status(500).json({
					message:
						'error sending verification mail! Please try again later',
				});
			return res.status(200).json({
				message: 'email sent',
				name: newUser.name,
				email: newUser.email,
			});
		} catch (error) {
			logger.error(error.message);
			return res.status(401).json({
				message: 'Unable to generate OTP!!',
				error,
			});
		}
	} catch (error) {
		logger.error(error.message);
		return res.status(401).json({
			message: 'Unable to sign up, Please try again later',
			error,
		});
	}
};

exports.verify = async (req, res) => {
	// no need for try/ catch in this simple api
	const { email, otp } = req.body;
	const user = await verifyEmail(email, otp);
	if (!user[0]) return res.status(400).json({ message: user[1] });
	await User.findByIdAndUpdate(
		user[0]._id,
		{
			$set: { verified: true },
		},
		{ returnOriginal: false }
	);
	return res.status(200).json({ email: user[0].email });
};

exports.registerDetails = async (req, res) => {
	const { email, bio, referalCode, website, profilePic } = req.body;
	try {
		// Find the user by email
		const user = await User.findOne({ email });

		// If the user is not found, return an error response
		if (!user) {
			return res.status(401).json({ message: 'User not found' });
		}

		// Update the user's details
		user.bio = bio;
		user.referalBy = referalCode ? referalCode.trim() : 'vdnx';
		user.website = website;
		user.profilePic = profilePic;

		// Save the updated user details to the database
		await user.save();

		// Return a success response
		const token = signToken(user.email);
		return res.status(200).json({ token, email: user.email });
	} catch (error) {
		// Handle any errors that occurred during the process
		logger.error(error.message);
		return res.status(500).json({ message: 'Error updating user details' });
	}
};

// Handle user login
exports.login = async (req, res) => {
	try {
		// Check if user exists
		let auth = await User.findOne({ username: req.body.email });
		if (auth === null) auth = await User.findOne({ email: req.body.email });
		if (!auth) {
			return res.status(401).json({ message: 'User not found' });
		}

		// Verify password
		let message = 'Login Succesful';
		let status = 200;
		await compare(
			req.body.password,
			auth.password,
			(bcryptError, bcryptResult) => {
				if (bcryptError || !bcryptResult) {
					status = 400;
					message =
						'Authentication failed. Invalid username/email or password.';
				} else if (!auth.verified) {
					status = 400;
					message = 'Authentication failed. Email not verified.';
				}
			}
		);
		if (status === 200) {
			const token = signToken(auth.email);
			return res.status(200).json({ token, user: auth.username });
		}
		return res.status(400).json({ message });
	} catch (error) {
		logger.error(error.message);
		return res.status(400).json({ message: 'Login failed!' });
	}
};

// forgot password routes
exports.forgotPasswordEmailCheck = async (req, res) => {
	try {
		const isExisting = await User.exists({ email: req.body.email });
		if (!isExisting) {
			return res.status(400).send({
				message: 'Email does not exist',
				emailDoesNotExist: true,
			});
		}
		const otpGenerated = generateOTP();
		await User.findOneAndUpdate(
			{ email: req.body.email },
			{
				$set: { otp: otpGenerated },
			},
			{ returnOriginal: false }
		);

		// send mail for verification
		try {
			await sendForgotMail({
				to: req.body.email,
				OTP: otpGenerated,
			});
			if (!sendForgotMail)
				return res.status(500).json({
					message:
						'error sending verification mail! Please try again later',
				});
			return res
				.status(200)
				.json({ message: 'email sent', email: req.body.email });
		} catch (error) {
			logger.error(error.message);
			return res.status(400).json({
				message:
					'Unable to send mail for reset password, Please try again later',
				error,
			});
		}
	} catch (error) {
		logger.error(error.message);
		return res.status(400).json({
			message: 'Unable to reset password, Please try again later',
			error,
		});
	}
};

exports.forgotPasswordEmailVerify = async (req, res) => {
	const { email, otp } = req.body;
	const [user, err] = await verifyEmail(email, otp);
	if (err) {
		logger.error(err.message);
		return res.status(400).json({ message: err });
	}
	const token = signToken(user.email);
	return res.status(200).json({ token, email: user.email });
};

exports.forgotPasswordReset = async (req, res) => {
	try {
		const { token } = req.body;
		const user = verifyToken(token);
		if (!user[0]) return res.status(400).json({ message: user[1] });

		// Check if user exists
		const auth = await User.findOne({ email: user[0].data });
		if (!auth) {
			return res.status(401).json({ message: 'User not found' });
		}

		const hashedPassword = await encrypt(req.new_password);
		auth.password = hashedPassword;
		await auth.save();

		return res.status(200).json({ message: 'password updated!' }); // have to review what need to be returned after login
	} catch (error) {
		logger.error(error.message);
		return res
			.status(400)
			.json({ message: 'Could not update new password!' });
	}
};
