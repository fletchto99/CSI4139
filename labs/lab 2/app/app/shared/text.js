var config = require('../../config/app.json').twilio;
var twilio = require('twilio');

var client = new twilio(config.account, config.apikey);

module.exports = {

	message: (code, phonenumber) => {
		console.log(`code: ${code}, phone: ${phonenumber}`)
		client.messages.create({
		    body: `Your 2FA login code is: ${code}`,
		    to: phonenumber,
		    from: config.phone
		}).then((message, error) => {
			console.log(error)
		});
	}

};
