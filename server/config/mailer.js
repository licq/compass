var nodemailer = require("nodemailer");

function Mailer() {

}

Mailer.prototype.init = function (config) {
    this.config = config;
    this.smtpTransport = nodemailer.createTransport("SMTP", config.emailOptions);
};

Mailer.prototype.close = function () {
    this.smtpTransport.close();
};

Mailer.prototype.sendEmail = function (to, subject, content, cb) {

    var mailProperties = {
        from: this.config.emailFrom,
        to: to,
        subject: subject,
        html: content
    };
    console.log('sendEmail ', mailProperties);

    this.smtpTransport.sendMail(mailProperties, function (error, response) {
        if (error) {
            console.error('Email sent to ' + to + 'failed' + error);
        } else {
            console.log("Email sent to " + to + 'successfully with ' + response.message);
        }
        if (cb) return cb();
    });
};
module.exports = new Mailer();

