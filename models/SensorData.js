const mongoose = require('mongoose');

const { Schema } = mongoose;

const sensorDataSchema = new Schema({
	sensorId: {
		type: Number,
		required: true,
	},
	location: {
		latitude: Number,
		longitude: Number,
	},
	voltage: {
		type: Number,
		required: true,
	},
	timestamp: {
		type: Date,
		default: Date.now,
	},
});

const SensorData = mongoose.model('SensorData', sensorDataSchema);

module.exports = SensorData;
