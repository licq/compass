var kue = require('kue'),
    mongoose = require('mongoose'),
    Email = mongoose.model('Email'),
    _ = require('lodash'),
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
        _id: email._id
    };

    var fetchEmailAfter = function (minutes, callback) {
        var job = jobs.create('fetch email', data, data._id);
        if (minutes) {
            job.delay(1000 * 60 * minutes);
        }

        job.on('complete', function () {
            logger.log('Fetch ' + email.address + ' complete');
            job.remove(function () {
                fetchEmailAfter(5);
            });
        });
        job.on('failed', function () {
            logger.log('Fetch ' + email.address + ' failed');
            job.remove(function () {
                fetchEmailAfter(10);
            });
        });

        job.save(function (err) {
            if (err) logger.log(err);
            callback && callback(err);
        });
    };

    fetchEmailAfter(0, done);
};

exports.removeFetchEmailJob = function removeFetchEmailJob(email, cb) {
    Job.remove(email._id, cb);
};

exports.findFetchEmailJob = function findFetchEmailJob(email, cb) {
    Job.get(email._id, cb);
};

exports.addParseResumeJob = function (mail, cb) {
    logger.log('addParseResumeJob:',mail._id);
    mail.title = 'parse mail ' + mail._id;
    jobs.create('parse resume', mail).attempts(3).save();
    cb();
};

exports.start = function start() {
    Email.find(function (err, emails) {
        _.forEach(emails, function (email) {
            exports.removeFetchEmailJob(email, function () {
                exports.addFetchEmailJob(email);
            });
        });
    });
};
