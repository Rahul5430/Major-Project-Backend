const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/User');

// Initialize Passport middleware
passport.initialize();

// eslint-disable-next-line consistent-return
const authMiddleware = async (req, res, next) => {
	try {
		const token = req.headers.authorization.split(' ')[1];
		if (token) {
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			// get only email from user

			const user = await User.findOne(
				{
					email: decoded.data,
				},
				{ email: 1, _id: 1 }
			);

			if (!user) {
				return res.status(403).send({ error: 'User not found' });
			}

			req.email = user.email;
			req.id = user._id;
		} else {
			return res.status(403).json({ message: 'No bearer found!' });
		}

		next();
	} catch (e) {
		console.log(e);
		return res
			.status(403)
			.send({ error: 'User verfication on call failed!' });
	}
};

module.exports = authMiddleware;
