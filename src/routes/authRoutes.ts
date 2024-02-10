import express, { Router } from 'express';

import Authcontroller from '../controllers/AuthController';
import { logMiddleware } from '../middleware/logger';
import rateLimiter from '../middleware/rateLimiter';
import userValidator from '../validator/user';
import inputValidation from '../validator/validateRequest';

const router: Router = express.Router();

router.post(
	'/checkUsername',
	userValidator.validate('checkEmail'),
	inputValidation,
	rateLimiter,
	logMiddleware,
	Authcontroller.checkUsername
);

router.post(
	'/register',
	userValidator.validate('registerUser'),
	inputValidation,
	rateLimiter,
	logMiddleware,
	Authcontroller.register
);

router.post(
	'/login',
	userValidator.validate('login'),
	inputValidation,
	rateLimiter,
	logMiddleware,
	Authcontroller.login
);

export default router;
