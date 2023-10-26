const express = require('express');

const router = express.Router();
const UserController = require('../controllers/UserController');
const rateLimiter = require('../middleware/rateLimiter');
const authMiddleware = require('../middleware/isAuth');
const { logMiddleware } = require('../middleware/logger');

// userId would be got out from the token instead
router.get(
	'/isUserVerified',
	authMiddleware,
	rateLimiter,
	logMiddleware,
	UserController.isUserVerified
);

router.post(
	'/verifyPhone',
	authMiddleware,
	rateLimiter,
	logMiddleware,
	UserController.verifyPhone
);

module.exports = router;
