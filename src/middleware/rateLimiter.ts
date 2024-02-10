import { Request } from 'express';
import { rateLimit } from 'express-rate-limit';

const limiter = rateLimit({
	windowMs: 60 * 60 * 1000,
	limit: 3000,
	message: 'Too many requests from this IP, please try again later',
	keyGenerator: (request: Request) => {
		if (!request.ip) {
			console.error('Warning: request.ip is missing!');
			return request.socket.remoteAddress as string;
		}

		return request.ip.replace(/:\d+[^:]*$/, '');
	},
});

export default limiter;
