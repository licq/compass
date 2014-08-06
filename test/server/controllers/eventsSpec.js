'use strict';

var expect = require('chai').expect,
  Factory = require('../factory'),
  moment = require('moment'),
  Interview = require('mongoose').model('Interview'),
  helper = require('../testHelper');

describe('events', function () {
  var user, request;

  beforeEach(function (done) {
    helper.clearCollections('Company', 'User', 'Role', 'Resume', 'Interview', 'EventSetting', function () {
      helper.login(function (agent, createdUser) {
        request = agent;
        user = createdUser;
        done();
      });
    });
  });

  describe('post /api/events', function () {
    it('should post successfully', function (done) {
      Factory.create('resume', {company: user.company}, function (resume) {
        var eventData = {
          application: resume.id,
          startTime: moment().toISOString(),
          duration: '90',
          interviewers: [user.id],
        };

        request.post('/api/events')
          .send(eventData)
          .expect(200, done);
      });
    });

    it('should return error if no arguments given', function (done) {
      request.post('/api/events')
        .send({})
        .expect(400)
        .expect('content-type', /json/)
        .end(function (err, res) {
          expect(res.body.err.message).to.exist;
          expect(res.body.err.errors).to.have.property('events.0.startTime');
          done();
        });
    });
  });

  describe('get /api/events', function () {
    it('should get back event list correctly', function (done) {
      var startTime = moment().subtract(1, 'h').toISOString();
      var endTime = moment().add(1, 'h').toISOString();
      Factory.create('resume', {company: user.company}, function (resume) {
        Interview.addEvent({application: resume,
          interviewers: [user.id],
          startTime: new Date(),
          duration: 90,
          company: user.company,
          createdBy: user,
          status: 'new'
        }, function () {
          request
            .get('/api/events?startTime=' + startTime + '&endTime=' + endTime + '&user=' + user.id)
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

  describe('get /api/events/availableInterviewers', function () {
    it('should get back all users if id not specified', function (done) {
      request
        .get('/api/events/availableInterviewers')
        .expect(200)
        .expect('content-type', /json/)
        .end(function (err, res) {
          expect(err).to.not.exist;
          expect(res.body).to.have.length(1);
          done();
        });
    });

    it('should get back non users if application id specified and event id not specified', function (done) {
      Factory.create('resume', {company: user.company}, function (resume) {
        Interview.addEvent({application: resume,
          interviewers: [user.id],
          startTime: new Date(),
          duration: 90,
          company: user.company,
          createdBy: user,
          status: 'new'
        }, function () {
          request
            .get('/api/events/availableInterviewers?application=' + resume.id)
            .expect(200)
            .expect('content-type', /json/)
            .end(function (err, res) {
              expect(err).to.not.exist;
              expect(res.body).to.have.length(0);
              done();
            });
        });
      });
    });

    it('should get back all users if application id specified and event id specified', function (done) {
      Factory.create('resume', {company: user.company}, function (resume) {
        Interview.addEvent({application: resume,
          interviewers: [user.id],
          startTime: new Date(),
          duration: 90,
          company: user.company,
          createdBy: user,
          status: 'new'
        }, function (err, interview) {
          request
            .get('/api/events/availableInterviewers?application=' + resume.id + '&id=' + interview.events[0].id)
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

  describe('put /api/events/:id', function () {
    it('should update event', function (done) {
      var startTime = moment().subtract(1, 'h').toISOString();
      Factory.create('resume', {company: user.company}, function (resume) {
        Interview.addEvent({application: resume,
          interviewers: [user.id],
          startTime: new Date(),
          duration: 90,
          company: user.company,
          createdBy: user
        }, function (err, interview) {
          var id = interview.events[0].id;
          request
            .put('/api/events/' + id)
            .send({
              duration: 20,
              startTime: startTime
            })
            .expect(200, function (err) {
              if (err) {
                return done(err);
              }
              Interview.findById(interview._id, function (err, interview) {
                var event = interview.events[0];
                expect(event.duration).to.equal(20);
                expect(event.startTime.toISOString()).to.equal(startTime);
                done(err);
              });
            });
        });
      });
    });
  });

  describe('delete /api/events/:id', function () {
    it('should delete event', function (done) {
      Factory.create('resume', {company: user.company}, function (resume) {
        Interview.addEvent({application: resume,
          interviewers: [user.id],
          startTime: new Date(),
          duration: 90,
          company: user.company,
          createdBy: user
        }, function (err, interview) {
          var event = interview.events[0];
          request
            .del('/api/events/' + event.id)
            .expect(200, function (err) {
              if (err) {
                return done(err);
              }
              Interview.findById(interview.id, function (err, interview) {
                expect(interview.events).to.have.length(0);
                done(err);
              });
            });
        });
      });
    });
  });
});
