var ApplierRejectReason = require('mongoose').model('ApplierRejectReason'),
  helper = require('../testHelper'),
  expect = require('chai').expect,
  Factory = require('../factory');

describe('ApplierRejectReason', function () {
  var applierRejectReason;
  beforeEach(function (done) {
    helper.clearCollections('ApplierRejectReason', function () {
      Factory.create('applierRejectReason', function (newApplierRejectReason) {
        applierRejectReason = newApplierRejectReason;
        done();
      });
    });
  });

  it('should get an applierRejectReason list', function (done) {
    ApplierRejectReason.find({}, function (err, results) {
      expect(err).to.not.exist;
      expect(results.length).to.equal(1);
      done();
    });
  });
});