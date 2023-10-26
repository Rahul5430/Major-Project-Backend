const { param, body } = require('express-validator');

module.exports.validate = (method) => {
	switch (method) {
		case 'checkEmail': {
			return [
				//   body('userId').notEmpty().withMessage('userId is required'),
				body('username', 'username is required')
					.notEmpty()
					.withMessage('Username is required'),
			];
		}
		case 'registerUser': {
			return [
				//   body('userId').notEmpty().withMessage('userId is required'),
				body('username', 'username is required')
					.notEmpty()
					.withMessage('Username is required'),
				body('name', 'name is required')
					.notEmpty()
					.withMessage('Name is required'),
				body('email', 'email is required')
					.isEmail()
					.withMessage('Email is invalid'),
				body('phone', 'phone is required')
					.isInt()
					.notEmpty()
					.withMessage('Phone number is required')
					.isLength({ min: 10, max: 15 })
					.withMessage('Phone number must be min ten digits long'),
				// body('ethAddress').notEmpty().withMessage('Ethereum address is required')
			];
		}
		case 'login': {
			return [
				body('email', 'email is required')
					.exists()
					.isString()
					.withMessage('email must be string')
					.notEmpty()
					.withMessage('email cannot be null'),
				body('password', 'password is required')
					.exists()
					.isString()
					.withMessage('password must be string')
					.notEmpty()
					.withMessage('password cannot be null')
					.matches(
						/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%#?&]/
					)
					.withMessage(
						'Please enter a password with at least 8 character and contain at least one uppercase, one lower case, one special character, and one digit'
					),
			];
		}
		case 'getUser': {
			return [
				param('userId').notEmpty().withMessage('userId is required'),
			];
		}
		case 'updateUser': {
			return [
				param('userId').notEmpty().withMessage('userId is required'),
				body('username').notEmpty().withMessage('Username is required'),
				body('name').notEmpty().withMessage('Name is required'),
				body('email').isEmail().withMessage('Email is invalid'),
				body('phone')
					.isInt()
					.notEmpty()
					.withMessage('Phone number is required')
					.isLength({ min: 10, max: 15 })
					.withMessage('Phone number must be ten digits long'),
				/* body("ethAddress")
          .notEmpty()
          .withMessage("Ethereum address is required"), */
			];
		}
		default: {
			return [];
		}
	}
};
