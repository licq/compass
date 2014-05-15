"use strict";

var kue = require('kue'),
  mailer = require('./mailer'),
  mongoose = require('mongoose'),
  Email = mongoose.model('Email'),
  _ = require('lodash'),
  emailFetcher = require('./emailFetcher'),
  logger = require('../config/winston').logger(),
  parser = require('../parsers/resumeParser'),
  Resume = mongoose.model('Resume');

var jobs = kue.createQueue();

function handleSendSignupEmail(job, done) {
  mailer.sendSignupEmail(job.data.to, job.data.code, done);
}

function handleFetchEmail(job, done) {
  logger.info('handleFetchEmail ', job.data);
  emailFetcher.fetch(job.data, function (err, count) {
    Email.setActivity({
      time: Date.now(),
      count: count,
      error: err,
      address: job.data.address
    }, function (error) {
      logger.error('handle Fetch Email from ', job.data, error);
      done(err);
    });
  });
}

function handleSendEmail(job, done) {
  logger.info('handleSendEmail ', job.data.title);
  mailer.sendEmail(job.data, done);
}


function handleParseResume(job, done) {
  logger.info('handleParseResume ', job.data.title);
  try {
    Resume.createOrUpdateAndIndex(parser.parse(job.data), function (err) {
      done(err);
    });
  } catch (err) {
    job.error('error:', err.stack);
    done(err);
  }
}

exports.start = function () {
  jobs.on('error', function (error) {
    logger.error('job error', error);
  });

  jobs.process('send signup email', 20, handleSendSignupEmail);

  jobs.process('send email', 20, handleSendEmail);

  jobs.process('fetch email', 20, handleFetchEmail);

  jobs.process('parse resume', 20, handleParseResume);

  jobs.promote(60000, 200);
};

exports.stop = function () {
  jobs.shutdown(function (err) {
    logger.info('Kue is shut down.', err || '');
    process.exit(0);
  }, 5000);
};