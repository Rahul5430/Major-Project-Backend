import mongoose from 'mongoose';

import { SensorDataDocument } from '../types/modals';

const { Schema } = mongoose;

mongoose.set('debug', true);

const sensorDataSchema = new Schema<SensorDataDocument>(
	{
		sensorId: {
			type: Number,
			required: true,
			default: 1,
		},
		voltage: {
			type: Number,
			required: true,
		},
		time: {
			type: Number,
			required: true,
		},
	},
	{ timestamps: true }
);

const SensorData = mongoose.model<SensorDataDocument>(
	'SensorData',
	sensorDataSchema
);

export default SensorData;
