import { Request, Response } from 'express';
import { Error } from 'mongoose';

import { compare, encrypt } from '../middleware/bcrypt';
import { signToken } from '../middleware/jwt';
import { logger } from '../middleware/logger';
import User from '../models/User';

const checkUsername = async (req: Request, res: Response) => {
	try {
		const usernameExists = await User.findOne(
			{
				username: req.body.username,
			},
			{ username: 1 }
		);

		if (usernameExists) {
			return res.status(401).json({
				message: 'Username already exists',
				usernameExists: true,
			});
		}

		return res.status(200).json({
			usernameExists: false,
		});
	} catch (error) {
		logger.error((error as Error).message);
		return res
			.status(400)
			.json({ message: 'Failure in checking username!!' });
	}
};

const register = async (req: Request, res: Response) => {
	try {
		const usernameExists = await User.findOne(
			{
				username: req.body.username,
			},
			{ username: 1 }
		);

		if (usernameExists) {
			return res.status(401).json({ message: 'Username already exists' });
		}

		const isEmailExisting = await User.findOne(
			{ email: req.body.email },
			{ email: 1 }
		);

		if (isEmailExisting) {
			return res.status(401).json({ message: 'Email Already exists' });
		}

		const hashedPassword = await encrypt(req.body.password);

		if (!hashedPassword) {
			return res.status(500).json({ message: 'Error hashing password' });
		}

		const newUser = await User.create({
			username: req.body.username,
			name: req.body.name,
			email: req.body.email,
			password: hashedPassword,
		});

		if (!newUser) {
			return res.status(401).json({ message: 'Unable to sign you up' });
		}

		const token = signToken(newUser.email);
		return res.status(200).json({ token, username: newUser.username });
	} catch (error) {
		logger.error((error as Error).message);
		return res.status(401).json({
			message: 'Unable to sign up, Please try again later',
			error,
		});
	}
};

const login = async (req: Request, res: Response) => {
	try {
		// return res.status(200).json({ token: '', username: 'rahul' });
		let auth = await User.findOne({ username: req.body.email });

		if (auth === null) {
			auth = await User.findOne({ email: req.body.email });
		}

		if (!auth) {
			return res.status(401).json({ message: 'User not found' });
		}

		// Verify password
		await compare(
			req.body.password,
			auth.password,
			(bcryptError, bcryptResult) => {
				if (bcryptResult && !bcryptError) {
					const token = signToken(auth!.email);
					return res
						.status(200)
						.json({ token, username: auth!.username });
				}
				return res.status(400).json({
					message:
						'Authentication failed. Invalid username/email or password.',
				});
			}
		);
	} catch (error) {
		logger.error((error as Error).message);
		return res.status(400).json({ message: 'Login failed!' });
	}
};

const AuthController = { checkUsername, login, register };

export default AuthController;
