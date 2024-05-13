import fs from 'fs';
import { Server, Socket } from 'socket.io';

import { logger } from '../middleware/logger';
import SensorData from '../models/SensorData';
// import { SensorDataType } from '../types';
import { SensorDataDocument } from '../types/modals';

// const sensorData: SensorDataType[] = [
// 	{ time: 0.0, voltage: 0.0 },
// 	{ time: 0.01, voltage: 0.62 },
// 	{ time: 0.02, voltage: 1.0 },
// 	{ time: 0.03, voltage: 0.843 },
// 	{ time: 0.04, voltage: 0.258 },
// 	{ time: 0.05, voltage: -0.427 },
// 	{ time: 0.06, voltage: -0.9 },
// 	{ time: 0.07, voltage: -1.0 },
// 	{ time: 0.08, voltage: -0.585 },
// 	{ time: 0.09, voltage: 0.131 },
// 	{ time: 0.1, voltage: 0.806 },
// 	{ time: 0.11, voltage: 0.948 },
// 	{ time: 0.12, voltage: 0.443 },
// 	{ time: 0.13, voltage: -0.395 },
// 	{ time: 0.14, voltage: -0.928 },
// 	{ time: 0.15, voltage: -1.0 },
// 	{ time: 0.16, voltage: -0.507 },
// 	{ time: 0.17, voltage: 0.288 },
// 	{ time: 0.18, voltage: 0.881 },
// 	{ time: 0.19, voltage: 0.964 },
// 	{ time: 0.2, voltage: 0.371 },
// 	{ time: 0.21, voltage: -0.463 },
// 	{ time: 0.22, voltage: -0.955 },
// 	{ time: 0.23, voltage: -0.986 },
// 	{ time: 0.24, voltage: -0.328 },
// 	{ time: 0.25, voltage: 0.621 },
// 	{ time: 0.26, voltage: 0.976 },
// 	{ time: 0.27, voltage: 0.785 },
// 	{ time: 0.28, voltage: 0.085 },
// 	{ time: 0.29, voltage: -0.739 },
// 	{ time: 0.3, voltage: -0.998 },
// 	{ time: 0.31, voltage: -0.743 },
// 	{ time: 0.32, voltage: 0.093 },
// 	{ time: 0.33, voltage: 0.792 },
// 	{ time: 0.34, voltage: 0.978 },
// 	{ time: 0.35, voltage: 0.615 },
// 	{ time: 0.36, voltage: -0.335 },
// 	{ time: 0.37, voltage: -0.987 },
// 	{ time: 0.38, voltage: -0.951 },
// 	{ time: 0.39, voltage: -0.456 },
// 	{ time: 0.4, voltage: 0.449 },
// 	{ time: 0.41, voltage: 0.962 },
// 	{ time: 0.42, voltage: 0.888 },
// 	{ time: 0.43, voltage: 0.278 },
// 	{ time: 0.44, voltage: -0.511 },
// 	{ time: 0.45, voltage: -0.999 },
// 	{ time: 0.46, voltage: -0.734 },
// 	{ time: 0.47, voltage: 0.1 },
// 	{ time: 0.48, voltage: 0.8 },
// 	{ time: 0.49, voltage: 0.994 },
// 	{ time: 0.5, voltage: 0.587 },
// 	{ time: 0.51, voltage: -0.219 },
// 	{ time: 0.52, voltage: -0.87 },
// 	{ time: 0.53, voltage: -0.965 },
// 	{ time: 0.54, voltage: -0.393 },
// 	{ time: 0.55, voltage: 0.467 },
// 	{ time: 0.56, voltage: 0.959 },
// 	{ time: 0.57, voltage: 0.894 },
// 	{ time: 0.58, voltage: 0.258 },
// 	{ time: 0.59, voltage: -0.551 },
// 	{ time: 0.6, voltage: -0.998 },
// 	{ time: 0.61, voltage: -0.726 },
// 	{ time: 0.62, voltage: 0.107 },
// 	{ time: 0.63, voltage: 0.805 },
// 	{ time: 0.64, voltage: 0.992 },
// 	{ time: 0.65, voltage: 0.603 },
// 	{ time: 0.66, voltage: -0.361 },
// 	{ time: 0.67, voltage: -0.985 },
// 	{ time: 0.68, voltage: -0.945 },
// 	{ time: 0.69, voltage: -0.441 },
// 	{ time: 0.7, voltage: 0.484 },
// 	{ time: 0.71, voltage: 0.956 },
// 	{ time: 0.72, voltage: 0.88 },
// 	{ time: 0.73, voltage: 0.237 },
// 	{ time: 0.74, voltage: -0.591 },
// 	{ time: 0.75, voltage: -0.999 },
// 	{ time: 0.76, voltage: -0.716 },
// 	{ time: 0.77, voltage: 0.12 },
// 	{ time: 0.78, voltage: 0.811 },
// 	{ time: 0.79, voltage: 0.989 },
// 	{ time: 0.8, voltage: 0.591 },
// 	{ time: 0.81, voltage: -0.387 },
// 	{ time: 0.82, voltage: -0.983 },
// 	{ time: 0.83, voltage: -0.938 },
// 	{ time: 0.84, voltage: -0.427 },
// 	{ time: 0.85, voltage: 0.5 },
// 	{ time: 0.86, voltage: 0.952 },
// 	{ time: 0.87, voltage: 0.866 },
// 	{ time: 0.88, voltage: 0.216 },
// 	{ time: 0.89, voltage: -0.63 },
// 	{ time: 0.9, voltage: -0.998 },
// 	{ time: 0.91, voltage: -0.707 },
// 	{ time: 0.92, voltage: 0.133 },
// 	{ time: 0.93, voltage: 0.817 },
// 	{ time: 0.94, voltage: 0.986 },
// 	{ time: 0.95, voltage: 0.578 },
// 	{ time: 0.96, voltage: -0.413 },
// 	{ time: 0.97, voltage: -0.98 },
// 	{ time: 0.98, voltage: -0.93 },
// 	{ time: 0.99, voltage: -0.412 },
// ];

