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

exports.recreateIndex = function (req, res) {
    Resume.recreateIndex(function (err) {
        if (err) {
            logger.error('recreate elasticsearch index failed: ', err);
            return res.send(500, {err: err});
        }
        res.send(200);
    });
};

exports.synchronizeToEs = function (req, res) {
    req.body.query = req.body.query || {};
    Resume.synchronize(req.body.query, function (err, results) {
        if (err) logger.error('synchronize error:', err);
        logger.info('synchronize elasticsearch using ', results, 'ms');
    });
    res.send(200);
};

function streamResumeTimeout(stream) {
    jobs.inactiveCount(function (err, total) {
        if (total > 50) {
            setTimeout(function () {
                streamResumeTimeout(stream);
            }, 30000);
        } else {
            stream.resume();
        }
    });
}

exports.reparseMails = function (req, res) {
    var query = req.body.query || {};
    if (query.subject) {
        query.subject = new RegExp(query.subject);
    }
    var stream = Mail.find(query).select('html subject company fromAddress date attachments').stream();
    var index = 0;

    stream.on('data', function (mail) {
        index += 1;
        if ((index % 50) === 0) {
            stream.pause();
            setTimeout(function () {
                streamResumeTimeout(stream);
            }, 30000);
        }
        jobs.addParseResumeJob(mail, function () {
            logger.info('add ', index + 'th parse resume job');
        });
    }).on('close', function () {
        logger.info('closed and totally added ', index, ' parse resume jobs');
    }).on('error', function () {
        logger.info('reparseMails error');
    });
    res.send(200);
};