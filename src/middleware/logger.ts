import { NextFunction, Request, Response } from 'express';
import winston from 'winston';

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

const logMiddleware = (req: Request, res: Response, next: NextFunction) => {
	const { method, url, id } = req;
	logger.info(`Request received: ${method} - ${url} by ${id || 'authCall'}`);
	next();
};

const errorLoggerMiddleware = (err: Error, req: Request, res: Response) => {
	logger.error(`Error occurred: ${err.message}`);
	res.status(500).send('Server Error');
};

export { errorLoggerMiddleware, logger, logMiddleware };
