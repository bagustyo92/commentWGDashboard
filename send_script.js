var nodemailer = require("nodemailer");

var smtpTransport = nodemailer.createTransport("SMTP", {
	service: "Gmail",
	auth: {
		XOAuth2: {
			user: "muhammad.irfan.reza@gmail.com",
			clientId: "984749299924-qtkntfh3m6bg6m7rcuan3u6g8qqdf0m3.apps.googleusercontent.com",
			clientSecret: "6qBxaTumDiAr-L8TL3ogwGwe",
			refreshToken: "1/HZDUYXQW7q_Tk6yW__qMgjFbTaBev_XfmAdAb1p6VAM"
		}
	}
});

var mailOptions = {
	from: "muhammad.irfan.reza@gmail.com",
	to: "irfanluckyboys@gmail.com, irfanreza@live.com",
	subject: "Hello Wolrd",
	text : "Just Try Sending an Email using nodemailer"
	// generateTextFromHTML: true,
	// html: "<b>Hello World</b>"
};

smtpTransport.sendMail(mailOptions, function(err, res) {
	if(err) {
		console.log(err);
	} else {
		console.log(res);
	}
	smtpTransport.close();
})