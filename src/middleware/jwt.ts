import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../utils/secrets';

const signToken = (data: string) => {
	return jwt.sign(
		{
			exp: Math.floor(Date.now() / 1000) + 240000, // one day
			data,
		},
		JWT_SECRET
	);
};

export { signToken };
