'use strict';

var mongoose = require('mongoose'),
  Token = mongoose.model('Token'),
  User = mongoose.model('User'),
  _ = require('lodash'),
  jobs = require('../tasks/jobs'),
  uuid = require('node-uuid');


exports.create = function (req, res) {
  if (req.session.captcha)
    if (!req.body.captcha || req.body.captcha.toLowerCase() !== req.session.captcha.toLowerCase()) {
      return res.send(400, {errors: {captcha: {message: '验证码不正确'}}});
    }
  var token = uuid.v1();
  User.findOneAndUpdate({email: req.body.email}, {token: token}, function (err, user) {
    if (err) return res.json(400, err);
    if (user) {
      jobs.sendResetPasswordEmail(user.name, user.email, token);
      res.end();
    } else res.end();
  });
};

exports.reset = function (req, res) {
  if (req.body.token) {
    User.findOne({token: req.body.token}, function (err, user) {
      if (err) return res.json(400, err);
      if (user) {
        user.password = req.body.password;
        user.token = undefined;
        user.save(function (err) {
          if (err) return res.json(500, 'Internal Server Error');
          res.end();
        });
      } else res.json(400, {errors: {message: '重置链接无效'}});
    });
  } else res.json(400, {errors: {message: '重置链接无效'}});
};

