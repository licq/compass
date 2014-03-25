var kue = require('kue'),
    mailer = require('./mailer'),
    mongoose = require('mongoose'),
    Email = mongoose.model('Email'),
    _ = require('lodash'),
    fetcher = require('./fetcher');

var jobs = kue.createQueue();

exports.start = function () {
    jobs.on('error', function (error) {
        console.log(error);
    });

    jobs.process('send signup email', 20, handleSendSignupEmail);

    jobs.process('fetch email', 20, handleFetchEmail);

    jobs.promote(60000, 200);
};

exports.stop = function () {
    jobs.shutdown(function (err) {
        console.log('Kue is shut down.', err || '');
        process.exit(0);
    }, 5000);
};

function handleSendSignupEmail(job, done) {
    mailer.sendSignupEmail(job.data.to, job.data.code, done);
}

function handleFetchEmail(job, done) {
    fetcher.fetch(job.data, function (err, count) {
        Email.setActivity({
            time: Date.now(),
            count: count,
            error: err,
            address: job.data.address
        }, function (error) {
            done(err);
        });
    });
}

