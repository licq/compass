var kue = require('kue'),
    mailer = require('./mailer'),
    mongoose = require('mongoose'),
    Email = mongoose.model('Email'),
    _ = require('lodash'),
    fetcher = require('./fetcher');

var jobs = kue.createQueue();

exports.start = function () {
    jobs.process('send signup email', 20, handleSendSignupEmail);

    jobs.process('fetch email', 20, handleFetchEmail);

    jobs.promote(60000,200);
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
    console.log('fetch email of ' + job.data.address);
    fetcher.fetch(job.data, function (err) {
        console.log(err);
        jobs.create('fetch email', job.data).delay(1000 * 60 * 10).save();
        done(err);
    });
}

