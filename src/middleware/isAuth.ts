import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import passport from 'passport';

import User from '../models/User';
import { JWT_SECRET } from '../utils/secrets';

passport.initialize();

const authMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const token = req.headers.authorization?.split(' ')[1];

		if (token) {
			const decoded: JwtPayload = jwt.verify(
				token,
				JWT_SECRET
			) as JwtPayload;

			const user = await User.findOne(
				{ email: decoded.data },
				{ email: 1, _id: 1 }
			);

			if (!user) {
				return res.status(403).send({ error: 'User not found' });
			}

			req.email = user.email;
			req.id = user._id;
			req.username = user.username;
		} else {
			return res.status(403).json({ message: 'No bearer found!' });
		}

		next();
	} catch (error) {
		console.log(error);
		return res
			.status(403)
			.send({ error: 'User verfication on call failed!' });
	}
};

export default authMiddleware;
