'use strict';

var mongoose = require('mongoose'),
  Company = mongoose.model('Company'),
  Email = mongoose.model('Email'),
  User = mongoose.model('User'),
  Resume = mongoose.model('Resume'),
  Interview = mongoose.model('Interview'),
  _ = require('lodash'),
  async = require('async');

exports.list = function (req, res, next) {
  async.series([
    function (cb) {
      Company.find({}).select('name createdAt').exec(function (err, companies) {
        cb(err, _.map(companies, function (c) {
          return c.toObject();
        }));
      });
    },
    function (cb) {
      Email.aggregate().group({_id: '$company', emailCount: {$sum: 1}}).exec(cb);
    },
    function (cb) {
      User.aggregate().group({_id: '$company', userCount: {$sum: 1}}).exec(cb);
    },
    function (cb) {
      Resume.aggregate().group({_id: '$company', resumeCount: {$sum: 1}}).exec(cb);
    },
    function (cb) {
      Interview.aggregate().group({_id: '$company', interviewCount: {$sum: 1}}).exec(cb);
    }
  ], function (err, results) {
    if (err) return next(err);
    if (results.length > 0) {
      results = _.groupBy(_.flatten(results), '_id');
      results = _.map(results, function (result) {
        return _.reduce(result, function (s, r) {
          return _.merge(s, r);
        }, {});
      });
    }
    return res.json(results);
  });
};

exports.get = function (req, res) {
  res.json(req.loadedCompany);
};

exports.load = function (req, res, next) {
  Company.findOne({_id: req.params.id})
    .select('name createdAt')
    .exec(function (err, loadedCompany) {
      if (err) return next(err);
      if (!loadedCompany) return res.send(404, {message: 'not found'});
      req.loadedCompany = loadedCompany;
      next();
    });
};