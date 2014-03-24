var kue = require('kue'),
    mongoose = require('mongoose'),
    Email = mongoose.model('Email'),
    _ = require('lodash'),
    fetcher = require('./fetcher');

var jobs = kue.createQueue();

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
    }).priority('high').attempts(3).save();
}

function addEmailToJobs(email) {
    email.title = 'Fetch Email from ' + email.address;
    var fetchEmailAfter = function (minutes) {
        var job = jobs.create('fetch email', email).delay(1000 * 60 * minutes).save();

        job.on('complete', function () {
            console.log('Fetch ' + email.address + ' complete');
            fetchEmailAfter(email, 5);
        });
        job.on('failed', function () {
            console.log('Fetch ' + email.address + ' failed');
            fetchEmailAfter(email, 5);
        });
    };

    fetchEmailAfter(0);
}

module.exports = {
    addEmailToJobs: addEmailToJobs,
    sendSignupEmail: sendSignupEmail
};