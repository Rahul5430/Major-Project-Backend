const { validationResult } = require('express-validator');

// this validator check if req error from validation that ocurred previously is empty

// eslint-disable-next-line consistent-return
const validateRequest = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log(errors.array()[0].msg);
		return res.status(400).json({ message: errors.array()[0].msg });
	}
	next();
};

module.exports = validateRequest;
