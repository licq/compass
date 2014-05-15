'use strict';

var
  EventSetting = require('mongoose').model('EventSetting'),
  helper = require('../testHelper'),
  expect = require('chai').expect,
  Factory = require('../factory');

describe('EventSetting', function () {
  beforeEach(function (done) {
    helper.clearCollections('Company', 'User', EventSetting, done);
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
  });
});

