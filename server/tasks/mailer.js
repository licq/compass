'use strict';

var nodemailer = require("nodemailer"),
  emailTemplates = require('swig-email-templates'),
  logger = require('../config/winston').logger();

var emailFrom, emailOptions, templateOptions, baseurl, smtpTransport;

function transport() {
  return smtpTransport || (smtpTransport = nodemailer.createTransport("SMTP", emailOptions));
}

function send(mail, cb) {
  transport().sendMail(mail, function (error, response) {
    if (error) {
      logger.error('Email sent to ' + mail.to + 'failed' + error);
    } else {
      logger.info("Email sent to " + mail.to + 'successfully with ' + response.message);
    }
    if (cb) return cb(error);
  });
}
function sendTemplateEmail(to, subject, template, context, cb) {
  emailTemplates(templateOptions, function (err, render) {
    render(template, context, function (err, html) {
      var mail = {
        from: emailFrom,
        to: to,
        subject: subject,
        html: html
      };
      send(mail, cb);
    });
  });
}

exports.init = function init(config) {
  emailFrom = config.emailFrom;
  emailOptions = config.emailOptions;
  templateOptions = {
    root: config.templatePath
  };

  baseurl = 'http://' + config.hostname + ':' + config.port + '/';
};

exports.sendSignupEmail = function sendSignupEmail(to, code, cb) {
  sendTemplateEmail(to, '已注册，请激活', 'signup.html', {link: baseurl + '/#/signup/activate?code=' + code}, cb);
};

exports.sendEmail = function sendEmail(mail, cb) {
  mail.from = emailFrom;
  send(mail, cb);
};