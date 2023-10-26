/* eslint-disable no-shadow */
const winston = require('winston');

const { combine, timestamp, align, printf, colorize } = winston.format;

const logger = winston.createLogger({
	level: 'info',
	format: combine(timestamp(), winston.format.json()),
	defaultMeta: { service: 'user-service' },
	transports: [
		new winston.transports.File({ filename: 'access.log' }),
		new winston.transports.File({ filename: 'error.log', level: 'error' }),
		new winston.transports.Console({
			format: combine(
				colorize({ colors: { info: 'blue', error: 'red' } }),
				timestamp({ format: 'MMM-DD-YYYY HH:mm:ss:SS' }),
				align(),
				printf(
					({ timestamp, level, message }) =>
						`${timestamp} [${level}]: ${message}`
				)
			),
		}),
	],
});

const logMiddleware = (req, res, next) => {
	const { method, url, id } = req;
	logger.info(`Request received: ${method} - ${url} by ${id || 'authCall'}`);
	next();
};

// eslint-disable-next-line no-unused-vars
const errorLoggerMiddleware = (err, req, res, next) => {
	logger.error(`Error occurred: ${err.message}`);
	res.status(500).send('Server Error');
};

module.exports = {
	logMiddleware,
	errorLoggerMiddleware,
	logger, // If you want to use the logger elsewhere in your app
};
