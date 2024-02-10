import { Document } from 'mongoose';

export type UserDocument = Document & {
	username: string;
	name: string;
	email: string;
	googleId?: string;
	password: string;
};

type Location = {
	latitude: number;
	longitude: number;
};

export type SensorDataDocument = Document & {
	sensorId: number;
	location?: Location;
	voltage: number;
};
