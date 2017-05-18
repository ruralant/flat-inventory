const nodemailer = require('nodemailer');

function sendEmail(req, res, next) {
	console.log(req.body);
	const mailTransport = nodemailer.createTransport({
		host: process.env.HOSTEMAIL,
		port: 587,
		secure: false,
		ignoreTLS: true,
		auth: {
			user: process.env.USEREMAIL,
			pass: process.env.USERPASSWORD
		}
	});
	const mailOptions = {};
	const receiver = req.body.receiver;
	const firstName = req.body.firstName;
	const lastName = req.body.lastName;
	const sender = req.body.sender;
	const url = req.body.emailURL;
	const host = req.body.host;
	mailOptions.from = receiver;
	mailOptions.to = receiver;
	mailOptions.subject = 'Password reset';
	mailOptions.text = `A password reset has been requested with this email address. Please follow the url http://${host}${url}`;

	mailTransport.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log('Error: ', error);
		}
		console.log('Message sent: ' + info.response);
	});
	return;
}

module.exports = {
	sendEmail
};