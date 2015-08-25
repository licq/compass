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
  async = require('async'),
  parser = require('../parsers/remoteResumeParser'),
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
        //delayedJobs.addFetchEmailJob(email, 30, done);
        done();
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
    logger.info('handleParseResume starts.job id: ' + job.id + ' ' + job.data.subject);
    parser.parse(job.data, function (err, resume) {
      var parseErrors = err;
      async.parallel({
        saveMail: function (callback) {
          Mail.findById(job.data.mailId).exec(function (err, mail) {
            if (err || !mail) {
              logger.error('no mail found for ' + job.data.subject + '.job id: ' + job.id + ' ' + err);
              return callback(null);
            }
            mail.parseErrors = parseErrors;
            mail.markModified('parseErrors');
            //mail.save(done);
            mail.save(function (err) {
              if (err)
                logger.error('save mail ' + job.data.subject + 'to db failed.job id: ' + job.id + ' ' + err);
              callback(null);
            });
          });
        },
        saveResume: function (callback) {
          if (!(resume && resume.name && (resume.mobile || resume.phone))) {
            logger.info('handleParseResume ends without result.job id: ' + job.id + ' subject:' + job.data.title);
            return callback(null, null);
          }
          logger.info('parsed resume: ' + job.data.subject + '.job id: ' + job.id + '.resume name: ' + resume.name);
          logger.info();
          resume.parseErrors = parseErrors;
          delete resume.parseErrors;
          resume.applyDate = job.data.date;

          Position.findOne({'aliases.name': resume.applyPosition}, function (err, position) {
            if (err) {
              logger.error('find position for ' + job.data.title + ' failed.job id: ' + job.id + ' ' + err.stack);
              return callback(err, null);
            }
            if (position)
              resume.applyPosition = position.name;
            Resume.createOrUpdateAndIndex(resume, function (err) {
              if (err) {
                logger.error('save resume ' + job.data.subject + 'to db failed.job id: ' + job.id + ' ' + err.stack);
              }
              return callback(err, resume);
            });
          });
        }
      }, function (err, results) {
        if (!err && results.saveResume) {
          logger.info('handleParseResume ends successfully.job id: ' + job.id + ' subject:' + job.data.title);
        }
        done(err);
      });

    });
  } catch (e) {
    done(e.message);
    logger.error('handleParseResume failed. ' + 'job id:' + job.id + job.data.title + ':' + e.message);
  }
}

exports.handleParseResume = handleParseResume;
exports.start = function (config) {
  jobs = kue.createQueue({
    prefix: config.redis.prefix,
    redis: {
      port: config.redis.port,
      host: config.redis.host,
      options: config.redis.options
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