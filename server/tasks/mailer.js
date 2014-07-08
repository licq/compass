'use strict';

var nodemailer = require("nodemailer"),
  emailTemplates = require('swig-email-templates'),
  logger = require('../config/winston').logger();

var emailFrom, emailOptions, templateOptions, baseurl, smtpTransport, siteName;

function transport() {
  return smtpTransport || (smtpTransport = nodemailer.createTransport("SMTP", emailOptions));
}

function send(mail, cb) {
  transport().sendMail(mail, function (error, response) {
    if (error) {
      logger.error('Email sent to ' + mail.to + ' failed' + error);
    } else {
      logger.info("Email sent to " + mail.to + ' successfully with ' + response.message);
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
  emailFrom = config.emailOptions.from;
  emailOptions = config.emailOptions;
  templateOptions = {
    root: config.templatePath
  };
  baseurl = 'http://' + config.hostname + ':' + config.port + '/';
  siteName = config.siteName;
};

exports.sendSignupEmail = function sendSignupEmail(name, to, code, cb) {
  sendTemplateEmail(to, '欢迎您注册' + siteName + '请立即激活您的帐户', 'signup.html', {link: baseurl + '#/signup/activate?code=' + code, name: name, baseurl: baseurl, siteName: siteName}, cb);
};

exports.sendResetPasswordEmail = function sendResetPasswordEmail(name, to, code, cb) {
  sendTemplateEmail(to, '重设您在' + siteName + '的密码', 'reset.html', {link: baseurl + '#/forgot/reset?token=' + code, name: name,baseurl: baseurl, siteName: siteName}, cb);
};

exports.sendEmail = function sendEmail(mail, cb) {
  mail.from = emailFrom;
  send(mail, cb);
};