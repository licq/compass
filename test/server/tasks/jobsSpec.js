'use strict';

var jobs = require('../../../server/tasks/jobs'),
    Factory = require('../factory'),
    mongoose = require('mongoose'),
    Company = mongoose.model('Company'),
    Email = mongoose.model('Email'),
    expect = require('chai').expect;


describe.skip('jobs', function () {
    beforeEach(function (done) {
        Company.remove().exec();
        Email.remove().exec();
        done();
    });

    describe('#findFetchEmailJobs', function () {
        it('should find the job using the email address', function (done) {
            Factory.build('email', function (email) {
                jobs.addFetchEmailJob(email, function () {
                    jobs.findFetchEmailJob(email, function (err, job) {
                        expect(err).to.not.exist;
                        expect(job).to.exist;
                        jobs.removeFetchEmailJob(email);
                        done();
                    });
                });

            });
        });
    });

    describe('#removeFetchEmailJob', function () {
        it('should remove the fetch email job', function (done) {
            Factory.build('email', function (email) {
                jobs.addFetchEmailJob(email, function () {
                    jobs.findFetchEmailJob(email, function (err, job) {
                        expect(job).to.exist;
                    });

                    jobs.removeFetchEmailJob(email, function (err) {
                        expect(err).to.not.exist;
                        jobs.findFetchEmailJob(email, function (err) {
                            expect(err).to.exist;
                            done();
                        });
                    });
                });
            });
        });
    });
});