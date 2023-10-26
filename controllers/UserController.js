const User = require('../models/User');
require('dotenv').config();

const { logger } = require('../middleware/logger');

exports.isUserVerified = async (req, res) => {
	try {
		const userId = req.body.userId || req.id;
		const user = await User.findOne(userId, { isPhoneVerified: 1 });

		const { isPhoneVerified } = user;

		return res.status(200).json({
			message: `The user's phone is${
				isPhoneVerified ? '' : ' not'
			} verified`,
			isPhoneVerified,
		});
	} catch (error) {
		logger.error(error.message);
		return res
			.status(400)
			.json({ message: 'Could not see if user is verified or not!' });
	}
};

exports.verifyPhone = async (req, res) => {
	try {
		const userId = req.body.userId || req.id;
		const user = await User.findOne(userId, {
			phone: 1,
			isPhoneVerified: 1,
		});

		// If user doesn't have the isPhoneVerified field, create it and set it to false.
		if (user.isPhoneVerified === undefined) {
			user.isPhoneVerified = false;
		}
		user.phone = req.body.phone;
		user.isPhoneVerified = true;

		await user.save();

		return res.status(200).json({
			message: 'Phone verified succussfully',
			status: 200,
		});
	} catch (error) {
		logger.error(error.message);
		return res.status(400).json({ message: 'Phone already exists' });
	}
};
