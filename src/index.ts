import './middleware/passport';

import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Express } from 'express';
import session from 'express-session';
import http from 'http';
import mongoose from 'mongoose';
import passport from 'passport';
import serverless from 'serverless-http';
import { Server } from 'socket.io';

import SensorController from './controllers/SensorController';
import { errorLoggerMiddleware, logger } from './middleware/logger';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import { MONGO_URI, PORT } from './utils/secrets';

const app: Express = express();

const allowedOrigins = ['http://localhost:3000', 'http://localhost:8000'];

app.use(
	cors({
		origin(origin, callback) {
			if (!origin || allowedOrigins.indexOf(origin) !== -1) {
				callback(null, true);
			} else {
				callback(new Error('Not allowed by CORS '));
			}
		},
	})
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser());

mongoose
	.connect(MONGO_URI)
	.then(() => {
		logger.info('mongoDB server has been connected!');
	})
	.catch((err) => {
		logger.error('Error connecting mongoDB', err);
	});

app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);

app.use(errorLoggerMiddleware);

const server = http.createServer(app);

server.listen(PORT, () => {
	logger.info(`Server running on port ${PORT}`);
});

const io = new Server(server, {
	cors: {
		origin: allowedOrigins,
		methods: ['GET', 'POST'],
	},
});

SensorController.sensorDataHandler(io);

module.exports.handler = serverless(app);
