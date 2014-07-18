'use strict';

var ApplicationSetting = require('mongoose').model('ApplicationSetting'),
  helper = require('../testHelper'),
  expect = require('chai').expect,
  Factory = require('../factory');

describe('ApplicationSetting', function () {
  beforeEach(function (done) {
    helper.clearCollections('Company', 'User', 'Interview', ApplicationSetting, done);
  });

  describe('#create', function () {
    it('should create an applicationSetting', function (done) {
      Factory.build('applicationSetting', function (applicationSetting) {
        applicationSetting.save(function (err) {
          expect(err).to.not.exist;
          done();
        });
      });
    });

    it('should have the right defaults', function (done) {
      Factory.create('company', function (company) {
        new ApplicationSetting({company: company}).save(function(err,as){
          expect(err).to.not.exist;
          expect(as.positionRightControlled).to.be.false;
          expect(as.filterSamePerson).to.equal(0);
          expect(as.rejectLetterToApplier).to.be.false;
          expect(as.rejectLetterToApplierTemplate).to.exist;
          done();
        });
      });
    });

    it('should show error one applicationSetting for the same company exist', function (done) {
      Factory.create('applicationSetting', function (applicationSetting) {
        Factory.build('applicationSetting', {company: applicationSetting.company}, function (newApplicationSetting) {
          newApplicationSetting.save(function (err) {
            expect(err).to.exist;
            expect(err.code).to.equal(11000);
            done();
          });
        });
      });
    });
  });
});
