const rateLimit = require('express-rate-limit');

// Limit each IP to 100 requests per hour
const limiter = rateLimit({
	windowMs: 60 * 60 * 1000,
	max: 100,
	message: 'Too many requests from this IP, please try again later',
});

module.exports = limiter;
