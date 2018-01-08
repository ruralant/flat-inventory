const {exec} = require('child-process-promise');

function createEmail(sender, receiver, subject, content) {
	exec(`sendEmail -o tls=yes -f ${process.env.USEREMAIL} -t ${receiver} -s ${process.env.HOSTEMAIL} -xu ${process.env.USEREMAIL} -xp ${process.env.USERPASSWORD} -u ${subject} -m ${content}`)
		.then(result => console.log('Email sent'))
		.catch(e => console.log(e));
}

function sendEmail(req) {
	let sender = process.env.USEREMAIL;
	let receiver = req.body.receiver || process.env.PRODUCTIONADMINEMAILTO;	
	let firstName = req.body.firstName;
	let lastName = req.body.lastName;
	let emailSubject;
	let emailContent;

	if (req.body.type === 'passwordReset') {
		let url = req.body.emailURL;
		let host = req.body.host;
		emailSubject = 'Password reset';
		emailContent = `A password reset has been requested with this email address. Please follow the url http://${host}${url} to create a new one`;		
	} else {
		let url = req.body.url;
		emailSubject = 'New User Created';
		emailContent = `The new user ${firstName} ${lastName} has been created. Please follow the url ${url} and login with your email and as passphrase the word "password". Remember to change it once you are logged in.`;
	}
	createEmail(sender, receiver, emailSubject, emailContent);
}

module.exports = { sendEmail };