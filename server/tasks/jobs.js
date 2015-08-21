"use strict";

var kue = require('kue'),
  mongoose = require('mongoose'),
  _ = require('lodash'),
  async = require('async'),
  Job = kue.Job,
  logger = require('../config/winston').logger();

var jobs;

exports.sendSignupEmail = function sendSignupEmail(name, to, code) {
  jobs.create('send signup email', {
    title: 'send signup email to ' + to,
    to: to,
    name: name,
    code: code
  }).priority('high').attempts(3).save();
};

exports.createSendEmailJob = function (emails) {
  if (!Array.isArray(emails)) {
    emails = [emails];
  }
  _.forEach(emails, function (email) {
    email.title = 'send Event Alert Email to ' + email.to;
    jobs.create('send email', email).save();
  });
};

exports.sendResetPasswordEmail = function sendResetPasswordEmail(name, to, token) {
  jobs.create('send resetPassword email', {
    title: 'send resetPassword email to ' + to,
    to: to,
    name: name,
    token: token
  }).priority('high').attempts(3).save();
};

exports.addFetchEmailJob = function addFetchEmailJob(email, minutes, done) {
  if (!done && typeof minutes === 'function') {
    done = minutes;
    minutes = 0;
  }
  var job = jobs.create('fetch email', {
    id: email.id,
    title: 'fetch email from ' + email.address
  });
  if (minutes) job.delay(1000 * 60 * minutes);
  job.on('complete', function (result) {
    logger.info(job.data.title, 'complete with result:', result);
  });

  job.on('failed', function () {
    logger.error(job.data.title, 'failed ');
  });

  job.save(function (err) {
    if (err) logger.error('job create failed because of ', err);
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
          mongoose.model('Email').find(function (err, emails) {
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
    mongoose.model('Email').find(function (err, emails) {
      async.eachSeries(emails, function (email, cb) {
        exports.addFetchEmailJob(email, cb);
      }, function (err) {
        done && done(err);
      });
    });
  });
};

exports.addParseResumeJob = function (mail, cb) {
  if (mail) {
    logger.info('addParseResumeJob:', mail.subject);
    var data = {
      html: mail.html,
      title: mail.subject,
      subject: mail.subject,
      company: mail.company,
      mailId: mail._id,
      fromAddress: mail.fromAddress,
      attachments: mail.attachments,
      date: mail.date
    };
    var job = jobs.create('parse resume', data).attempts(3).save(function (err) {
      if (!err) logger.info('handleParseResume job added.' + 'job id:' + job.id + ' ' + job.data.title);
    });
  }
  cb && cb();
};

exports.inactiveCount = function inactiveCount(cb) {
  jobs.inactiveCount(cb);
};

exports.init = function (config) {
  jobs = kue.createQueue({
    prefix: config.redis.prefix,
    redis: {
      port: config.redis.port,
      host: config.redis.host,
      options: config.redis.options
    }
  });
};