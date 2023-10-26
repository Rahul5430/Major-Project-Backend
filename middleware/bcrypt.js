const bcrypt = require('bcrypt');
const { logger } = require('./logger');

const saltRounds = 10;

exports.encrypt = async (data) => {
	try {
		const salt = await bcrypt.genSalt(saltRounds);
		const hash = await bcrypt.hash(data, salt);
		return hash;
	} catch (error) {
		logger.error(error);
		return false;
	}
};

exports.compare = async (data, hash) => {
	try {
		const isMatch = await bcrypt.compare(data, hash);
		return isMatch;
	} catch (error) {
		logger.error(error);
		return false;
	}
};
