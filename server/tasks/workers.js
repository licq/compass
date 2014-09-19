"use strict";

var kue = require('kue'),
  mailer = require('./mailer'),
  mongoose = require('mongoose'),
  Email = mongoose.model('Email'),
  Position = mongoose.model('Position'),
  _ = require('lodash'),
  pop3Fetcher = require('./pop3Fetcher'),
  imapFetcher = require('./imapFetcher'),
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
    var fetcher;
    if (email.protocol === 'imap') {
      fetcher = imapFetcher;
    } else {
      fetcher = pop3Fetcher;
    }

    fetcher.fetch(email, function (err, count, retrievedMails) {
      email.lastRetrieveCount = count;
      email.lastRetrieveTime = new Date();
      email.lastError = err;
      if (!err) {
        email.totalRetrieveCount += count;
        email.retrievedMails = retrievedMails;
        email.markModified('retrievedMails');
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
  try {
    logger.info('handleParseResume ', job.data.title);
    var data = parser.parse(job.data);
    data.applyDate = job.data.date;
    var parseErrors = data.parseErrors;
    delete data.parseErrors;
    Position.findOne({alias: data.applyPosition}, function (err, position) {
      if (err) return done(err);
      if (position)
        data.applyPosition = position.name;
      Resume.createOrUpdateAndIndex(data, function (err) {
        if (err) {
          logger.error('save resume to db failed ', err.stack);
        }

        Mail.findById(job.data.mailId).exec(function (err, mail) {
          if (err) return done(err);
          mail.parseErrors = parseErrors;
          mail.markModified('parseErrors');
          mail.save(done);
        });
      });
    });
  } catch (e) {
    done(e.message);
    logger.error('handleParseResume failed: ' + job.data.title + ':' + e.message);
  }
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

  return jobs;
};


