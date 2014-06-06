'use strict';

var mongoose = require('mongoose'),
  Email = mongoose.model('Email'),
  Resume = mongoose.model('Resume'),
  kue = require('kue'),
  jobs = require('../tasks/jobs'),
  _ = require('lodash'),
  logger = require('../config/winston').logger(),
  async = require('async');

exports.recreateAllJobs = function (req, res, next) {
  kue.redis.client().flushdb(function (err) {
    if (err) return next(err);
    Email.find(function (err, emails) {
      async.eachSeries(emails, function (email, cb) {
        jobs.addFetchEmailJob(email, cb);
      }, function () {
        res.send(200);
      });
    });
  });
};

exports.recreateFetchEmailJobs = function (req, res, next) {
  kue.Job.rangeByType('fetch email', 'active', 0, 1000, 'asc', function (err, activeJobs) {
    if (err) return next(err);
    async.eachSeries(activeJobs, function (job, cb) {
      job.remove(cb);
    }, function (err) {
      if (err) return next(err);
      kue.Job.rangeByType('fetch email', 'active', 0, 1000, 'asc', function (err, activeJobs) {
        async.eachSeries(activeJobs, function (job, cb) {
          job.remove(cb);
        }, function (err) {
          if (err) return next(err);
          Email.find(function (err, emails) {
            if (err) return next(err);
            async.eachSeries(emails, function (email, cb) {
              jobs.addFetchEmailJob(email, cb);
            }, function () {
              res.send(200);
            });
          });
        });
      });
    });
  });
};

exports.synchronizeEsToDb = function (req, res) {
  Resume.recreateIndex(function (err) {
    if (err) {
      logger.error('recreate elasticsearch index failed: ', err);
    }
    Resume.synchronize(function (err, results) {
      if (err) logger.error('synchronize error:', err);
      logger.info('synchronize elasticsearch using ', results, 'ms');
      res.send(200);
    });
  });
};
