"use strict";

var kue = require('kue'),
  mongoose = require('mongoose'),
  Email = mongoose.model('Email'),
  _ = require('lodash'),
  async = require('async'),
  Job = kue.Job,
  logger = require('../config/winston').logger();

var jobs = kue.createQueue();

exports.sendSignupEmail = function sendSignupEmail(name, to, code) {
  jobs.create('send signup email', {
    title: 'send signup email to ' + to,
    to: to,
    name: name,
    code: code
  }).priority('high').attempts(3).save();
};

exports.sendResetPasswordEmail = function sendResetPasswordEmail(name, to, token) {
  jobs.create('send resetPassword email', {
    title: 'send resetPassword email to ' + to,
    to: to,
    name: name,
    token: token
  }).priority('high').attempts(3).save();
};

jobs.on('job complete', function (id) {
  Job.get(id, function (err, job) {
    if (err) return;
    logger.info(job.data.title, 'complete');
    if (job.type === 'fetch email') {
      jobs.create('fetch email', job.data).delay(1000 * 60 * 30).save(function (err) {
        if (err) logger.error('job create failed because of ', err);
      });
    }
  });
});

jobs.on('job failed', function (id) {
  Job.get(id, function (err, job) {
    if(err) return;
    logger.error(job.data.title, 'failed ');
  });
});

exports.addFetchEmailJob = function addFetchEmailJob(email, done) {
  jobs.create('fetch email', {
    id: email.id,
    title: 'fetch email from ' + email.address
  }).save(function (err) {
    if (err) logger.error('job save failed because of', err);
    done && done(err);
  });
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