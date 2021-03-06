'use strict';

var mongoose = require('mongoose'),
  Email = mongoose.model('Email'),
  _ = require('lodash'),
  jobs = require('../tasks/jobs');

exports.list = function (req, res, next) {
  Email.find({company: req.user.company})
    .select('-retrievedMails')
    .exec(function (err, emails) {
      if (err) return next(err);
      return res.json(emails);
    });
};

exports.count = function (req, res, next) {
  Email.count(function (err, count) {
    if (err) return next(err);
    res.json({emailCount: count});
  });
};

exports.create = function (req, res) {
  var email = new Email(req.body);
  email.company = req.user.company;
  email.createdBy = req.user._id;
  email.verify(function (err) {
    if (err) return res.json(400, err);
    email.save(function (err) {
      if (err) {
        if (err.code === 11000 || err.code === 11001) {
          return res.json(400, {message: '邮箱地址已经存在'});
        } else {
          return res.json(400, {message: err.message});
        }
      }
      jobs.addFetchEmailJob(email);
      res.end();
    });
  });
};

exports.delete = function (req, res, next) {
  req.email.remove(function (err) {
    if (err) return next(err);
    res.end();
  });
};

exports.get = function (req, res) {
  res.json(req.email);
};

exports.update = function (req, res) {
  _.merge(req.email, req.body);
  req.email.verify(function (err) {
    if (err) return res.json(400, err);
    req.email.lastError = err;
    req.email.save(function (err) {
      if (err) return res.json(400, err);
      res.end();
    });
  });
};

exports.load = function (req, res, next) {
  Email.findOne({_id: req.params.id, company: req.user.company})
    .select('-retrievedMails')
    .exec(function (err, email) {
      if (err) return next(err);
      if (!email) return res.send(404, {message: 'not found'});
      req.email = email;
      next();
    });
};