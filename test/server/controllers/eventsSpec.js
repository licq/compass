'use strict';

var app = require('../../../server'),
    request = require('supertest'),
    expect = require('chai').expect,
    Factory = require('../factory'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Company = mongoose.model('Company'),
    helper = require('./helper'),
    Resume = mongoose.model('Resume'),
    Event = mongoose.model('Event'),
    EmailTemplate = mongoose.model('EmailTemplate'),
    moment = require('moment'),
    databaseHelper = require('../databaseHelper');

describe('events', function () {
    var existUser, cookies;

    beforeEach(function (done) {
        databaseHelper.clearCollections(Company, User, Resume, Event, EmailTemplate, function () {
            Factory.create('user', function (user) {
                existUser = user;
                helper.login(user, function (cks) {
                    cookies = cks;
                    done();
                });
            });
        });
    });

    describe('post /api/events', function () {
        it('it should post successfully', function (done) {
            Factory.create('resume', {company: existUser.company}, function (resume) {
                Factory.create('emailTemplate', {company: existUser.company}, function (et) {
                    var eventData = {
                        application: resume.id,
                        time: '2014/05/09 14:00',
                        duration: '90',
                        interviewers: [existUser.id],
                        sendEventAlert: true,
                        emailTemplate: et.id
                    };

                    var req = request(app).post('/api/events');
                    req.cookies = cookies;
                    req.send(eventData)
                        .expect(200)
                        .end(done);
                });
            });
        });

        it('should return error if no arguments given', function (done) {
            var req = request(app).post('/api/events');
            req.cookies = cookies;
            req.send({})
                .expect(400)
                .expect('content-type', /json/)
                .end(function (err, res) {
                    expect(res.body.err.message).to.exist;
                    expect(res.body.err.errors).to.have.property('application');
                    done();
                });
        });
    });

    describe('get /api/events', function () {
        it('should get back event list correctly', function (done) {
            var date = moment.utc().format('YYYY-MM-DD');
            Factory.create('resume', {company: existUser.company}, function (resume) {
                Factory.create('event', {application: resume,
                    interviewers: [existUser.id]}, function () {
                    var req = request(app).get('/api/events?startDate=' + date + '&endDate=' + date + '&user=' + existUser.id);
                    req.cookies = cookies;

                    req.expect(200)
                        .expect('content-type', /json/)
                        .end(function (err, res) {
                            expect(err).to.not.exist;
                            expect(res.body).to.have.length(1);
                            done();
                        });
                });
            });

        });
    });
});
