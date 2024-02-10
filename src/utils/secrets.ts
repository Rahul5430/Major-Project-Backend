import dotenv from 'dotenv';
import fs from 'fs';

import { logger } from '../middleware/logger';

if (fs.existsSync('.env')) {
	dotenv.config({ path: '.env' });
} else {
	logger.error('.env file not found.');
}

export const PORT = (process.env.PORT || 8000) as number;
export const MONGO_URI = process.env.MONGO_URL as string;

if (!MONGO_URI) {
	logger.error(
		'No mongo connection string. Set MONGO_URI environment variable.'
	);

	process.exit(1);
}

export const BACKEND = process.env.BACKEND as string;
export const JWT_SECRET = process.env.JWT_SECRET as string;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;
