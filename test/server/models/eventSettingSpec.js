'use strict';

var
  EventSetting = require('mongoose').model('EventSetting'),
  helper = require('../testHelper'),
  expect = require('chai').expect,
  Factory = require('../factory');

describe('EventSetting', function () {
  beforeEach(function (done) {
    helper.clearCollections('Company', 'User', 'Event', EventSetting, done);
  });

  describe('#create', function () {
    it('should create an eventSetting', function (done) {
      Factory.build('eventSetting', function (eventSetting) {
        eventSetting.save(function (err, saved) {
          expect(err).to.not.exist;
          expect(saved.created_at).to.exist;
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
      Factory.create('eventSetting', {newToApplier: true, newTemplateToApplier: '',
          newToInterviewer: true, newTemplateToInterviewer: ''},
        function (eventSetting) {
          Factory.build('event', {interviewers: [eventSetting.createdBy],
            email: 'aa@aa.com',
            company: eventSetting.company}, function (event) {
            EventSetting.generateEmails('new', event, function (err, emails) {
              expect(err).to.not.exist;
              expect(emails).to.have.length(2);
              expect(emails[0].to).to.deep.equal([event.email]);
              expect(emails[0].subject).to.equal('面试提醒');
              expect(emails[1].to[0]).to.equal(eventSetting.createdBy.email);
              done();
            });
          });
        });
    });
    it('should generate 0 emails', function (done) {
      Factory.build('event', function (event) {
        EventSetting.generateEmails('new', event, function (err, emails) {
          expect(err).to.not.exist;
          expect(emails).to.have.length(0);
          done();
        });
      });
    });
  });
});
