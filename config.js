const configENV = {
	development: {
		db: {
			url: process.env.MONGO_URL,
		},
		server: {
			host: '127.0.0.1',
			port: process.env.PORT,
		},
		jwt_secret: process.env.JWT_SECRET,
		saltRounds: 10,
	},
	production: {
		db: {
			url: process.env.MONGO_URL,
		},
		server: {
			host: process.env.HOST,
			port: process.env.PORT,
		},
		jwt_secret: process.env.JWT_SECRET,
	},
};

const env = process.env.NODE_ENV || 'development';
const config = configENV[env];
config.dbConnectionString = config.db.url;
module.exports = config;
