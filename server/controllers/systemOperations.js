'use strict';

var mongoose = require('mongoose'),
  Resume = mongoose.model('Resume'),
  Mail = mongoose.model('Mail'),
  jobs = require('../tasks/jobs'),
  logger = require('../config/winston').logger();

exports.recreateAllJobs = function (req, res, next) {
  jobs.recreateAllJobs(function (err) {
    if (err) return next(err);
    res.send(200);
  });
};

exports.recreateFetchEmailJobs = function (req, res, next) {
  jobs.recreateFetchEmailJobs(function (err) {
    if (err) return next(err);
    res.send(200);
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

exports.reparseMails = function (req, res, next) {
  var stream = Mail.find().select('html subject company fromAddress createdAt').stream();
  stream.on('data', function (mail) {
    jobs.addParseResumeJob(mail);
  }).on('close', function () {
    res.send(200);
  });
};