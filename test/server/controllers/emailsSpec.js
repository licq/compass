var Factory = require('../factory'),
  expect = require('chai').expect,
  helper = require('../testHelper');

describe('emails', function () {
  var request;

  beforeEach(function (done) {
    helper.clearCollections('Email', 'User', 'Company', function () {
      helper.login(function (agent) {
        request = agent;
        Factory.create('email', function () {
          done();
        });
      });
    });
  });
  describe('get /api/emailCount', function () {
    it('should return 1', function (done) {
      request.get('/api/emailCount')
        .expect(200)
        .end(function (err, res) {
          expect(err).to.not.exist;
          expect(res.body.emailCount).to.equal(1);
          done();
        });
    });
  });
});