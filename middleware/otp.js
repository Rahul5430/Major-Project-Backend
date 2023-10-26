const otpGenerator = require('otp-generator');

module.exports.generateOTP = () => {
	const OTP = otpGenerator.generate(10, {
		upperCaseAlphabets: false,
		specialChars: false,
	});
	return OTP;
};