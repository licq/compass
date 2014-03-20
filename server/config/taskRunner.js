var kue = require('kue'),
    mailer = require('./mailer'),
    mongoose = require('mongoose'),
    Email = mongoose.model('Email'),
    _ = require('lodash');

function TaskRunner() {
    this.jobs = kue.createQueue();
}

TaskRunner.prototype.init = function () {
    var self = this;
    this.jobs.process('send signup email', 20, function (job, done) {
        mailer.sendSignupEmail(job.data.to, job.data.code, done);
    });

    this.jobs.process('fetch email', 20, function (job, done) {
        console.log('fetch email of ' + job.data.address);
        self.jobs.create('fetch email', job.data).delay(1000 * 60 * 5).save();
        done();
    });

    this.jobs.promote();

    this.loadAllFetchTasks();
};

TaskRunner.prototype.loadAllFetchTasks = function () {
    var self = this;
    Email.find({}, function (err, emails) {
        _.forEach(emails, function (email) {
            self.addEmailFetcher(email);
        }, self);
    });
};

TaskRunner.prototype.restart = function () {

};


TaskRunner.prototype.sendSignupEmail = function (to, code) {
    this.jobs.create('send signup email', {
        title: 'send signup email to ' + to,
        to: to,
        code: code
    }).attempts(3).save();
};

TaskRunner.prototype.addEmailFetcher = function (email) {
    this.jobs.create('fetch email', email).priority('high').attempts(3).save();
};

module.exports = new TaskRunner();

