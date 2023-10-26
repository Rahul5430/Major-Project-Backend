const mongoose = require('mongoose');

const { Schema } = mongoose;
const { paginate } = require('../middleware/pagination');

mongoose.set('debug', true);

const userSchema = new Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			minlength: 3,
			maxlength: 20,
		},
		name: {
			type: String,
			required: true,
			trim: true,
			minlength: 3,
			maxlength: 50,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
		},
		googleId: {
			type: String,
		},
		phone: {
			type: String,
			unique: true,
			sparse: true,
			minlength: 10,
			maxlength: 15,
		},
		isPhoneVerified: {
			type: Boolean,
			required: true,
			default: false,
		},
		password: {
			type: String,
			required: true,
			trim: true,
		},
		otp: { type: String },
		verified: {
			type: Boolean,
			required: true,
			default: false,
		},
		role: {
			type: String,
			enum: ['user', 'admin'],
			default: 'user',
		},
	},
	{ timestamps: true }
);

userSchema.plugin(paginate);

const User = mongoose.model('User', userSchema);

module.exports = User;
