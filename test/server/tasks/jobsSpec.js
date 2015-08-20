'use strict';

var jobs = require('../../../server/tasks/jobs'),
    kue = require('kue'),
    config = require('../../../server/config/config'),
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

    describe('#testBufferData', function () {

        it('should return data as buffer', function (done) {
            this.timeout(0);
            var data = {buffer: new Buffer('testt'), inte: 2, str: 'strings'};
            var works = kue.createQueue({
                prefix: config.redis.prefix,
                redis: {
                    port: config.redis.port,
                    host: config.redis.host,
                    options: {detect_buffers: true}
                }
            });

            works.create('testJob1', data).save(function () {
                works.process(new Buffer('testJob1'), 1, function (job, ok) {
                    console.log('data', job.data);
                    ok();
                    done();
                });
            });
        });
    });

    //describe('#redis', function () {
    //    it.only('should return buffer', function (done) {
    //    this.timeout(0);
    //        var redis = require("redis"),
    //            client = redis.createClient(config.redis.port, config.redis.host, {detect_buffers: true});
    //
    //        client.set("foo_rand000000000000", new Buffer('test'));
    //
    //         //This will return a JavaScript String
    //        client.get("foo_rand000000000000", function (err, reply) {
    //            console.log('1: ', reply); // Will print `OK`
    //        });
    //
    //        // This will return a Buffer since original key is specified as a Buffer
    //        client.get(new Buffer("foo_rand000000000000"), function (err, reply) {
    //            console.log('2: ',reply); // Will print `<Buffer 4f 4b>`
    //            client.end();
    //            done();
    //        });
    //
    //    })
    //})
});