var ApplierRejectReason = require('mongoose').model('ApplierRejectReason'),
  helper = require('../testHelper'),
  expect = require('chai').expect,
  Factory = require('../factory');

describe('ApplierRejectReason', function () {
  var applierRejectReason;

  describe('ApplierRejectionReason initialization', function () {

    it('should get an applierRejectReason list', function (done) {
      ApplierRejectReason.count(function (err, count) {
        expect(err).to.not.exist;
        expect(count).gte(0);
        done();
      });
    });
  });

  describe('ApplierRejection operations', function () {
    beforeEach(function (done) {
      helper.clearCollections('ApplierRejectReason', function () {
        Factory.create('applierRejectReason', function (newApplierRejectReason) {
          applierRejectReason = newApplierRejectReason;
          done();
        });
      });
    });

    it('should get an applierRejectReason list', function (done) {
      helper.clearCollections('ApplierRejectReason', function () {
        Factory.create('applierRejectReason', function (newApplierRejectReason) {
          applierRejectReason = newApplierRejectReason;
          ApplierRejectReason.find({}, function (err, results) {
            expect(err).to.not.exist;
            expect(results.length).to.equal(1);
            done();
          });
        });
      });
    });
  });
});