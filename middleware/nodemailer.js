const nodemailer = require('nodemailer');
const User = require('../models/User');

const { logger } = require('./logger');

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.EMAIL_FROM,
		pass: process.env.EMAIL_FROM_PASSWORD,
	},
});

exports.sendVerifyMail = async (params) => {
	try {
		const info = await transporter.sendMail({
			from: process.env.EMAIL_FROM,
			to: params.to, // list of receivers
			subject: 'Welcome to Wireless Geophone Sensor System!', // Subject line
			html: `
				<div
					class="container"
					style="
						max-width: 600px;
						margin: auto;
						padding: 20px;
						border: 1px solid #ddd;
						border-radius: 10px;
						text-align: center;
						font-family: Arial, sans-serif;
					"
				>
					<h2>Email Verification Code</h2>
					<p>To complete the registration process, please enter the following code in the app:</p>
					<div
						style="
							font-size: 24px;
							color: #333;
							background-color: #f9f9f9;
							border: 1px solid #ddd;
							padding: 10px;
							margin: 10px 0;
							border-radius: 5px;
							letter-spacing: 2px;
						"
					>
						${params.OTP}
					</div>
					<p>If you didn't request this, feel free to ignore this email.</p>
					<p>Thank you
				</div>
			`,
		});
		return info;
	} catch (error) {
		logger.error(error);
		return false;
	}
};

exports.verifyEmail = async (email, otp) => {
	const user = await User.findOne({
		email,
	});
	// get user and check otp
	if (!user) {
		return [null, 'User not found'];
	}
	if (user && user.otp !== otp) {
		return [null, 'Invalid OTP'];
	}
	return [user, null];
};

exports.sendForgotMail = async (params) => {
	try {
		const info = await transporter.sendMail({
			from: process.env.EMAIL_FROM,
			to: params.to, // list of receivers
			subject: 'Password Reset', // Subject line
			html: `
      <div
        class="container"
        style="
          max-width: 600px;
          margin: auto;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 10px;
          text-align: center;
          font-family: Arial, sans-serif;
        "
      >
        <h2>Password Reset Code</h2>
        <p>To reset your password, please enter the following code in the app:</p>
        <div
          style="
            font-size: 24px;
            color: #333;
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            padding: 10px;
            margin: 10px 0;
            border-radius: 5px;
            letter-spacing: 2px;
          "
        >
          ${params.OTP}
        </div>
        <p>If you didn't request a password reset, please ignore this email or contact support.</p>
        <p>Thank you</p>
      </div>
    `,
		});
		return info;
	} catch (error) {
		logger.error(error);
		return false;
	}
};
