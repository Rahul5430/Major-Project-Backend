import { UserDocument } from './src/types/modals';

declare global {
	namespace Express {
		interface Request {
			email: string;
			id: string;
			username: string;
		}
		interface User extends UserDocument {}
	}
}
