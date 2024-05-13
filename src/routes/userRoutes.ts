import express, { Router } from 'express';

import UserController from '../controllers/UserController';
import { logMiddleware } from '../middleware/logger';
import rateLimiter from '../middleware/rateLimiter';

const router: Router = express.Router();

router.get(
	'/isUserVerified',
	rateLimiter,
	logMiddleware,
	UserController.isUserVerified
);

export default router;
