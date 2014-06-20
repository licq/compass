'use strict';

var mongoose = require('mongoose'),
  Signup = mongoose.model('Signup'),
  _ = require('lodash'),
  jobs = require('../tasks/jobs');


exports.create = function (req, res) {
  if (req.session.captcha)
    if(!req.body.captcha || req.body.captcha.toLowerCase() !== req.session.captcha.toLowerCase()) {
    return res.send(400, {errors: {captcha: {message: '验证码不正确'}}});
  }
  var signup = new Signup(req.body);

  signup.save(function (err) {
    if (err) return res.json(400, err);
    jobs.sendSignupEmail(signup.adminName, signup.adminEmail, signup._id);
    res.json({email: signup.adminEmail});
  });
};

exports.activate = function (req, res, next) {
  Signup.findByIdAndRemove(req.params.code, function (err, signup) {
    if (err) return next(err);
    if (!signup) return res.json(404, {err: '没有找到激活码'});
    signup.activate(function (err) {
      if (err) return res.json(400, err);
      res.end();
    });
  });
};

