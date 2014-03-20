var kue = require('kue'),
    mailer = require('./mailer');

function TaskRunner() {
    this.jobs = kue.createQueue();
}

TaskRunner.prototype.init = function () {
    this.jobs.process('send signup email', 20, function (job, done) {
        mailer.sendSignupEmail(job.data.to, job.data.code);
        done();
    });
};

TaskRunner.prototype.restart = function () {

};


TaskRunner.prototype.sendSignupEmail = function (to, code) {
    this.jobs.create('send signup email', {
        title: 'send signup email to ' + to,
        to: to,
        code: code
    }).save();
};

module.exports = new TaskRunner();

