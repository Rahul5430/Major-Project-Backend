import { body } from 'express-validator';

type method = 'checkEmail' | 'registerUser' | 'login';

const validate = (method: method) => {
	switch (method) {
		case 'checkEmail': {
			return [
				body('username', 'username is required')
					.notEmpty()
					.withMessage('Username is required'),
			];
		}
		case 'registerUser': {
			return [
				body('username', 'username is required')
					.notEmpty()
					.withMessage('Username is required'),
				body('name', 'name is required')
					.notEmpty()
					.withMessage('Name is required'),
				body('email', 'email is required')
					.isEmail()
					.withMessage('Email is invalid'),
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
	}
};

const userValidator = { validate };

export default userValidator;