// const roundOff: (num: number) => number = (num) => {
// 	return Math.round((num + Number.EPSILON) * 1000) / 1000;
// };

// const appendToFile = (sensorData: SensorDataType) => {
// 	const { voltage } = sensorData;

// 	const content = `${voltage}\n`;

// 	fs.appendFile('sensor.txt', content, function (err) {
// 		if (err) throw err;
// 		console.log('Saved!');
// 	});
// };

// let currentIndex = 0;

const sensorDataHandler = (io: Server) => {
	let fileSize = 0;
	let time = 0;
	// Listen for socket connections
	io.on('connection', (socket: Socket) => {
		logger.info('A client connected.');

		// Handle sensor data from the client
		socket.on('sensorDataFromPython', (data: SensorDataDocument) => {
			console.log('Received sensor data:', data);

			// Emit sensor data to connected clients via Socket.IO
			io.emit('sensorData', data);

			// Save sensor data to MongoDB
			SensorData.create(data)
				.then(() => logger.info('Sensor data saved to MongoDB'))
				.catch((err) =>
					logger.error('Error saving sensor data to MongoDB:', err)
				);
		});

		// const emitSensorData = () => {
		// 	const formattedSensorData = {
		// 		time: roundOff(sensorData[currentIndex].time * 100),
		// 		voltage: roundOff(sensorData[currentIndex].voltage * 5),
		// 	};
		// 	// appendToFile(formattedSensorData);
		// 	// io.emit('sensorData', formattedSensorData);
		// 	currentIndex = (currentIndex + 1) % sensorData.length;
		// };

		const filename = 'sensor.txt';
		// const interval = setInterval(emitSensorData, 1000);

		// const readFileAndEmit = () => {
		// 	try {
		// 		const data = fs.readFileSync(filename);
		// 		// Emit file content to clients
		// 		io.emit('fileData', data);
		// 	} catch (err) {
		// 		logger.error('Error reading file:', err);
		// 	}
		// };

		const readNewDataAndEmit = () => {
			fs.open(filename, 'r', (err, fd) => {
				if (err) {
					logger.error('Error opening file:', err);
					return;
				}
				fs.fstat(fd, (err, stats) => {
					if (err) {
						logger.error('Error getting file stats:', err);
						fs.close(fd, () => {});
						return;
					}
					// If file size has increased, read and emit new data
					if (stats.size > fileSize) {
						const bufferLength = stats.size - fileSize;
						const buffer = Buffer.alloc(bufferLength);
						fs.read(
							fd,
							buffer,
							0,
							buffer.length,
							fileSize,
							(err, bytesRead, data) => {
								if (err) {
									logger.error('Error reading file:', err);
									fs.close(fd, () => {});
									return;
								}
								if (bytesRead > 0) {
									// Emit new data to clients
									time += 1;
									const voltage = parseFloat(
										data.toString().trim()
									);
									io.emit('sensorData', { voltage, time });
								}
								fs.close(fd, () => {});
							}
						);
						fileSize = stats.size;
					} else {
						fs.close(fd, () => {});
					}
				});
			});
		};

		fs.watch(filename, (eventType) => {
			if (eventType === 'change') {
				readNewDataAndEmit();
			}
		});

		readNewDataAndEmit();

		socket.on('disconnect', () => {
			logger.info('A client disconnected.');
			// clearInterval(interval);
			// currentIndex = 0;
			time = 0;
		});
	});
};

const SensorController = { sensorDataHandler };

export default SensorController;
