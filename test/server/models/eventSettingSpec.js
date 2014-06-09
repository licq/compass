'use strict';

var
  EventSetting = require('mongoose').model('EventSetting'),
  helper = require('../testHelper'),
  expect = require('chai').expect,
  Factory = require('../factory');

describe('EventSetting', function () {
  beforeEach(function (done) {
    helper.clearCollections('Company', 'User', 'Interview', EventSetting, done);
  });

  describe('#create', function () {
    it('should create an eventSetting', function (done) {
      Factory.build('eventSetting', function (eventSetting) {
        eventSetting.save(function (err, saved) {
          expect(err).to.not.exist;
          expect(saved.createdAt).to.exist;
          done();
        });
      });
    });

    it('should show error one eventSetting for the same company exist', function (done) {
      Factory.create('eventSetting', function (eventSetting) {
        Factory.build('eventSetting', {company: eventSetting.company}, function (newEventSetting) {
          newEventSetting.save(function (err) {
            expect(err).to.exist;
            expect(err.code).to.equal(11000);
            done();
          });
        });
      });
    });

    it('should generate email contents', function (done) {
      Factory.create('user', function (user) {
        Factory.create('eventSetting', {newToApplier: true, newTemplateToApplier: '',
            newToInterviewer: true, newTemplateToInterviewer: '', createdBy: user, company: user.company },
          function (eventSetting) {
            EventSetting.generateEmails('new', {interviewers: [eventSetting.createdBy],
              email: 'aa@aa.com',
              applyPosition: 'cio',
              startTime: new Date(),
              duration: 90,
              company: user.company
            }, function (err, emails) {
              expect(err).to.not.exist;
              expect(emails).to.have.length(2);
              expect(emails[0].to).to.deep.equal(['aa@aa.com']);
              expect(emails[0].subject).to.equal('面试提醒');
              expect(emails[1].to[0]).to.equal(user.email);
              done();
            });
          });
      });
    });

    it('should generate 0 emails', function (done) {
      EventSetting.generateEmails('new', {}, function (err, emails) {
        expect(err).to.not.exist;
        expect(emails).to.have.length(0);
        done();
      });
    });
  });
}) ;
