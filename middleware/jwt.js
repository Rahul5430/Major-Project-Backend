const jwt = require('jsonwebtoken');

module.exports.signToken = (params) => {
	return jwt.sign(
		{
			// change this 240000 for jwt expiry
			exp: Math.floor(Date.now() / 1000) + 240000, // one day
			data: params,
		},
		process.env.JWT_SECRET
	);
};

module.exports.verifyToken = (token) => {
	try {
		const data = jwt.verify(token, process.env.JWT_SECRET);
		return [data, null];
	} catch (error) {
		let err;
		switch (error.name) {
			case 'TokenExpiredError':
				err = 'Token Expired';
				break;
			default:
				err = error.name;
		}
		return [null, err];
	}
};
