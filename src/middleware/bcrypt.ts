import bcrypt from 'bcrypt';

import { logger } from './logger';

const saltRounds = 10;

const encrypt = async (data: string | Buffer) => {
	try {
		const salt = await bcrypt.genSalt(saltRounds);
		const hash = await bcrypt.hash(data, salt);
		return hash;
	} catch (error) {
		logger.error(error);
		return false;
	}
};

const compare = async (
	data: string | Buffer,
	hash: string,
	callback: (bcryptError: Error | undefined, bcryptResult: boolean) => void
) => {
	try {
		return bcrypt.compare(data, hash, (bcryptError, bcryptResult) =>
			callback(bcryptError, bcryptResult)
		);
	} catch (error) {
		logger.error(error);
		return false;
	}
};

export { compare, encrypt };
