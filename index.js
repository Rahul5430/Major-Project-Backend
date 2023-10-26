const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const session = require('express-session');
const serverless = require('serverless-http');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './.env') });

const app = express();

const allowedOrigins = ['http://localhost:3000', 'http://localhost:8000'];

app.use(
	cors({
		origin(origin, callback) {
			if (!origin || allowedOrigins.indexOf(origin) !== -1) {
				callback(null, true);
			} else {
				callback(new Error('Not allowed by CORS'));
			}
		},
	})
);

const passport = require('passport');
require('./middleware/passport');

const authRoutes = require('./routes/authRoutes');
const usersRoutes = require('./routes/userRoutes');

// Set up body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up cookie parser middleware
app.use(cookieParser());

// call config
const config = require('./config');
const { errorLoggerMiddleware, logger } = require('./middleware/logger');

// connect to mongodb
mongoose.connect(config.dbConnectionString, () => {
	logger.info('mongoDb server has been connected!');
});

// Set up Passport middleware dependency
app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Use routes
// app.use("/", mainRoutes);
app.use('/auth', authRoutes);
app.use('/users', usersRoutes);

// Set up error handling middleware
app.use(errorLoggerMiddleware);

// Start server
const PORT = config?.server?.port || 8000;
app.listen(PORT, () => {
	logger.info(`Server running on port ${PORT}`);
});

// Export as serverless handler if needed
module.exports.handler = serverless(app);
