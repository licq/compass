"use strict";

var kue = require('kue'),
  mailer = require('./mailer'),
  mongoose = require('mongoose'),
  Email = mongoose.model('Email'),
  _ = require('lodash'),
  emailFetcher = require('./emailFetcher'),
  delayedJobs = require('./jobs'),
  logger = require('../config/winston').logger(),
  parser = require('../parsers/resumeParser'),
  Mail = mongoose.model('Mail'),
  Resume = mongoose.model('Resume');

var jobs;

function handleSendSignupEmail(job, done) {
  mailer.sendSignupEmail(job.data.name, job.data.to, job.data.code, done);
}

function handleSendResetPasswordEmail(job, done) {
  mailer.sendResetPasswordEmail(job.data.name, job.data.to, job.data.token, done);
}

function handleFetchEmail(job, done) {
  logger.info(job.data.title, ' start');
  Email.findById(job.data.id, function (err, email) {
    if (err) return done(err);
    if (!email) return done('email ' + job.data.id + ' not found');

    emailFetcher.fetch(email, function (err, count) {
      email.lastRetrieveCount = count;
      email.lastRetrieveTime = new Date();
      email.lastError = err;
      if (!err) {
        email.totalRetrieveCount += count;
      }
      email.save(function (err) {
        if (err) logger.error('save email failed ', email.address, ' because ', err);
        delayedJobs.addFetchEmailJob(email, 30, done);
      });
    });
  });
}

function handleSendEmail(job, done) {
  logger.info('handleSendEmail ', job.data.title);
  mailer.sendEmail(job.data, done);
}

function handleParseResume(job, done) {
  logger.info('handleParseResume ', job.data.title);
  var data = parser.parse(job.data);
  data.createdAt = job.data.createdAt;
  var parseErrors = data.parseErrors;
  delete data.parseErrors;

  Resume.createOrUpdateAndIndex(data, function (err) {
    if (err) {
      if (err.code === 11000 || err.code === 11001) {
        logger.error('resume duplication of ', data.name);
      } else {
        logger.error('save resume to db failed ', err.stack);
      }
    }

    if (parseErrors.length > 0) {
      Mail.findById(job.data.mailId).exec(function (err, mail) {
        if (err) return done(err);
        mail.parseErrors = parseErrors;
        mail.save(done);
      });
    } else {
      done(err);
    }
  });
}

exports.start = function (config) {
  jobs = kue.createQueue({
    prefix: config.redis.prefix,
    redis: {
      port: config.redis.port,
      host: config.redis.host
    }
  });

  jobs.on('error', function (error) {
    logger.error('job error', error);
  });

  jobs.process('send signup email', 20, handleSendSignupEmail);

  jobs.process('send resetPassword email', 20, handleSendResetPasswordEmail);

  jobs.process('send email', 20, handleSendEmail);

  jobs.process('fetch email', 20, handleFetchEmail);

  jobs.process('parse resume', 10, handleParseResume);

  jobs.promote(60000, 200);
};

exports.stop = function () {
  jobs.shutdown(function (err) {
    logger.info('Kue is shut down.', err || '');
    process.exit(0);
  }, 5000);
};