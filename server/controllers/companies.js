'use strict';

var mongoose = require('mongoose'),
  Company = mongoose.model('Company'),
  Email = mongoose.model('Email'),
  User = mongoose.model('User'),
  Resume = mongoose.model('Resume'),
  _ = require('lodash'),
  async = require('async');

var getEmailCount = function (company, cb) {
  Email.count({company: company._id}, function (err, count) {
    var c = company.toObject();
    c.emailCount = count;
    cb(err, c);
  });
};

var getUserCount = function (company, cb) {
  User.count({company: company._id}, function (err, count) {
    company.userCount = count;
    cb(err, company);
  });
};

var getResumeCount = function (company, cb) {
  Resume.count({company: company._id}, function (err, count) {
    company.resumeCount = count;
    cb(err, company);
  });
};

exports.list = function (req, res, next) {
  async.waterfall([
    function (cb) {
      Company.find({}).exec(cb);
    },
    function (companies, cb) {
      async.map(companies, getEmailCount, cb);
    },
    function (companies, cb) {
      async.map(companies, getUserCount, cb);
    },
    function (companies, cb) {
      async.map(companies, getResumeCount, cb);
    }
  ], function (err, companies) {
    if (err) return next(err);
    return res.json(companies);
  });
};

exports.get = function (req, res) {
  res.json(req.loadedCompany);
};

exports.load = function (req, res, next) {
  Company.findOne({_id: req.params.id})
    .select('name created')
    .exec(function (err, loadedCompany) {
      if (err) return next(err);
      if (!loadedCompany) return res.send(404, {message: 'not found'});
      req.loadedCompany = loadedCompany;
      next();
    });
};