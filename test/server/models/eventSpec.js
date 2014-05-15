'use strict';

var mongoose = require('mongoose'),
  expect = require('chai').expect,
  Factory = require('../factory'),
  Resume = mongoose.model('Resume'),
  moment = require('moment'),
  Event = mongoose.model('Event'),
  helper = require('../testHelper');

describe('Event', function () {
  var user;

  beforeEach(function (done) {
    helper.clearCollections('Company', 'User', Resume, Event, function () {
      Factory.create('user', function (createdUser) {
        user = createdUser;
        done();
      });
    });
  });

  describe('create', function () {
    it('should create successfully', function (done) {
      Factory.build('event', {interviewers: [user.id]}, function (event) {
        event.save(function (err) {
          expect(err).to.not.exist;
          done();
        });
      });
    });

    it('should have endTime property', function (done) {
      Factory.build('event', {interviewers: [user.id],
        startTime: moment([2012, 5, 1, 8, 0, 0, 0]).toDate(),
        duration: 90}, function (event) {
        expect(event.endTime.toString()).to.equal(moment([2012, 5, 1, 9, 30, 0, 0]).toDate().toString());
        done();
      });
    });

    it('should have attributes', function (done) {
      Factory.create('event', {interviewers: [user.id]}, function (evt) {
        Event.findById(evt._id, function (err, event) {
          expect(event).to.have.property('startTime');
          expect(event).to.have.property('interviewers');
          expect(event).to.have.property('createdBy');
          done();
        });
      });
    });

    it('should auto generate some attributes', function (done) {
      Factory.create('event', {interviewers: [user.id]}, function (event) {
        expect(event).to.have.property('name');
        expect(event).to.have.property('email');
        expect(event).to.have.property('mobile');
        expect(event).to.have.property('applyPosition');
        expect(event).to.have.property('company');
        done();
      });
    });

    it('should change application status to interview', function (done) {
      Factory.create('resume', {status: 'pursued'}, function (resume) {
        Factory.build('event', {application: resume, interviewers: [user.id]}, function (event) {
          event.save(function () {
            setTimeout(function () {
              Resume.findById(resume._id, function (err, re) {
                expect(re.status).to.equal('interview');
                done();
              });
            }, 500);
          });
        });
      });
    });
  });

  describe('validation', function () {
    it('should return errors when with no arguments', function (done) {
      new Event().save(function (err) {
        expect(err).to.exist;
        expect(err.errors).to.have.property('startTime');
        expect(err.errors).to.have.property('application');
        expect(err.errors).to.have.property('interviewers');
        expect(err.errors).to.have.property('createdBy');
        expect(err.errors).to.have.property('duration');
        done();
      });
    });
  });
});