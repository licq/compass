var kue = require('kue'),
    mongoose = require('mongoose'),
    Email = mongoose.model('Email'),
    _ = require('lodash'),
    fetcher = require('./fetcher'),
    Job = kue.Job;

var jobs = kue.createQueue();

function sendSignupEmail(to, code) {
    jobs.create('send signup email', {
        title: 'send signup email to ' + to,
        to: to,
        code: code
    }).priority('high').attempts(3).save();
}

function addFetchEmailJob(email, done) {
    var data = {
        server: email.server,
        address: email.address,
        account: email.account,
        password: email.password,
        port: email.port,
        title: 'fetch email from ' + email.address,
        ssl: email.ssl
    };

    var fetchEmailAfter = function (minutes) {
        var job = jobs.create('fetch email', data, email._id);
        if (minutes) {
            job.delay(1000 * 60 * minutes);
        }

        job.on('complete', function () {
            console.log('Fetch ' + email.address + ' complete');
            job.remove(function () {
                fetchEmailAfter(5);
            });
        });
        job.on('failed', function () {
            console.log('Fetch ' + email.address + ' failed');
            job.remove(function () {
                fetchEmailAfter(5);
            });
        });

        job.save(function (err) {
            if (err) console.log(err);
            done && done(err);
        });
    };

    fetchEmailAfter(0);
}

function removeFetchEmailJob(email, cb) {
    Job.remove(email._id, cb);
}

function findFetchEmailJob(email, cb) {
    Job.get(email._id, cb);
}

module.exports = {
    addFetchEmailJob: addFetchEmailJob,
    sendSignupEmail: sendSignupEmail,
    findFetchEmailJob: findFetchEmailJob,
    removeFetchEmailJob: removeFetchEmailJob
};