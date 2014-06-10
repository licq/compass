"use strict";

var kue = require('kue'),
  mongoose = require('mongoose'),
  Email = mongoose.model('Email'),
  _ = require('lodash'),
  async = require('async'),
  Job = kue.Job,
  logger = require('../config/winston').logger();

var jobs = kue.createQueue();

exports.sendSignupEmail = function sendSignupEmail(to, code) {
  jobs.create('send signup email', {
    title: 'send signup email to ' + to,
    to: to,
    code: code
  }).priority('high').attempts(3).save();
};

exports.addFetchEmailJob = function addFetchEmailJob(email, done) {
  var data = {
    server: email.server,
    address: email.address,
    account: email.account,
    password: email.password,
    port: email.port,
    title: 'fetch email from ' + email.address,
    ssl: email.ssl,
    id: email.id
  };

  var fetchEmailAfter = function (minutes, callback) {
    var job = jobs.create('fetch email', data);
    if (minutes) {
      job.delay(1000 * 60 * minutes);
    }

    job.on('complete', function () {
      logger.info('Fetch ' + email.address + ' complete');
      job.remove(function () {
        fetchEmailAfter(30);
      });
    });
    job.on('failed', function () {
      logger.info('Fetch ' + email.address + ' failed');
      job.remove(function () {
        fetchEmailAfter(30);
      });
    });

    job.save(function (err) {
      if (err) logger.error('job save failed because of', err);
      if (callback) callback(err);
    });
  };

  fetchEmailAfter(0, done);
};

exports.removeFetchEmailJob = function removeFetchEmailJob(email, cb) {
  Job.remove(email.id, cb);
};

exports.findFetchEmailJob = function findFetchEmailJob(email, cb) {
  Job.get(email.id, cb);
};

exports.recreateFetchEmailJobs = function (done) {
  kue.Job.rangeByType('fetch email', 'active', 0, 1000, 'asc', function (err, activeJobs) {
    if (err) return done(err);
    async.eachSeries(activeJobs, function (job, cb) {
      job.remove(cb);
    }, function (err) {
      if (err) return done(err);
      kue.Job.rangeByType('fetch email', 'delayed', 0, 1000, 'asc', function (err, delayed) {
        async.eachSeries(delayed, function (job, cb) {
          job.remove(cb);
        }, function (err) {
          if (err) return done(err);
          Email.find(function (err, emails) {
            if (err) return done(err);
            async.eachSeries(emails, function (email, cb) {
              exports.addFetchEmailJob(email, cb);
            }, function (err) {
              done && done(err);
            });
          });
        });
      });
    });
  });
};

exports.recreateAllJobs = function (done) {
  kue.redis.client().flushdb(function (err) {
    if (err) return done(err);
    Email.find(function (err, emails) {
      async.eachSeries(emails, function (email, cb) {
        exports.addFetchEmailJob(email, cb);
      }, function (err) {
        done && done(err);
      });
    });
  });
};

exports.addParseResumeJob = function (mail, cb) {
  logger.info('addParseResumeJob:', mail.subject);
  var data = {
    html: mail.html,
    title: mail.subject,
    subject: mail.subject,
    company: mail.company,
    mailId: mail._id,
    fromAddress: mail.fromAddress,
    createdAt: mail.createdAt
  };
  jobs.create('parse resume', data).attempts(3).save();
  cb && cb();
};

exports.start = function () {
  exports.recreateFetchEmailJobs();
};