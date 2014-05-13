'use strict';

var expect = require('chai').expect,
  Factory = require('../factory'),
  moment = require('moment'),
  helper = require('../testHelper');

describe('events', function () {
  var existUser, request;

  beforeEach(function (done) {
    helper.clearCollections('Company', 'User', 'Resume', 'Event', 'EmailTemplate', function () {
      helper.login(function (agent, user) {
        request = agent;
        existUser = user;
        done();
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

          request.post('/api/events')
            .send(eventData)
            .expect(200, done);
        });
      });
    });

    it('should return error if no arguments given', function (done) {
      request.post('/api/events')
        .send({})
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
      var startTime = moment().add('h',-1).toISOString();
      var endTime = moment().add('h',1).toISOString();
      Factory.create('resume', {company: existUser.company}, function (resume) {
        Factory.create('event', {application: resume,
          interviewers: [existUser.id]}, function () {
          request
            .get('/api/events?startTime=' + startTime + '&endTime=' + endTime + '&user=' + existUser.id)
            .expect(200)
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
