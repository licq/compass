var nodemailer = require("nodemailer"),
    emailTemplates = require('swig-email-templates');


var emailFrom, emailOptions, templateOptions, baseurl, smtpTransport;

function init(config) {
    emailFrom = config.emailFrom;
    emailOptions = config.emailOptions;
    templateOptions = {
        root: config.templatePath
    };

    baseurl = 'http://' + config.hostname + ':' + config.port + '/';
}

function transport() {
    return smtpTransport || (smtpTransport = nodemailer.createTransport("SMTP", emailOptions));
}

function sendEmail(to, subject, template, context, cb) {
    emailTemplates(templateOptions, function (err, render) {
        render(template, context, function (err, html) {
            var mail = {
                from: emailFrom,
                to: to,
                subject: subject,
                html: html
            };
            transport().sendMail(mail, function (error, response) {
                if (error) {
                    console.error('Email sent to ' + to + 'failed' + error);
                } else {
                    console.log("Email sent to " + to + 'successfully with ' + response.message);
                }
                if (cb) return cb(error);
            });
        });
    });
}

function sendSignupEmail(to, code, cb) {
    sendEmail(to, '已注册，请激活', 'signup.html', {link: baseurl + 'signup/activate/' + code}, cb);
}

module.exports = {
    init: init,
    sendSignupEmail: sendSignupEmail
};

