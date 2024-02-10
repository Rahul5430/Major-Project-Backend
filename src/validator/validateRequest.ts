import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

const validationRequest = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		console.log(errors.array()[0].msg);
		return res.status(400).json({ message: errors.array()[0].msg });
	}

	next();
};

export default validationRequest;
