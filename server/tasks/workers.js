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

exports.start = function () {
    jobs.on('error', function (error) {
        logger.log(error);
    });

    jobs.process('send signup email', 20, handleSendSignupEmail);

    jobs.process('fetch email', 20, handleFetchEmail);

    jobs.process('parse resume', 20, handleParseResume);

    jobs.promote(60000, 200);
};

exports.stop = function () {
    jobs.shutdown(function (err) {
        logger.log('Kue is shut down.', err || '');
        process.exit(0);
    }, 5000);
};

function handleSendSignupEmail(job, done) {
    mailer.sendSignupEmail(job.data.to, job.data.code, done);
}

function handleFetchEmail(job, done) {
    logger.log('handleFetchEmail ', job.data);
    emailFetcher.fetch(job.data, function (err, count) {
        Email.setActivity({
            time: Date.now(),
            count: count,
            error: err,
            address: job.data.address
        }, function (error) {
            logger.log(error);
            done(err);
        });
    });
}

function handleParseResume(job, done) {
    logger.log('handleParseResume ', job.data);
    try {
        var resume;
        resume = parser.parse(job.data);
        Resume.create(resume, function (err) {
            done(err);
        });
    } catch (err) {
        job.log('error:', err.stack);
        done(err);
    }
}

