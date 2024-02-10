import mongoose from 'mongoose';

import { UserDocument } from '../types/modals';

const { Schema } = mongoose;

mongoose.set('debug', true);

const userSchema = new Schema<UserDocument>(
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
		password: {
			type: String,
			required: true,
			trim: true,
		},
	},
	{ timestamps: true }
);

const User = mongoose.model<UserDocument>('User', userSchema);

export default User;
