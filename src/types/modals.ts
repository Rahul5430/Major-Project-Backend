import { Document } from 'mongoose';

export type UserDocument = Document & {
	username: string;
	name: string;
	email: string;
	googleId?: string;
	password: string;
};

export type SensorDataDocument = Document & {
	sensorId: number;
	voltage: number;
	time: number;
};
