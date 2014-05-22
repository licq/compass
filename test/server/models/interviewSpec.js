'use strict';

var mongoose = require('mongoose'),
  expect = require('chai').expect,
  Factory = require('../factory'),
  Resume = mongoose.model('Resume'),
  moment = require('moment'),
  Interview = mongoose.model('Interview'),
  helper = require('../testHelper');

describe('Interview', function () {
  var user,
    resume;

  beforeEach(function (done) {
    helper.clearCollections('Company', 'User', Resume, Interview, function () {
      Factory.create('user', function (createdUser) {
        Factory.create('resume', function (createdResume) {
          user = createdUser;
          resume = createdResume;
          done();
        });
      });
    });
  });

  describe('create', function () {
    it('should create successfully', function (done) {
      Factory.build('interview', {events: [
        {interviewers: [user.id],
          startTime: new Date(),
          duration: 90,
          createdBy: user}
      ]}, function (interview) {
        interview.save(function (err) {
          expect(err).to.not.exist;
          done();
        });
      });
    });

    it('should create interview when no related interview', function (done) {
      Interview.addEvent({
        startTime: new Date(),
        interviewers: [user.id],
        application: resume._id,
        company: user.company,
        createdBy: user._id,
        duration: 90
      }, function (err) {
        expect(err).to.not.exist;
        Interview.findOne({company: user.company, application: resume._id})
          .exec(function (err, interview) {
            expect(err).to.not.exist;
            expect(interview).to.exist;
            expect(interview).to.have.property('company');
            done();
          });
      });
    });

    it('should add to events when related interview existed', function (done) {
      Factory.create('interview', {events: [
        {
          startTime: new Date(),
          duration: 90,
          interviewers: [user.id],
          createdBy: user.id
        }
      ]}, function (createdInterview) {
        Interview.addEvent({
          startTime: new Date(),
          interviewers: [user.id],
          application: createdInterview.application,
          company: createdInterview.company,
          createdBy: user._id,
          duration: 90
        }, function (err, interview) {
          expect(err).to.not.exist;
          expect(interview.id).to.equal(createdInterview.id);
          expect(interview.events).to.have.length(2);
          done();
        });
      });
    });

    it('should change application status to interview', function (done) {
      Factory.create('resume', {status: 'pursued'}, function (resume) {
        Interview.addEvent({application: resume, interviewers: [user.id],
          createdBy: user,
          company: user.company,
          startTime: new Date(),
          duration: 90
        }, function (err) {
          expect(err).to.not.exist;
          Resume.findById(resume._id, function (err, re) {
            expect(re.status).to.equal('interview');
            done();
          });
        });
      });
    });
  });

  describe('validation', function () {
    it('should return errors when with no arguments', function (done) {
      Interview.addEvent({}, function (err) {
        expect(err).to.exist;
        expect(err.errors).to.have.property('events.0.interviewers');
        expect(err.errors).to.have.property('events.0.createdBy');
        expect(err.errors).to.have.property('events.0.duration');
        expect(err.errors).to.have.property('events.0.startTime');
        done();
      });
    });

    it('should return interview company and application errors', function (done) {
      Interview.addEvent({startTime: new Date(),
        duration: 60,
        createdBy: user,
        interviewers: [user]
      }, function (err) {
        expect(err).to.exist;
        expect(err.errors).to.have.property('company');
        expect(err.errors).to.have.property('application');
        done();
      });
    });
  });

  describe('events', function () {
    it('should get all related events of user', function (done) {
      var start = moment([2015, 5, 1, 7, 30, 0, 0]).toDate();
      var end = moment([2015, 5, 1, 7, 31, 0, 0]).toDate();
      Factory.create('interview', {events: [
        {
          startTime: moment([2015, 5, 1, 7, 30, 0, 0]).toDate(),
          duration: 90,
          interviewers: [user._id],
          createdBy: user._id
        }
      ]}, function (createdInterview) {
        Interview.eventsForInterviewer(user.id, start, end, function (err, events) {
          expect(err).to.not.exist;
          expect(events).to.have.length(1);
          expect(events[0].company.toString()).to.equal(createdInterview.company.toString());
          expect(events[0].application.toString()).to.equal(createdInterview.application.toString());
          done();
        });
      });
    });

    it('should update the event', function (done) {
      Factory.create('interview', {events: [
        {
          startTime: new Date(),
          duration: 90,
          interviewers: [user._id],
          createdBy: user._id
        }
      ]}, function (createdInterview) {
        var updatedEventData = {
          startTime: new Date(),
          duration: 60,
          interviewers: [user._id]
        };
        Interview.updateEvent(createdInterview.events[0]._id, updatedEventData, function (err, interview) {
          expect(err).to.not.exist;
          expect(interview.id).to.equal(createdInterview.id);
          expect(interview.events).to.have.length(1);
          var event = interview.events[0];
          expect(event.duration).to.equal(60);
          expect(event.createdBy.toString()).to.equal(user.id);
          done();
        });
      });
    });

    it('should remove the event', function (done) {
      Factory.create('interview', {events: [
        {
          startTime: new Date(),
          duration: 90,
          interviewers: [user._id],
          createdBy: user._id
        }
      ]}, function (createdInterview) {
        Interview.deleteEvent(createdInterview.events[0]._id, function (err, interview) {
          expect(err).to.not.exist;
          expect(interview.id).to.equal(createdInterview.id);
          expect(interview.events).to.have.length(0);
          done();
        });
      });
    });
  });

  describe('retrieve interviews', function () {
    it('should return unprocessed interviews', function (done) {
      Factory.create('interview', {events: [
        {
          startTime: new Date(),
          duration: 90,
          interviewers: [user._id],
          createdBy: user._id
        }
      ]}, function () {
        Interview.unprocessedFor(user, function (err, interviews) {
          expect(err).to.not.exist;
          expect(interviews).to.have.length(1);
          expect(interviews[0].events[0].interviewers[0]).to.have.property('name', user.name);
          done();
        });
      });
    });

    it('should return no interviews when processed', function (done) {
      Factory.create('interview', {
        events: [
          {
            startTime: new Date(),
            duration: 90,
            interviewers: [user._id],
            createdBy: user._id
          }
        ], reviews: [
          {
            interviewer: user._id,
            comment: 'good cio',
            qualified: true
          }
        ]
      }, function () {
        Interview.unprocessedFor(user, function (err, interviews) {
          expect(err).to.not.exist;
          expect(interviews).to.have.length(0);
          done();
        });
      });
    });

    it('should return no interviews when interview has no reviews', function (done) {
      Factory.create('user', function (anotherUser) {
        Factory.create('interview', {
            events: [
              {
                startTime: new Date(),
                duration: 90,
                interviewers: [user._id],
                createdBy: user._id
              }
            ]
          },
          function () {
            Interview.unprocessedFor(anotherUser, function (err, interviews) {
              expect(err).to.not.exist;
              expect(interviews).to.have.length(0);
              done();
            });
          });
      });
    });

    it('should return no interviews when current time is before event start time', function (done) {
      var start = moment().add('days', 1).toDate();
      Factory.create('interview', {
        events: [
          {
            startTime: start,
            duration: 90,
            interviewers: [user._id],
            createdBy: user._id
          }
        ]
      }, function () {
        Interview.unprocessedFor(user, function (err, interviews) {
          expect(err).to.not.exist;
          expect(interviews).to.have.length(0);
          done();
        });
      });
    });
  });
});