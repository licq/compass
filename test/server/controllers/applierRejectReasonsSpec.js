var helper = require('../testHelper'),
  expect = require('chai').expect,
  Factory = require('../factory');

describe('applierRejectReasons', function () {
  var request;

  beforeEach(function (done) {
    helper.clearCollections('User', 'Company', 'Role','ApplierRejectReason', function () {
      Factory.create('applierRejectReason', function () {
        helper.login(function (agent) {
          request = agent;
          done();
        });
      });
    });
  });

  describe('get /api/applierReasons', function () {
    it('should get applierRejectReason list', function (done) {
      request.get('/api/applierRejectReasons')
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