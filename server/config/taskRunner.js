var kue = require('kue'),
    mailer = require('./mailer'),
    mongoose = require('mongoose'),
    Email = mongoose.model('Email'),
    _ = require('lodash'),
    fetcher = require('./fetcher');

var jobs = kue.createQueue();

function init() {
    jobs.process('send signup email', 20, function (job, done) {
        mailer.sendSignupEmail(job.data.to, job.data.code, done);
    });

    jobs.process('fetch email', function (job, done) {
        console.log('fetch email of ' + job.data.address);
        fetcher.fetch(job.data, function (err) {
            console.log(err);
            jobs.create('fetch email', job.data).delay(1000 * 60 ).save();
            done();
        });
    });

    process.once('SIGTERM', function (sig) {
        console.log('process exit');
        jobs.shutdown(function (err) {
            console.log('Kue is shut down.', err || '');
            process.exit(0);
        }, 5000);
    });

    jobs.promote();

    console.log('taskRunner start');

//    loadAllFetchTasks();
}

function loadAllFetchTasks() {
    Email.find({}, function (err, emails) {
        _.forEach(emails, function (email) {
            addEmailFetcher(email);
        });
    });
}

function sendSignupEmail(to, code) {
    jobs.create('send signup email', {
        title: 'send signup email to ' + to,
        to: to,
        code: code
    }).attempts(3).save();
}

function addEmailFetcher(email) {
    var job = jobs.create('fetch email', email).priority('high').attempts(3);
    job.on('complete',function () {
        console.log("Fetch " + email.address + ' complete');
    }).on('failed',function () {
            console.log("Job failed");
        }).on('progress', function (progress) {
            process.stdout.write('\r  job #' + job.id + ' ' + progress + '% complete');
        });
    job.save();
}

module.exports = {
    init: init,
    addEmailFetcher: addEmailFetcher,
    sendSignupEmail: sendSignupEmail
};