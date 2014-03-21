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

    this.smtpTransport.sendMail(mailProperties, function (error, response) {
        if (error) {
            console.error('Email sent to ' + to + 'failed' + error);
        } else {
            console.log("Email sent to " + to + 'successfully with ' + response.message);
        }
        if (cb) return cb(error);
    });
};

Mailer.prototype.sendSignupEmail = function (email, code, cb) {
    this.sendEmail(email, '已注册，请激活', this.generateEmailContent(code), cb);
};

Mailer.prototype.generateEmailContent = function (code) {
    return '<html><head></head><body><a href="http://' + this.config.hostname + ':' + this.config.port + '/signup/activate/'
        + code + "\">激活</a></body></html>";
};

module.exports = new Mailer();

