import { Request, Response } from 'express';
import { Error } from 'mongoose';

import { logger } from '../middleware/logger';
import User from '../models/User';

const isUserVerified = async (req: Request, res: Response) => {
	try {
		const userId = req.body.userId || req.id;
		const user = await User.findOne(userId, {
			username: 1,
		});

		if (!user) {
			return res.status(403).send({ error: 'User not found' });
		}

		const { username } = user;

		return res.status(200).json({ username });
	} catch (error) {
		logger.error((error as Error).message);
		return res
			.status(400)
			.json({ message: 'Could not see if user is verified or not!' });
	}
};

const UserController = { isUserVerified };

export default UserController;
