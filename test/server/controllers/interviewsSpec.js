'use strict';

var helper = require('../testHelper'),
  Factory = require('../factory'),
  expect = require('chai').expect;

describe('interviews', function () {

  var user, resume, request;

  beforeEach(function (done) {
    helper.clearCollections('Company', 'User', 'Interview', 'Resume', function () {
      helper.login(function (agent, createdUser) {
        Factory.create('resume', function (createdResume) {
          resume = createdResume;
          user = createdUser;
          request = agent;
          done();
        });
      });
    });
  });

  describe('GET /api/interviews?status=unprocess', function () {
    it('should get back a list of interviews', function (done) {
      Factory.create('interview', {
        company: user.company,
        events: [
          {
            startTime: new Date(),
            duration: 90,
            interviewers: [user._id],
            createdBy: user._id
          }
        ]
      }, function () {
        request.get('/api/interviews?status=unprocessed')
          .expect('Content-type', /json/)
          .expect(200)
          .end(function (err, res) {
            if (err) {
              return done(err);
            }
            expect(res.body).to.have.length(1);
            done();
          });
      });
    });
  });

  describe('get /api/interviews/:id', function () {
    it('should return one interview', function (done) {
      Factory.create('interview', {
        company: user.company,
        events: [
          {
            startTime: new Date(),
            duration: 90,
            interviewers: [user._id],
            createdBy: user._id
          }
        ]
      }, function (interview) {
        request.get('/api/interviews/' + interview._id)
          .expect('Content-type', /json/)
          .expect(200)
          .end(function (err, res) {
            if (err) {
              return done(err);
            }
            expect(res.body).to.have.property('_id');
            expect(res.body.events[0].interviewers[0]).to.have.property('name');
            done();
          });
      });
    });
  });
});