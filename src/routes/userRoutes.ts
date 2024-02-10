import express, { Router } from 'express';

import UserController from '../controllers/UserController';
import authMiddleware from '../middleware/isAuth';
import { logMiddleware } from '../middleware/logger';
import rateLimiter from '../middleware/rateLimiter';

const router: Router = express.Router();

router.get(
	'/isUserVerified',
	authMiddleware,
	rateLimiter,
	logMiddleware,
	UserController.isUserVerified
);

export default router;
